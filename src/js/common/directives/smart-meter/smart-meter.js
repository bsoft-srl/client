(function () {
    angular
        .module('app')
        .directive('soSmartMeter', directive);

    /**
     *
     */
    directive.$inject = [];
    function directive() {
        return {
            restrict: 'E',
            scope: {
                id: '=',
                metric: '=',
                channels: '=',
                data: '=',
                initialized: '&',
                start: '=',
                end: '='
            },
            controller: controller,
            controllerAs: 'sm',
            templateUrl: 'common/directives/smart-meter/smart-meter.html'
        }
    }

    /**
     *
     */
    controller.$inject = ['$scope', '$http', 'API_URL'];
    function controller($scope, $http, API_URL) {
        var vm = this;

        vm.id = $scope.id;
        vm.info = $scope.data;
        vm.metric = $scope.metric;
        vm.loading = false;
        vm.refresh = refresh;

        /* */
        vm.channels = _.range($scope.channels);
        vm.channel = 1;

        /* */
        vm.start = $scope.start;
        vm.end = $scope.end;

        /* */
        vm.chartData = null;
        vm.chartOptions = null;

        //refresh();

        /**
         *
         */
        function parseStart(date, raw) {
             var retval = moment(date, 'DD-MM-YYYY').startOf('day');
             return raw ? retval : retval.valueOf();
        }

        /**
         *
         */
        function parseEnd(date, raw) {
              var retval = moment(date, 'DD-MM-YYYY').endOf('day');
              return raw ? retval : retval.valueOf();
        }

        vm.init = false;

        $scope.$watch('start', function (newvalue, oldvalue) {
            if (!vm.loading) {
                vm.start = newvalue;
                refresh();
            }
        });

        $scope.$watch('end', function (newvalue, oldvalue) {
            if (!vm.loading) {
                vm.end = newvalue;
                refresh();
            }
        });

        /**
         *
         */
        function updateChartData(rows) {
            var dataPoints = [];

            _.each(rows.dps, function (v, k) {
                dataPoints.push({
                    label: moment.unix(k).format('DD MMM YYYY HH:mm'),
                    y: v
                })
            });

            return [{
                type: 'area',
                fillOpacity: .25,
                lineThickness: 1,
                color: '#286090',
                dataPoints: dataPoints
            }];
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

            var url = API_URL + '/sensori/' + vm.id + '/' + vm.metric + '/' + (channel + 1) + '?start=' + parseStart(vm.start) + '&end=' + parseEnd(vm.end);

            console.log(url);

            $http.get(url)
                .then(function (res) {
                    vm.data = res.data.payload;

                    vm.title = labels(vm.metric, channel);
                    vm.channel = channel;

                    vm.chartData = updateChartData(vm.data[0]);

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
