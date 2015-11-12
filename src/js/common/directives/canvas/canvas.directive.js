(function () {

    angular
        .module('app')
        .directive('soCanvas', directive);

    /**
     *
     */
    directive.$inject = [];
    function directive() {
        return {
            restrict: 'A',
            scope: {
                dataPoints: '=soCanvas',
                options: '='
            },
            link: link
        }
    }

    /**
     *
     */
    function link(scope, el, attrs) {

            var
                chart,
                dps = scope.dataPoints;

            /**
             *
             */
            scope.$watch('dataPoints', function () {
                chart.options.data = scope.dataPoints;
                chart.render();
            });

            chart = new CanvasJS.Chart(el[0], {
                axisY: {
                    includeZero: false,
                    gridDashType: 'dash',
                    gridThickness: 1,
                    gridColor: '#ddd',
                    lineColor: '#333',
                    lineThickness: 1,
                    tickColor: '#333',
                    tickTickness: 1,
                    tickLength: 0,
                    labelFontColor: '#333',
                    labelFontFamily: 'Helvetica',
                    labelFontSize: 10
                },
                axisX: {
                    lineColor: '#333',
                    lineThickness: 1,
                    tickThickness: 1,
                    tickColor: '#333',
                    labelFontColor: '#333',
                    labelFontFamily: 'Helvetica',
                    labelFontSize: 10
                },
                toolTip: {
                    borderThickness: 1,
                    cornerRadius: 0,
                    borderColor: '#999',
                    shared: true,
                    contentFormatter: function (e) {
                        var retval = [
                            '<div class="so-chart__tooltip">'
                        ];

                        var doneTitle = false;

                        //console.log(e);

                        for (var i = 0; i < e.entries.length; i += 1) {

                            if (!doneTitle) {
                                retval.push([
                                    '<div class="so-chart__tooltip-title">',
                                        e.entries[i].dataPoint.label,
                                    '</div>',
                                ].join(''));

                                doneTitle = true;
                            }

                            retval.push([
                                '<div class="so-chart__tooltip-body">',
                                    '<i class="so-chart__tooltip-color" style="background-color: ' + e.entries[i].dataSeries.color + '"></i>',
                                    e.entries[i].dataSeries.legendText && e.entries[i].dataSeries.legendText + ': ',
                                    e.entries[i].dataPoint.y.toFixed(4),
                                '</div>'
                            ].join(''));
                        }

                        retval.push('</div>');
                        return retval.join('');
                    }
                },
                backgroundColor: null,
                zoomEnabled: true,
                data: scope.dataPoints
            });


    }

})();
