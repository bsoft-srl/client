(function () {

    angular
        .module('app')
        .directive('soWeather', directive);

    /**
     *
     */
    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'common/directives/weather/weather.html',
            scope: {
                limit: '@'
            },
            controller: controller,
            controllerAs: 'w'
        }
    }

    /**
     *
     */
    controller.$inject = ['$timeout', '$scope', 'WeatherService', 'SidecoStore'];

    function controller($timeout, $scope, weather, store) {
        var vm = this;

        /** */
        vm.service = weather;
        vm.update = update;
        vm.limit = $scope.limit >= 5 ? $scope.limit : 5;
        vm.iconCondition = iconCondition;

        /** */
        vm.chartData = null;
        vm.chartOptions = null;

        updateChartData(weather.model.previsioni);

        /**
         *
         */
        function update() {
            weather.fetch(true)
                .then(function (res) {
                    updateChartData(weather.model.previsioni);
                });
        }

        /**
         *
         */
        function updateChartData(rows) {

            var chartData = [
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
                chartData[0].dataPoints.push({
                    label: row.data,
                    y: row.temperature.max
                });

                chartData[1].dataPoints.push({
                    label: row.data,
                    y: row.temperature.min
                });
            });

            console.debug('Updating chart data… Done');
            
            return vm.chartData = chartData;
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
    }

})();
