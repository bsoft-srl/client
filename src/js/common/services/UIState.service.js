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
            initialized: false, // utilizzato per indicare che è stata caricata una unità immboiliare di default
            sensoriToGo: 0, // utilizzato per indicare quanti smart meters mancano ancora da caricare
            errors: [
                /*{
                    title: '',
                    text: ''
                }*/
            ],

            /** */
            isPanel: isPanel,
            setPanel: setPanel,
            toggleOffside: toggleOffside,
            resetSensoriToGo: resetSensoriToGo
        };

        /**
         *
         */
        function resetSensoriToGo(amount) {
            retval.sensoriToGo = (retval.sensoriToGo + amount) || _.size(retval.sensori);
        }

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
        function toggleOffside(toggle) {
            retval.offsideToggled = !!toggle;
        }

        /**
         *
         */
        function setPanel(type, offsideToggled) {
            retval.panel = type;
            retval.errors = [];

            toggleOffside(offsideToggled);
        }

        /** */
        return retval;
    }

})();
