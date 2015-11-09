(function () {
    angular
        .module('app.dashboard')
        .config(Config);

    /**
     *
     */
    Config.$inject = ['$stateProvider'];

    function Config($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard',
                data: {
                    private: true
                }
            })
    }
})();
