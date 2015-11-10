(function () {
    angular
        .module('app')
        .directive('soSmartMeter', Directive);

    /**
     *
     */
    Directive.$inject = ['$timeout'];
    function Directive($timeout) {
        return {
            restrict: 'E',
            scope: {
                id: '=',
                metric: '=',
                channels: '=',
                data: '=',
                initialized: '&',
                from: '=',
                to: '='
            },
            controller: Controller,
            controllerAs: 'sm',
            templateUrl: 'common/directives/smart-meter/smart-meter.html'
        }
    }

    Controller.$inject = ['$scope', '$http', 'API_URL'];
    function Controller($scope, $http, API_URL) {
        var vm = this;

        vm.id = $scope.id;
        vm.info = $scope.data;
        vm.metric = $scope.metric;
        vm.channels = _.range($scope.channels);
        vm.channel = 1;
        vm.loading = false;
        vm.refresh = refresh;
        vm.initialized = $scope.initialized;
        vm.from = $scope.from;
        vm.to = $scope.to;

        vm.chartOptions = {
            type: 'line',
            elements: {
                line: {
                    tension: 0,
                    //fill: false,
                    borderWidth: 2
                },
                point: {
                    radius: 3,
                    hoverBorderWidth: 2
                },
            },
            gridLines: {
                show: false
            },
            scales: {
                xAxes: [{
                    //display: false
                    type: 'time',
                    time: {
                        unit: 'hour',
                        //round: 'day',
                    }
                }],
                yAxes: [{
                    //display: false
                }]
            }
        };

        vm.lineChart = null;

        initialize();

        ////////

        function initialize() {
            refresh();
        }

        /**
         *
         */
        function labels(metric, channel) {

            if (metric == 'ambientale') {
                switch (channel) {
                    case 0: return 'Temperatura (°C)';
                    case 1: return 'Umidità (%Rh)';
                    case 2: return 'CO2 (Ppm)';
                }
            } else if (metric == 'energia_elettrica') {
                switch (channel) {
                    case 0: return 'Energia Elettrica (KWh)';
                    case 1: return 'Energia Reattiva (Kvarh)';
                }
            }
        }

        /**
         *
         */
        function chartSmartMeterData(rows) {
            var lineChart = {
                labels: [],
                datasets: [
                    {
                        label: 'Valore',
                        borderColor: 'rgba(35,183,229,1)',
                        backgroundColor: 'rgba(35,183,229,.25)',
                        pointBackgroundColor: 'rgba(35,183,229,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(35,183,229,1)',
                        data: []
                    }
                ]
            };

            /*
            scales: {
                xAxes: [{
                    type: "time",
                    display: true,
                    time: {
                        format: 'MM/DD/YYYY HH:mm',
                        // round: 'day'
                    },
                    scaleLabel: {
                        show: true,
                        labelString: 'Date'
                    }
                }, ],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        show: true,
                        labelString: 'value'
                    }
                }]

            */



            //lineChart.labels = _.keys(rows.dps);
            //lineChart.datasets[0].data = _.values(rows.dps);
            lineChart.datasets[0].data = _.map(rows.dps, function (v, k) {
                return {
                    x: k * 1000,
                    y: v
                }
            });

            console.log(rows.dps);

            return lineChart;
        }

        /**
         *
         */
        function refresh(channel) {

            /*if (!force && store.get('weather')) {
                vm.data = store.get('weather');
                vm.lineChart = chartTempForecastData(vm.data.previsioni);
                return;
            }*/

            channel || (channel = 0);

            vm.loading = true;
            //vm.lineChart = null;

            console.debug(API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + (channel + 1) + '?start=' + new Date(vm.from).getTime() + '&end=' + new Date(vm.to).getTime() + '&downsample=1h-avg');


            $http.get(API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + (channel + 1) + '?start=' + new Date(vm.from).getTime() + '&end=' + new Date(vm.to).getTime() + '&downsample=1h-avg')
                .then(function (res) {
                    vm.data = res.data.payload;
                    vm.lineChart = chartSmartMeterData(vm.data[0]);
                    vm.channel = channel;
                    vm.title = labels(vm.metric, channel);
                    vm.initialized();
                    console.debug('Fetching smart meter data… Done', vm.data);
                })
                .catch(function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                })
                .finally(function () {
                    vm.loading = false;
                })
        }
    }
})();
