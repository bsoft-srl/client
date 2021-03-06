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
            intervalFirstPicked: false,
            consumi: {
                'energia_elettrica': 0
            },
            initialized: false, // utilizzato per indicare che è stata caricata una unità immboiliare di default
            sensoriToGo: 0, // utilizzato per indicare quanti smart meters mancano ancora da caricare
            charts: {}, // gruppi di grafici. Utilizzato per sincronizzare i grafici tra di loro
            dateRange: {
                /*
                start: moment
                end: moment
                trigger: auto|zoom|pan|reset
                */
            }, // range di data presente nella viewport del grafico
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

            // resetta al cambio di pannello
            retval.errors = [];
            retval.charts = [];
            retval.pillsCount = 0;

            toggleOffside(offsideToggled);
        }

        /** */
        return retval;
    }

})();
