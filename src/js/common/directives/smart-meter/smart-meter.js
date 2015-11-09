(function () {
    angular
        .module('app')
        .directive('soSmartMeter', Directive);

    /**
     *
     */
    Directive.$inject = [];
    function Directive() {
        return {
            restrict: 'E',
            scope: {
                id: '=',
                metric: '=',
                channels: '=',
                data: '='
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

        vm.lineOptions = {
          scaleShowGridLines: false,
          bezierCurve : false,
          //showScale: false,
          //pointDotRadius : 4,
          //pointDotStrokeWidth : 1,
          pointHitDetectionRadius : 0,
          //datasetStroke : false,
          pointDot: false,
          datasetStrokeWidth : 2,
          datasetFill : false,
          maintainAspectRatio: false,
          //showTooltips: false,
          pointHitDetectionRadius : 0,
          animation: false,
          legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
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
                        label: 'Max.',
                        strokeColor: 'rgba(35,183,229,1)',
                        pointColor: 'rgba(35,183,229,1)',
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: 'rgba(35,183,229,1)',
                        data: []
                    }
                ]
            };

            _.each(rows.dps, function (el, k) {
                var
                    time = new Date(k*1000);
                lineChart.labels.push(time.getDate() + '/' + (time.getMonth() + 1) + ' ' + time.getHours() + ':' + time.getMinutes());
                lineChart.datasets[0].data.push(el.toFixed(4));
            })

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

            console.debug('Fetching smart meter data…', API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + channel + '?start=12h-ago&downsample=1h-avg');

            $http.get(API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + (channel + 1) + '?start=36h-ago&downsample=1h-avg')
                .then(function (res) {
                    vm.data = res.data.payload;
                    vm.lineChart = chartSmartMeterData(vm.data[0]);
                    vm.channel = channel;
                    vm.title = labels(vm.metric, channel);
                    console.debug('Fetching smart meter data… Done');
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
