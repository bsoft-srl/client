(function () {
    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', Controller);

    /**
     *
     */
    Controller.$inject = ['$rootScope', '$scope', '$http', 'SidecoStore', 'API_URL'];

    function Controller($rootScope, $scope, $http, store, API_URL) {
        var vm = this;

        vm.loading = true;
        vm.initialized = false;
        vm.error = false;
        vm.store = {};

        vm.selected = null;
        vm.select = select;

        vm.findByE = findByE;

        vm.getWeather = getWeather;

        initialize();

        ////////

        function findByE(id) {
            var retval = _.where(vm.store.unita_immobiliari, {'parent_id': id});
            return retval;
        }

        function select(id) {
            vm.selected = id;
        }

        function getProfile(id) {
            var url = API_URL + '/profilo/' + id + '?include=u';
        }

        function initialize() {
            $http.get(API_URL + '/profilo/me?include=u,ui,e,s,z,de,i')
                .then(function (res) {
                    vm.store = res.data.payload;
                    vm.loading = false;
                    store.set('profile', vm.store);
                })
                .catch(function (err) {
                    vm.error = err.data.message;
                })
                .finally(function () {
                    vm.initialized = true;
                    console.log(vm.store);
                });
        }

        function getWeather() {
            var url = API_URL + '/meteo?include=w,f';
            return $http.get(url);
        }

        function getProfile() {

            if (store.get('profile')) {
                vm.user = store.get('profile');
                return;
            }

            vm.loading = true;

            $http.get(API_URL + '/profilo/me?include=s')
                .then(function (res) {
                    vm.store.profile = res.data.payload;
                    store.set('profile', res.data.payload);
                })
                .catch(function (err) {
                    vm.error = err.data.message;
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

    }
})();
