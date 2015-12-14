(function () {
    angular
        .module('app')
        .directive('soChartPanel', directive);

    /** */
    directive.$inject = [];

    function directive() {
        return {
            restrict: 'E',
            templateUrl: 'common/directives/chart-panel/chart-panel.html',
            scope: {
                y: '&',
                title: '@',
                icon: '@',
                collection: '=',
                label: '@',
                suffix: '@',
                keys: '@',
                chartType: '@'
            },
            controller: controller,
            controllerAs: 'panel',
            link: link
        }
    }

    /**
     *
     */

    function y(k) {
        var model = this;

        return model[k];
    }

    controller.$inject = ['$scope', 'UIStateService'];
    function controller($scope, UIStateService) {
        var
            vm = this,
            i = 0;

        vm.state = {
            y: $scope.y() || y,
            title: $scope.title,
            icon: $scope.icon,
            collection: $scope.collection,
            label: $scope.label,
            suffix: $scope.suffix,
            keys: ($scope.keys && $scope.keys.split(',')) || [],
            chartType: $scope.chartType || 'doughnut',
            chartData: null
        };

        vm.service = {
            UIState: UIStateService
        }

        vm.chartType = chartType;

        initialize();

        /**
         *
         */
        $scope.$watch(function () {
            return chartType();
        }, function (newvalue) {
            vm.state.chartData = chartData(vm.state.collection);
        });

        /**
         *
         */
        function initialize() {

        }

        /**
         *
         */
        function chartType(type) {
            if (type == undefined) return vm.state.chartType;

            vm.state.chartType = type;
        }

        /** */

        function parseChartData(spec, arr) {
            var
                model = this,
                isValid = true,
                retval = [],

                //i = spec.i,
                label = spec.label,
                suffix = spec.suffix,
                chartType = spec.chartType,
                collection = spec.collection,
                keys = spec.keys;

            isValid = _.every(keys, function (k) {
                return _.isArray(model[k]) ? !!_.size(model[k]) : !!model[k];
            });

            if (!isValid) return false;

            if (chartType == 'doughnut') {
                return {
                    y: vm.state.y.apply(model, keys),
                    indexLabel: label,
                    soSuffix: suffix,
                }
            }

            if (chartType == 'column') {
                return {
                    x: i++,
                    y: vm.state.y.apply(model, keys),
                    label: label,
                    soSuffix: suffix
                }
            }
        }

        /**
         *
         */
        function chartData(collection) {
            var dps = [];

            _.each(collection, function (model, i) {
                var dataPoint;

                dataPoint = parseChartData.call(model, {
                    i: i,
                    collection: collection,
                    chartType: vm.state.chartType,
                    keys: vm.state.keys,
                    label: model[vm.state.label],
                    suffix: vm.state.suffix
                });

                dataPoint && dps.push(dataPoint);
            });

            /*
             * Resetta il contatore
             * Il contatore è utilizzato per far si che i dati sul grafico a colonne
             * si susseguano senza "buchi"
             */
            i = 0;

            if (_.size(dps))
                return [{
                    type: vm.state.chartType,
                    dataPoints: dps
                }];

            return false;
        }
    }

    /**
     *
     */
    function link() {

    }
})();
