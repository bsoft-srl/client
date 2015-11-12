(function () {
    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', controller);

    /**
     *
     */
    controller.$inject = ['$rootScope', '$scope', '$state', '$http', 'SidecoStore', 'API_URL'];

    function controller($rootScope, $scope, $state, $http, store, API_URL) {
        var vm = this;

        vm.loading = true;
        vm.initialized = false;
        vm.error = false;
        vm.store = {};
        vm.smartMeterDidInit = false;

        vm.findByE = findByE;
        vm.getSmartMeterByUI = getSmartMeterByUI;
        vm.getWeather = getWeather;
        vm.logout = logout;
        vm.smartMeterInitialized = smartMeterInitialized();

        /* */
        vm.selected = null;
        vm.select = select;

        /* */
        vm.start = moment().format('DD-MM-YYYY');
        vm.end = moment().format('DD-MM-YYYY');
        vm.parseStart = parseStart;
        vm.parseEnd = parseEnd;

        initialize();

        /**
         *
         */
        function parseStart(date, raw) {
             var retval = moment(date, 'DD-MM-YYYY').startOf('day');
             return raw ? retval : retval.valueOf();
        }

        /**
         *
         */
        function parseEnd(date, raw) {
              var retval = moment(date, 'DD-MM-YYYY').endOf('day');
              return raw ? retval : retval.valueOf();
        }

        /**
         *
         */
        function smartMeterInitialized(count) {

            return function () {
                if (!count) vm.smartMeterDidInit = true;
                else (count -= 1);
            }
        }

        /**
         *
         */
        function info(arr) {
            var blacklist = [
                'parent',
                'parent_id'
            ];
        }

        /**
         *
         */
        function logout() {
            store.remove('tokenId');
            store.remove('profile');
            store.remove('weather');

            $state.go('login');
        }

        /**
         *
         */
        function findByE(id) {
            var retval = _.where(vm.store.unita_immobiliari, {'parent_id': id + ''});
            return retval;
        }

        /**
         *
         */
        function getSmartMeterByUI(id) {
            return _.where(vm.store.sensori, {'parent_id': id});
        }

        /**
         *
         */
        function select(id) {
            vm.selected = id;
        }

        /**
         *
         */
        function initialize() {

            $http.get(API_URL + '/profilo/me?include=u,ui,e,s,z,de,i')
                .then(function (res) {
                    vm.store = res.data.payload;
                    vm.loading = false;
                    store.set('profile', vm.store);
                })
                .catch(function (err) {
                    vm.error = err.data ? err.data.message : 'Impossibile contattare il server.';
                })
                .finally(function () {
                    vm.initialized = true;
                });
        }

        /**
         *
         */
        function getWeather() {
            var url = API_URL + '/meteo?include=w,f';
            return $http.get(url);
        }
    }
})();
