(function () {
    angular
        .module('app')
        .directive('soBuildingPanel', directive);

    /**
     *
     */
    function directive() {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                selectUI: '&onSelect',
                sensori: '='
            },
            templateUrl: 'common/directives/building-panel/building-panel.html',
            controller: controller,
            controllerAs: 'e'
        }
    }

    /**
     *
     */
    controller.$inject = ['$scope', 'ProfileService', 'SmartMeterService', 'UIStateService'];

    function controller($scope, profile, smartMeter, UIState) {
        var vm = this;

        vm.model = $scope.model;
        vm.service = smartMeter;
        vm.profile = profile;
        vm.sensori = $scope.sensori;

        /** */
        vm.state = UIState;

        /** */
        vm.selectedUI = null;
        vm.selected = false;
        vm.selectUI = selectUI;
        vm.unselectUI = unselectUI;

        /** */
        vm.active = false;
        vm.toggled = true;
        vm.toggle = toggle;

        /** */
        $scope.$watch(function () {
            return UIState.activeBuilding;
        }, function (newvalue, oldvalue) {
            if (newvalue === vm.model.id + '') vm.active = true;
            else vm.active = false;
        });

        /** */
        vm.ui = [];

        initialize();

        /**
         *
         */
        function initialize() {
            profile.getUIByEdificioId(vm.model.id)
                .then(function (rows) {
                    vm.ui = rows.length ? rows : false;

                    if (!UIState.initialized && vm.ui) {

                        UIState.initialized = true;

                        console.debug('Getting default UI…', vm.ui[0]);

                        selectUI(vm.ui[0].id);
                    }
                });

            vm.sensoriCount = {};
            _.each(vm.sensori, function (row) {
                if (!vm.sensoriCount[row.parent_id]) {
                    vm.sensoriCount[row.parent_id] = 0;
                }
                vm.sensoriCount[row.parent_id] += 1;
            });
        }

        /**
         *
         */
        function IsUIInEdificio(id) {
            var ui = _.findWhere(vm.ui, {id: id + '', parent_id: vm.model.id + ''});

            if (ui) return true;

            return false;
        }

        /**
         *
         */
        function selectUI(id) {
            (UIState.selectedUI && delete UIState.selectedUI.parsed);
            (UIState.selectedBuilding && delete UIState.selectedBuilding.parsed);

            UIState.toggleOffside(false);

            profile.getSensoriByUI(id)
                .then(function (collection) {
                    UIState.sensori = collection;
                });

            UIState.selectedUI = _.findWhere(vm.ui, {id: id}) || null;

            if (UIState.selectedUI) {

                UIState.selectedUI.parsed = profile.extraInfo(UIState.selectedUI);
                UIState.activeBuilding = vm.model.id + '';
                UIState.selectedBuilding = vm.model;
                UIState.selectedBuilding.parsed = profile.extraInfo(vm.model);

                if (UIState.isPanel('ui')) UIState.setPanel('ui.index');
            }
        }

        /**
         *
         */
        function unselectUI() {
            (UIState.selectedUI && delete UIState.selectedUI.parsed);
            (UIState.selectedBuilding && delete UIState.selectedBuilding.parsed);

            UIState.selectedUI = null;
            UIState.activeBuilding = null;
            UIState.selectedBuilding = null;
            UIState.sensori.length = null;

            UIState.setPanel('home', true);
        }

        /**
         *
         */
        function toggle() {
            vm.toggled = !vm.toggled;
        }
    }
})();
