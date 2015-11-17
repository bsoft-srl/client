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
    controller.$inject = ['SmartMeterService'];

    function controller(smartMeter) {
        var vm = this;

        vm.smartMeter = smartMeter;
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
            };

        $start.datepicker(_.extend(sharedOpts, {
            onClose: function (date) {
                $end.datepicker('option', 'minDate', date);
            }
        }));

        $end.datepicker(_.extend(sharedOpts, {
            onClose: function (date) {
                $start.datepicker('option', 'maxDate', date);
            }
        }));
    }

})();
