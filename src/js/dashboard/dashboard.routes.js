(function () {
    angular
        .module('app.dashboard')
        .config(config);

    /**
     *
     */
    config.$inject = ['$stateProvider'];

    function config($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard',
                resolve: {
                    profile: function (ProfileService) {
                        return ProfileService.fetch();
                    },
                    weather: function (WeatherService) {
                        return WeatherService.fetch();
                    }
                },
                data: {
                    private: true
                }
            })
    }
})();
