(function () {
    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', controller);

    /**
     *
     */
    controller.$inject = [
        '$scope',
        'DTOptionsBuilder',
        'profile',
        'ProfileService',
        'SmartMeterService',
        'SidecoStore',
        '$state',
        '$http',
        'UIStateService',
        'API_URL'
    ];

    function controller($scope, DTOptionsBuilder, model, profile, smartMeter, store, $state, $http, UIState, API_URL) {
        var vm = this;

        /** */
        vm.utenza = model.utenza;
        vm.edifici = model.edifici;
        vm.sensori = model.sensori;
        vm.profile = profile;
        vm.state = UIState;
        vm.smartMeter = smartMeter;

        vm.aside = false;

        /** */
        vm.panel = panel;
        vm.logout = logout;

        /** */
        vm.selectedUI = null;
        vm.selectUI = selectUI;

        /** */
        vm.start = moment().format('DD-MM-YYYY');
        vm.end = moment().format('DD-MM-YYYY');
        vm.parseStart = parseStart;
        vm.parseEnd = parseEnd;

        /** */
        /*vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(25)
            .withBootstrap();*/

        vm.dtOptions = {
            paginationType: 'numbers',
            displayLength: 25,
            withBootstrap: true
        };

        initialize();

        vm.toggleAside = function () {
            vm.aside = !vm.aside;
        }

        /**
         *
         */
        function initialize() {
        }

        /**
         *
         */
        function panel(type) {
            UIState.panel = type;
        }

        /**
         *
         */
        function selectUI(id) {
            vm.selectedUI = id;
        }

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
        function logout() {
            store.remove('tokenId');
            store.remove('profile');
            store.remove('weather');

            UIState.selectedUI = null;
            UIState.selectedBuilding = null;
            UIState.activeBuilding = null;
            UIState.sensori = null;
            UIState.panel = 'home';

            $state.go('login');
        }

        /**
         *
         */
        function select(id) {
            vm.selected = id;
        }
    }
})();
