(function () {
    angular
        .module('app')
        .run(run);

    /**
     *
     */
    run.$inject = ['$rootScope', '$state', 'SidecoStore', 'jwtHelper'];

    function run($rootScope, $state, store, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function (e, to) {
            if (to.data && to.data.private) {
                if (!store.get('tokenId') || jwtHelper.isTokenExpired(store.get('tokenId'))) {
                    e.preventDefault();
                    $state.go('login');
                }
            }
        });
    }
})();
