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
    function link(scope, el, attrs) {

        var
            $start = el.find('.so-datepicker--start'),
            $end = el.find('.so-datepicker--end'),
            sharedOpts = {
                dateFormat: 'dd-mm-yy',
                changeMonth: true,
                maxDate: 'today'
            },
            now = moment().format('DD-MM-YYYY');

        $start.datepicker(_.extend(sharedOpts, {
            onClose: function (date) {
                $end.datepicker('option', 'minDate', date);
            }
        }));

        $end.datepicker(_.extend(sharedOpts, {
            minDate: now,
            onClose: function (date) {
                $start.datepicker('option', 'maxDate', date);
            }
        }));
    }

})();
