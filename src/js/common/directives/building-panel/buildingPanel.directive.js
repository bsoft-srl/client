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
                    vm.ui = rows;
                });

            console.error('Initialized…');

            vm.sensoriCount = {};
            _.each(vm.sensori, function (row) {

                if (!vm.sensoriCount[row.parent_id]) {
                    vm.sensoriCount[row.parent_id] = 0;
                }

                vm.sensoriCount[row.parent_id] += 1;
            });

            console.log(vm.sensoriCount);
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

            }
        }

        /**
         *
         */
        function toggle() {
            vm.toggled = !vm.toggled;
        }
    }
})();
