(function () {

    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

    /**
     *
     */
    LoginCtrl.$inject = ['$http', '$state', 'SidecoStore', 'API_URL'];

    function LoginCtrl($http, $state, store, API_URL) {

        var vm = this;

        vm.error = false;
        vm.loading = false;
        vm.codiceFiscale = 'DLLNDR73P22B963U';
        vm.password = 'sideco';

        vm.login = login;

        ////////

        function login(codiceFiscale, password) {

            vm.loading = true;
            vm.error = false;

            $http.post(API_URL + '/autenticazione', {
                codice_fiscale: codiceFiscale,
                password: password
            })
            .then(function (res) {
                store.set('tokenId', res.data.payload);
                $state.go('dashboard');
            })
            .catch(function (err) {
                vm.error = err.data ? err.data.message : 'Impossibile contattare il server.';
            })
            .finally(function () {
                vm.loading = false;
            });
        }

    }

})();
