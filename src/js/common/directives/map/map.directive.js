(function () {

    angular
        .module('app')
        .directive('soMap', directive);

    /**
     *
     */
    directive.$inject = ['$http', 'ProfileService', 'UIStateService'];

    function directive($http, profileService, UIStateService) {
        return {
            restrict: 'E',
            templateUrl: 'common/directives/map/map.html',
            replace: true,

            /**
             *
             */
            link: function ($scope, $element, $attrs) {
                var
                    map = L.map($element[0]),
                    layer = L.geoJson(null, {
                        /**
                         *
                         */
                        style: function (feature) {

                            var
                                styles = {
                                    'perimetro_quartiere': {
                                        color: 'red'
                                    },
                                    'grafo_viario': {
                                        color: 'magenta'
                                    },
                                    'privato': {
                                        color: 'blue'
                                    },
                                    'pubblico': {
                                        color: 'orange'
                                    },
                                    'commerciale': {
                                        color: 'green'
                                    }
                                },

                                /** Stili condivisi */
                                style = {
                                    weight: 2
                                },
                                type = feature.id.split('.')[0];

                            return _.extend(style, styles[type]);
                        }
                    }).addTo(map);

                L.Icon.Default.imagePath = 'images';
                L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);

                //map.dragging.disable();
                map.scrollWheelZoom.disable();

                /** Aggiunge i vari layer alla mappa */
                var geoJson = [
                    'perimetro_quartiere',
                    'grafo_viario'
                ];

                profileService.getUtenza()
                    .then(function (model) {
                        return model.tipologia;
                    })
                    .then(function (tipologia) {
                        if (tipologia == 0) geoJson.push('privato');
                        else if (tipologia == 1) geoJson.push('pubblico');
                        else if (tipologia == 2) geoJson.push('commerciale');


                        _.each(geoJson, function (layerName) {
                            profileService.getGeoJson(layerName)
                                .then(function (data) {
                                    data && layer.addData(data);
                                });
                        })
                    });

                map.setView(UIStateService.selectedBuilding.latLon, 15);
                L.marker(UIStateService.selectedBuilding.latLon).addTo(map);
            }
        }
    }
})();
