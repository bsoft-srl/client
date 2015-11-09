(function () {
    angular
        .module('app.login')
        .config(LoginConfig);

    LoginConfig.$inject = ['$stateProvider'];
    function LoginConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            });
    }
})();
