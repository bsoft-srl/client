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

        vm.lineOptions = {
          scaleShowGridLines : false,
          bezierCurve : false,
          showScale: false,
          pointDotRadius : 4,
          pointDotStrokeWidth : 1,
          pointHitDetectionRadius : 20,
          datasetStroke : false,
          datasetStrokeWidth : 2,
          datasetFill : false,
        };

        vm.chartOptions = {
            type: 'line',
            elements: {
                line: {
                    tension: 0,
                    fill: false,
                    borderWidth: 2
                },
                point: {
                    radius: 3,
                    hoverBorderWidth: 2
                }
            },
            gridLines: {
                show: false
            },
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
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
                vm.lineChart = chartTempForecastData(vm.data.previsioni);
                return;
            }

            vm.loading = true;
            //vm.lineChart = null;

            console.debug('Fetching weather data…');

            $scope.fetch()
                .then(function (res) {
                    vm.data = res.data.payload;
                    vm.lineChart = chartTempForecastData(vm.data.previsioni);
                    console.debug('Fetching weather data… Done');
                    console.debug('Setting weather data in store…');
                    store.set('weather', vm.data);
                    console.debug('Setting weather data in store… Done');
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
