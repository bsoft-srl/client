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
        vm.dataPointsSize = 0;

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

        /** */
        vm.downsample = false;
        vm.downsamples = [
            {
                desc: '15M-AVG',
                downsample: '15m-avg'
            },
            {
                desc: '30M-AVG',
                downsample: '30m-avg'
            },
            {
                desc: '1H-AVG',
                downsample: '1h-avg'
            },
            {
                desc: '1D-AVG',
                downsample: '1d-avg'
            },
            {
                desc: 'Nessuno',
                downsample: false
            }
        ];

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
        function update(channel, downsample) {
            var
                start = parseStart(vm.start),
                end = parseEnd(vm.end),
                mStart = moment(vm.start, 'DD-MM-YYYY'),
                mEnd = moment(vm.end, 'DD-MM-YYYY'),
                mDiff = mEnd.diff(mStart, 'days');

            if (channel == undefined)
                channel = 0;

            if (downsample == undefined)
                if (mDiff > 42)
                    downsample = '1d-avg';
                else if (mDiff > 28)
                    downsample = '1h-avg';
                else if (mDiff > 14)
                    downsample = '30m-avg';
                else if (mDiff > 7)
                    downsample = '15m-avg'
                else
                    downsample = false;

            vm.isLoading = true;

            smartMeter.fetch(vm.id, {
                metric: vm.metric,
                channel: channel,
                downsample: downsample,
                start: start,
                end: end
            })
            .then(function (dps) {
                vm.dataPointsSize = _.size(dps);
                vm.chartData = updateChartData(dps);
                vm.title = getTitle(vm.metric, channel);
                vm.channel = channel;
                vm.downsample = downsample;
            })
            .catch(function (err) {
                console.error('Error fetching smart meter data', err);
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
                type: _.size(dataPoints) == 1 ? 'scatter' : 'area',
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
            } else if (metric == 'ambientale_out_2ch') {
                switch (channel) {
                    case 0: return 'Temperatura (°C)';
                    case 1: return 'Umidità (%Rh)'
                }
            } else if (metric == 'ambientale_out_3ch') {
                switch (channel) {
                    case 0: return 'Temperatura (°C)';
                    case 1: return 'Temperatura (°C)';
                    case 2: return 'Temperatura (°C)';
                }
            } else if (metric == 'ambientale_out_meteo_3ch') {
                switch (channel) {
                    case 0: return 'Meteo / Radiazione solare W/m2';
                    case 1: return 'Meteo / Direzione °';
                    case 2: return 'Meteo / Velocità m/s';
                }
            } else if (metric == 'produzione') {
                switch (channel) {
                    case 0: return 'Produzione / Temperatura (°C)';
                    case 1: return 'Produzione / Corrente A';
                    case 2: return 'Produzione / Tensione V';
                }
            }
        }
    }
})();
