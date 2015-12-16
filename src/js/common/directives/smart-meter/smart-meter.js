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
    controller.$inject = ['$scope', '$http', 'SmartMeterService', 'API_URL', 'UIStateService'];
    function controller($scope, $http, smartMeter, API_URL, UIStateService) {
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

        UIStateService.start = $scope.start;
        UIStateService.end = $scope.end;

        /** */
        vm.channels = _.range(vm.model.numero_canali);
        vm.channel = 0;
        vm.metric = vm.model.tipologia['metric'];
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

        /**
         * Funzione di callback invocata quando si interagisce col grafico
         * Il campo chart.options.metric presenta la metrica del sensore
         * graficizzata dal grafico
         */
        vm.onTrigger = function (start, end, chart, trigger) {
            var
                rangePoints = [],
                i, dp, date;

            if (trigger == 'reset') {
                // resetta il range di data
                UIStateService.dateRange.start = moment(vm.start, 'DD-MM-YYYY').startOf('day');
                UIStateService.dateRange.end = moment(vm.end, 'DD-MM-YYYY').endOf('day');
                UIStateService.dateRange.trigger = trigger;
            } else {
                UIStateService.dateRange.start = start;
                UIStateService.dateRange.end = end;
                UIStateService.dateRange.trigger = trigger;
            }

            switch (chart.options.metric) {
                case 'energia_elettrica':
                    UIStateService.consumi['energia_elettrica'] = Math.ceil(Math.random() * 10);
                break;
            }

            $scope.$apply();
            //console.log(UIStateService.selectedDateRange);

            /*console.log('Filtering…', start.unix(), end);

            vm.isLoading = true;

            smartMeter.fetch(vm.id, {
                metric: vm.metric,
                channel: vm.channel,
                downsample: '1d-avg',
                start: start.unix() * 1000,
                end: end.unix() * 1000
            }, true).then(function (model) {
                console.log(model);
            }).finally(function () {
                vm.isLoading = false;
            });*/
        };

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

        /**
         * Fa la query al webservice solo se il trigger proviene dal datepicker
         */
        _.each(['start', 'end'], function (v) {
            $scope.$watch(function () {
                return UIStateService.dateRange.value[v];
            }, function (newvalue, oldvalue) {
                var
                    _newvalue = newvalue.format('DD-MM-YYYY'),
                    _oldvalue = oldvalue.format('DD-MM-YYYY');

                if (_newvalue != _oldvalue && !vm.isLoading && UIStateService.dateRange.trigger == 'reset') {
                    vm[v] = newvalue;
                    update(vm.channel);
                }
            });
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
                vm.channel = channel;
                vm.title = 'Misuratore ' + vm.model.tipologia.desc.toLowerCase();
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
                    x: new Date(k * 1000),
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
    }
})();
