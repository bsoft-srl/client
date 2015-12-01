(function () {

    angular
        .module('app')
        .factory('UIStateService', factory);

    factory.$inject = [];
    function factory() {
        var retval = {
            offsideToggled: false,
            selectedUI: null,
            selectedBuilding: null,
            activeBuilding: null,
            panel: 'home',
            errors: [
                /*{
                    title: '',
                    text: ''
                }*/
            ],

            /** */
            isPanel: isPanel,
            setPanel: setPanel
        };

        /**
         *
         */
        function isPanel(type) {

            var parts = retval.panel.split('.');

            if (type.indexOf('.') > -1)
                return retval.panel.indexOf(type) > -1;

            return parts.indexOf(type) > -1;
        }

        /**
         *
         */
        function setPanel(type) {
            retval.panel = type;
            retval.offsideToggled = false;
            retval.errors = [];
        }

        /** */
        return retval;
    }

})();
