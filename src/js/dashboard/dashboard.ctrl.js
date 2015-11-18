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

        vm.offsideToggled = false;
        vm.offsideToggle = function () {
            vm.offsideToggled = !vm.offsideToggled;
        };

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
        vm.dtOptions = {
            paginationType: 'numbers',
            displayLength: 25,
            lengthChange: false,
            info: false,
            language: {
                "decimal":        "",
                "emptyTable":     "Nessun risultato da visualizzare.",
                "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty":      "Showing 0 to 0 of 0 entries",
                "infoFiltered":   "(filtered from _MAX_ total entries)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Show _MENU_ entries",
                "loadingRecords": "Caricamento…",
                "processing":     "Elaborazione…",
                "search":         "<i class='fa fa-filter mr'></i>Filtro:",
                "zeroRecords":    "Il filtro non ha restituito alcun risultato.",
                "paginate": {
                    "first":      "Primo",
                    "last":       "Ultimo",
                    "next":       "Prossimo",
                    "previous":   "Precedente"
                },
                "aria": {
                    "sortAscending":  ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            },
            withBootstrap: true
        };

        initialize();

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
            vm.offsideToggled = false;
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
