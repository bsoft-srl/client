(function () {

    angular
        .module('app')
        .factory('UIStateService', factory);

    factory.$inject = [];
    function factory() {
        return {
            selectedUI: null,
            selectedBuilding: null,
            activeBuilding: null,
            panel: 'home',
            errors: [
                //{text: 'Errore'},
            ]
        }

        /** */
    }

})();
