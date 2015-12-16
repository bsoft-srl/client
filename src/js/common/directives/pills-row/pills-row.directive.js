(function () {
    angular
        .module('app')
        .directive('soPillsRow', directive);
})();

/**
 *
 */
function directive() {
    return {
        restrict: 'E',
        scope: {
            smartMeters: '='
        },
        templateUrl: 'common/directives/pills-row/pills-row.html'
    }
}
