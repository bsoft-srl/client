(function () {
    angular
        .module('app')
        .directive('soChart', directive);

    /**
     *
     */
    directive.$inject = [];
    function directive() {
        return {
            restrict: 'A',
            scope: {
                data: '=soChart',
                options: '=options'
            },
            link: link
        }
    }

    /**
     *
     */
    function link(scope, el, attrs) {

        var chart;

        /**
         *
         */
        function update() {
            var
                defaults = {
                    bindto: el[0],
                    data: scope.data,
                    grid: {
                        y: {
                            show: true
                        }
                    },
                    legend: {
                        show: false
                    },
                    point: {
                        show: false
                    },
                    size: {
                        height: scope.height
                    },
                    axis: {
                        x: {
                            type: 'category',
                            tick: {
                                count: 4
                            }
                        }
                    }
                };

            var retval = _.extend(defaults, scope.options);

            console.log(retval);

            return retval;
        }

        scope.$watch('data', function () {
            chart.load(scope.data);
        });

        chart = c3.generate(update());
    }
})();
