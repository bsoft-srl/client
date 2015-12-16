(function () {

    angular
        .module('app')
        .directive('soDatepicker', directive);

    /**
     *
     */
    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'common/directives/datepicker/datepicker.html',
            scope: {
                start: '=',
                end: '='
            },
            controller: controller,
            controllerAs: 'dp',
            link: link
        }
    }

    /**
     *
     */
    controller.$inject = ['$scope', 'SmartMeterService', 'UIStateService'];

    function controller($scope, smartMeter, UIStateService) {
        var vm = this;

        vm.smartMeter = smartMeter;
        vm.state = UIStateService;

        $scope.UIStateService = UIStateService;

        /** */
        vm.hideTooltip = hideTooltip;
        vm.onFocus = onFocus;

        /**
         *
         */
        function onFocus() {
            hideTooltip();
        }

        /**
         *
         */
        function hideTooltip() {
            UIStateService.intervalFirstPicked = true;
        }
    }

    /**
     *
     */
    function link($scope, el, attrs) {

        var
            $start = el.find('.so-datepicker--start'),
            $end = el.find('.so-datepicker--end'),
            sharedOpts = {
                dateFormat: 'dd-mm-yy',
                changeMonth: true,
                maxDate: 'today'
            },
            oldstart,
            oldend;

        $scope.UIStateService.dateRange = {
            start: moment().startOf('day'),
            end: moment().endOf('day'),
            trigger: 'auto',
            value: {
                start: moment().startOf('day'),
                end: moment().endOf('day'),
            }
        };

        $start.bind('focus', function () {
            oldstart = $start[0].value;
        });

        $end.bind('focus', function () {
            oldend = $end[0].value;
        });

        $start.datepicker(_.extend(sharedOpts, {
            onClose: function (date) {
                var
                    _start = moment($start[0].value, 'DD-MM-YYYY').startOf('day'),
                    _end = moment($end[0].value, 'DD-MM-YYYY').endOf('day');

                $end.datepicker('option', 'minDate', date);

                if (oldstart != _start.format('DD-MM-YYYY')) {
                    $scope.UIStateService.dateRange.start = moment(date, 'DD-MM-YYYY');
                    $scope.UIStateService.dateRange.value = {
                        start: _start,
                        end: _end
                    };
                    $scope.UIStateService.dateRange.trigger = 'reset';

                    $scope.$apply();
                }
            }
        }));

        $end.datepicker(_.extend(sharedOpts, {
            minDate: 'today',

            onClose: function (date) {
                var
                    _start = moment($start[0].value, 'DD-MM-YYYY').startOf('day'),
                    _end = moment($end[0].value, 'DD-MM-YYYY').endOf('day');

                $start.datepicker('option', 'maxDate', date);

                if (oldend != _end.format('DD-MM-YYYY')) {
                    //$scope.UIStateService.dateRange.start = moment($start[0].value, 'DD-MM-YYYY');
                    $scope.UIStateService.dateRange.end = moment(date, 'DD-MM-YYYY');
                    $scope.UIStateService.dateRange.value = {
                        start: _start,
                        end: _end
                    };
                    $scope.UIStateService.dateRange.trigger = 'reset';

                    $scope.$apply();
                }
            }
        }));
    }

})();
