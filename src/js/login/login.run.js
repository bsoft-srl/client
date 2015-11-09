(function () {
    angular
        .module('app.login')
        .run(run);

    /**
     *
     */
    run.$inject = ['$rootScope', '$state', 'SidecoStore', 'jwtHelper'];

    function run($rootScope, $state, store, jwtHelper) {
        $rootScope.$on('$stateChangeStart', function (e, to) {

            var tokenId = store.get('tokenId');

            if (to.name == 'login' && tokenId && !jwtHelper.isTokenExpired(tokenId)) {
                e.preventDefault();
                $state.go('dashboard');
            }
        });
    }
})();
