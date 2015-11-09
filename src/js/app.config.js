(function () {
    angular
        .module('app')
        .config(config);

    config.$inject = ['jwtInterceptorProvider', '$httpProvider'];
    function config(jwtInterceptorProvider, $httpProvider) {

        jwtInterceptorProvider.tokenGetter = ['SidecoStore', function (store) {
            return store.get('tokenId');
        }];

        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();
