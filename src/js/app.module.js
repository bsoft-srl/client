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
        //.constant('API_URL', 'http://192.168.0.100:8080/sideco-server/public_html/api.php/api/v1');
        //.constant('API_URL', 'http://188.9.38.228:8080/sideco-server/public_html/api.php/api/v1');
})();
