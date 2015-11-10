(function () {

    angular
        .module('app')
        .directive('soDatePicker', directive);

    directive.$inject = [];
    function directive() {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {

                el.datepicker({
                    defaultDate: "-3d",
                    changeMonth: true,
                    numberOfMonths: 1,
                    maxDate: "-1d",
                    minDate: "-7d",
                    onClose: function( selectedDate ) {
                        var
                            selected = new Date(selectedDate),
                            nextDay = new Date(selected);

                        nextDay.setDate(selected.getDate() + 1);

                        $("#so-to").datepicker( "option", "minDate", nextDay );
                        $("#so-to").datepicker( "option", "maxDate", 'today' );
                    }
                });
            }
        }
    }

})();
