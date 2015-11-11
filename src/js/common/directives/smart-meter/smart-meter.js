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

        vm.chartData = null;
        vm.chartOptions = {
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%d/%m/%y %H:%M',
                        count: 6,
                    }
                },
                y: {
                    tick: {
                        format: d3.format('.4f')
                    }
                }
            },
            subchart: {
                show: true
            }
        };

        initialize();

        ////////

        function initialize() {
            refresh();
        }

        /**
         *
         */
        function updateChartData(rows) {
            var data = {
                x: 'x',
                columns: [
                    ['x'],
                    ['val']
                ]
            };

            _.each(rows.dps, function (v, k) {
                data.columns[0].push(k * 1000);
                data.columns[1].push(v);
            });

            return data;
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
        function refresh(channel) {

            /*if (!force && store.get('weather')) {
                vm.data = store.get('weather');
                vm.lineChart = chartTempForecastData(vm.data.previsioni);
                return;
            }*/

            channel || (channel = 0);

            vm.loading = true;

            $http.get(API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + (channel + 1) + '?start=' + new Date(vm.from).getTime() + '&end=' + new Date(vm.to).getTime() + '&downsample=15m-avg')
                .then(function (res) {
                    vm.data = res.data.payload;

                    vm.title = labels(vm.metric, channel);
                    vm.channel = channel;
                    vm.chartData = updateChartData(vm.data[0]);
                    vm.initialized();

                    console.debug('Fetching smart meter data… Done', vm.data);
                })
                .catch(function (err) {
                    vm.error = err.data ? err.data.message : 'Impossibile contattare il server.';
                })
                .finally(function () {
                    vm.loading = false;
                })
        }
    }
})();
