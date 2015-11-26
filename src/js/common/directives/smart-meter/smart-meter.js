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
                ui: '=',
                model: '=',
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
    controller.$inject = ['$scope', '$http', 'SmartMeterService', 'API_URL'];
    function controller($scope, $http, smartMeter, API_URL) {
        var vm = this;

        vm.service = smartMeter;

        /** */
        vm.id = $scope.ui;
        vm.model = $scope.model;
        vm.lastUpdate = moment.unix(vm.model.ultimo_aggiornamento).format('DD MMM YYYY HH:mm');

        /** */
        vm.start = $scope.start;
        vm.end = $scope.end;

        /** */
        vm.channels = _.range(vm.model.numero_canali);
        vm.channel = 0;
        vm.metric = vm.model.tipologia;
        vm.update = update;

        /* */
        vm.title = null;
        vm.chartData = null;
        vm.chartOptions = null;

        /** */
        vm.toggled = false;
        vm.toggle = toggle;

        initialize();

        /**
         *
         */
        function toggle() {
            vm.toggled = !vm.toggled;
        }


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

        /** */
        $scope.$watch('start', function (newvalue, oldvalue) {
            if (!vm.isLoading) {
                vm.start = newvalue;
                update(vm.channel);
            }
        });

        /** */
        $scope.$watch('end', function (newvalue, oldvalue) {
            if (!vm.isLoading) {
                vm.end = newvalue;
                update(vm.channel);
            }
        });

        /**
         *
         */
        function initialize() {
            update();
        }

        /**
         *
         */
        function update(channel) {

            if (channel == undefined)
                channel = 0;

            vm.isLoading = true;

            smartMeter.fetch(vm.id, {
                metric: vm.metric,
                channel: channel,
                start: parseStart(vm.start),
                end: parseEnd(vm.end)
            })
            .then(function (dps) {
                vm.chartData = updateChartData(dps);
                vm.title = getTitle(vm.metric, channel);
                vm.channel = channel;
            })
            .finally(function () {
                vm.isLoading = false;
            });
        }

        /**
         *
         */
        function updateChartData(rows) {
            var dataPoints = [];

            _.each(rows, function (v, k) {
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
        function getTitle(metric, channel) {

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
    }
})();
