(function () {

    angular
        .module('app', [
            'ui.router',
            'angular-jwt',
            'angular-storage',
            'app.login',
            'app.dashboard',
            'templates'
        ])
        .constant('API_URL', 'http://localhost:4000/api.php/api/v1');
})();
