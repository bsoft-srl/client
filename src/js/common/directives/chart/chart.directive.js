(function () {
    angular
        .module('app')
        .directive('soChart', directive);

    directive.$inject = [];
    function directive() {
        return {
            restrict: 'A',
            controller: controller,
            controllerAs: 'chart',
            scope: {
                data: '=soChart',
                options: '=options'
            },
            link: link
        }
    }

    function link(scope, el, attrs) {

        var chart;

        scope.$watch('data', function () {

            if (chart) chart.destroy();

            chart = new Chart(el, {
                type: 'line',
                data: scope.data,
                options: scope.options
            });
        });
    }

    function controller() {}
})();
