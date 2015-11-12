(function () {

    angular
        .module('app')
        .directive('soWeather', soWeather);

    /**
     *
     */
    soWeather.$inject = [];
    function soWeather() {
        return {
            restrict: 'E',
            templateUrl: 'common/directives/weather/weather.html',
            scope: {
                fetch: '&',
                limit: '@'
            },
            controller: Controller,
            controllerAs: 'weather'
        }
    }

    /**
     *
     */
    Controller.$inject = ['$scope', 'SidecoStore'];
    function Controller($scope, store) {
        var vm = this;

        vm.data = null;
        vm.loading = false;
        vm.error = false;

        vm.refresh = refresh;
        vm.iconCondition = iconCondition;

        vm.chartOptions = {
            point: {
                show: true
            }
        };

        vm.chartData = null;
        vm.canvasData = null;
        vm.canvasOptions = null;

        function updateChartData(rows) {
            var data = {
                x: 'x',
                columns: [
                    ['x'],
                    ['max'],
                    ['min']
                ]
            };

            rows.forEach(function (row) {
                data.columns[0].push(row.data);
                data.columns[1].push(row.temperature.max);
                data.columns[2].push(row.temperature.min);
            });

            return data;
        }

        /**
         *
         */
        function updateCanvasData(rows) {
            var data = [
                {
                    legendText: 'Max',
                    type: 'line',
                    color: '#286090',
                    lineThickness: 1,
                    markerSize: 5,
                    dataPoints: []
                },
                {
                    legendText: 'Min',
                    type: 'line',
                    color: '#ec971f',
                    lineThickness: 1,
                    markerSize: 5,
                    dataPoints: []
                }
            ];

            _.each(rows, function (row) {
                data[0].dataPoints.push({
                    label: row.data,
                    y: row.temperature.max
                });

                data[1].dataPoints.push({
                    label: row.data,
                    y: row.temperature.min
                });
            });

            return data;
        }

        initialize();

        ////////

        function initialize() {
            refresh();
        }

        /**
         *
         */
        function iconCondition(name) {

            switch (name) {
                case 'day-sunny':
                    name = 'Sereno';
                    break;
                case 'cloudy':
                    name = 'Poco nuvoloso';
                    break;
                case 'cloud':
                    name = 'Nuvoloso';
                    break;
                case 'shower':
                    name = 'Acquazzone';
                    break;
                case 'rain':
                    name = 'Pioggia';
                    break;
                case 'thunderstorm':
                    name = 'Temporale';
                    break;
                case 'snow':
                    name = 'Neve';
                    break;
                case 'dust':
                    name = "Nebbia";
                    break;
            }

            return name;
        }


        /**
         *
         */
        function chartTempForecastData(rows) {
            var lineChart = {
                labels: [],
                datasets: [
                    {
                        label: 'Max',
                        borderColor: 'rgba(35,183,229,1)',
                        pointBackgroundColor: 'rgba(35,183,229,1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(35,183,229,1)',
                        data: []
                    },
                    {
                        label: 'Min',
                        borderColor: '#ddd',
                        pointBackgroundColor: '#ddd',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#ddd',
                        data: []
                    }
                ]
            };

            rows.forEach(function (row) {
                lineChart.labels.push(row.data);
                lineChart.datasets[0].data.push(row.temperature.max);
                lineChart.datasets[1].data.push(row.temperature.min);
            });

            return lineChart;
        }

        /**
         *
         */
        function refresh(force) {

            if (!force && store.get('weather')) {
                vm.data = store.get('weather');
                vm.chartData = updateChartData(vm.data.previsioni);
                vm.canvasData = updateCanvasData(vm.data.previsioni);
                return;
            }

            vm.loading = true;

            console.debug('Fetching weather data…');

            $scope.fetch()
                .then(function (res) {
                    vm.data = res.data.payload;
                    vm.chartData = updateChartData(vm.data.previsioni);
                    vm.canvasData = updateCanvasData(vm.data.previsioni);
                    console.debug('Fetching weather data… Done');
                    store.set('weather', vm.data);
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
