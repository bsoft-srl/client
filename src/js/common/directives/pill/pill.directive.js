(function () {
    angular
        .module('app')
        .directive('soFake', directive);
})();

/**
 *
 */
function directive() {
    return {
        restrict: 'E',
        scope: {
            desc: '@',
            icon: '@',
            bg: '@',
            smartMeter: '@'
        },
        controller: controller,
        controllerAs: 'fake',
        templateUrl: 'common/directives/pill/pill.html'
    }
}

/**
 *
 */
controller.$inject = ['$scope', 'UIStateService'];

function controller($scope, UIStateService) {
    var vm = this;

    vm.desc = $scope.desc;
    vm.icon = $scope.icon;
    vm.bg = $scope.bg;
    vm.ui = UIStateService;
    vm.range = {};

    vm.smartMeter = parseSmartMeter($scope.smartMeter);

    /** */
    $scope.$watchCollection(function () {
        return UIStateService.dateRange;
    }, function (range) {
        if (range.start && range.end) {
            vm.range.start = range.start.format('DD/MM/YY HH:mm');
            vm.range.end = range.end.format('DD/MM/YY HH:mm');
        } else {
            vm.range.start = moment(UIStateService.start, 'DD-MM-YYYY').startOf('day').format('DD/MM/YY HH:mm');
            vm.range.end = moment(UIStateService.end, 'DD-MM-YYYY').endOf('day').format('DD/MM/YY HH:mm');
        }
    });

    /**
     *
     */
    function parseSmartMeter(str) {
        var
            parts = str && str.split(','),
            metric = (parts && parts[0]) || null,
            channel = (parts && parseInt(parts[1], 10)) || 1;

        if (!metric) return false;

        UIStateService.pillsCount += 1;

        return {
            metric: metric,
            channel: channel
        }
    }
}
