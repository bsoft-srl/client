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
                minimum: '@',
                group: '@',
                onTrigger: '&',
                metric: '='
            },
            link: link,
            controller: controller
        }
    }

    /**
     *
     */
    controller.$inject = ['$scope', 'UIStateService'];

    function controller($scope, UIStateService) {
        $scope.UIStateService = UIStateService;
    }

    /**
     *
     */
    function link(scope, el, attrs) {

            var
                chart,
                dps = scope.dataPoints,
                options = {};

            /** */
            if (_.isFunction(scope.onTrigger())) {
                scope.onTrigger = scope.onTrigger();
            }

            /** */
            CanvasJS.addCultureInfo('it', {
                decimalSeparator: ',',
                digitGroupSeparator: ''
            });

            /** */
            scope.$watchCollection(function () {
                return scope.dataPoints;
            }, function (newvalue) {
                chart.options.data = newvalue;
                chart.render();
            });

            /** */
            options = {
                metric: scope.metric,
                animationEnabled: true,
                zoomEnabled: true,
                zoomType: 'x',
                culture: 'it',
                rangeChanged: _.debounce(rangeChanged, 150),

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
                    valueFormatString: 'DD MMM YYYY HH:mm'
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
                                    CanvasJS.formatNumber(e.entries[i].dataPoint.y, '#,##0.####', 'it'),
                                    e.entries[i].dataPoint.soSuffix && ' ' + e.entries[i].dataPoint.soSuffix,
                                '</div>'
                            ].join(''));
                        }

                        retval.push('</div>');
                        return retval.join('');
                    }
                }
            };

            /**
             *
             */
            chart = new CanvasJS.Chart(el[0], options);

            /** Utilizzato per la sincronizzazione dei grafici */
            if (scope.group) {
                scope.UIStateService.charts[scope.group] || (scope.UIStateService.charts[scope.group] = []);

                if (scope.UIStateService.charts[scope.group].indexOf(chart) == -1) {
                    scope.UIStateService.charts[scope.group].push(chart);
                }
            }

            /** Resetta la viewport se uso il datepicker */
            scope.$watch(function () {
                return scope.UIStateService.dateRange.trigger;
            }, function (trigger) {
                if (trigger == 'reset') {
                    chart.options.axisX.viewportMinimum = chart.options.axisX.viewportMaximum = null;
                    chart.render();
                }
            });

            /**
             *
             */
            function rangeChanged(e) {
                var
                    start = moment(e.axisX.viewportMinimum),
                    end = moment(e.axisX.viewportMaximum);

                _.each(scope.UIStateService.charts['sync'], function (chart) {
                    if (e.trigger == 'zoom' || e.trigger == 'pan') {
                        chart.options.axisX.viewportMinimum = e.axisX.viewportMinimum;
                        chart.options.axisX.viewportMaximum = e.axisX.viewportMaximum;
                    }/* else if (e.trigger == 'reset') {
                        chart.options.axisX.viewportMinimum = chart.options.axisX.viewportMaximum = null;
                    }*/

                    // TODO: spostare inline
                    scope.onTrigger(start, end, chart, e.trigger);
                    chart.render();
                });
            }
    }
})();
