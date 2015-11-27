(function () {

    angular
        .module('app')
        .factory('UIStateService', factory);

    factory.$inject = [];
    function factory() {
        return {
            offsideToggled: false,
            selectedUI: null,
            selectedBuilding: null,
            activeBuilding: null,
            panel: 'home',
            errors: [
                /*{
                    title: '',
                    text: ''
                },*/
            ]
        }
    }

})();
