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
                dataPoints: '=dps',
                options: '=',
                minimum: '@'
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

            CanvasJS.addCultureInfo('it', {
                decimalSeparator: ',',
                digitGroupSeparator: ''
            });

            chart = new CanvasJS.Chart(el[0], {

                animationEnabled: true,
                zoomEnabled: true,

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
                    labelFontSize: 10,
                    minimum: scope.minimum !== undefined ? scope.minimum : null
                },


                axisX: {
                    lineColor: '#333',
                    lineThickness: 1,
                    tickThickness: 1,
                    tickColor: '#333',
                    labelFontColor: '#333',
                    labelFontFamily: 'Helvetica',
                    labelFontSize: 10,
                },

                toolTip: {
                    borderThickness: 1,
                    cornerRadius: 0,
                    borderColor: '#999',
                    shared: true,
                    backgroundColor: null,
                    data: scope.dataPoints,

                    /**
                     *
                     */
                    contentFormatter: function (e) {
                        var retval = [
                            '<div class="so-chart__tooltip">'
                        ];

                        var doneTitle = false;

                        for (var i = 0; i < e.entries.length; i += 1) {

                            if (!doneTitle) {
                                retval.push([
                                    '<div class="so-chart__tooltip-title">',
                                        e.entries[i].dataPoint.label || e.entries[i].dataPoint.indexLabel,
                                    '</div>',
                                ].join(''));

                                doneTitle = true;
                            }

                            retval.push([
                                '<div class="so-chart__tooltip-body">',
                                    e.entries[i].dataSeries.color && '<i class="so-chart__tooltip-color" style="background-color: ' + e.entries[i].dataSeries.color + '"></i>',
                                    e.entries[i].dataSeries.legendText && e.entries[i].dataSeries.legendText + ': ',
                                    //typeof e.entries[i].dataPoint.y == 'number' ? e.entries[i].dataPoint.y.toFixed(4) : e.entries[i].dataPoint.y,
                                    CanvasJS.formatNumber(e.entries[i].dataPoint.y, '#,##0.####', 'it'),
                                    e.entries[i].dataPoint.soSuffix && ' ' + e.entries[i].dataPoint.soSuffix,
                                '</div>'
                            ].join(''));
                        }

                        retval.push('</div>');
                        return retval.join('');
                    }
                }
            });
    }

})();
