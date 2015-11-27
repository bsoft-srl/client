(function () {
    angular
        .module('app')
        .factory('ProfileService', factory);

    /**
     *
     */
    factory.$inject = ['$http', '$q', 'UIStateService', 'SidecoStore', 'API_URL'];

    function factory($http, $q, UIStateService, store, API_URL) {

        var retval;

        /* */
        return retval = {

            fetch: fetch,

            /** */
            isLoading: false,
            isError: false,

            /** */
            getUtenza: getUtenza,

            /** */
            getEdificioById: getEdificioById,
            getUIByEdificioId: getUIByEdificioId,
            getSensoriByUI: getSensoriByUI,
            getGeoJson: getGeoJson,
            extraInfo: extraInfo
        };

        /**
         *
         */
        function _fetch(force) {
            var
                model = {},
                d = $q.defer();

            console.log('Getting json…');

            retval.isLoading = true;

            $http.get('profile.json')
                .then(function (res) {
                    model = res.data.payload;
                    store.set('profile', model);

                    console.debug('Fetching profile… Done');

                    return d.resolve(model);
                })
                .catch(function (err) {
                    retval.isError = err.data ? err.data.message : 'Impossibile contattare il server.';

                    UIStateService.errors.push({
                        title: 'Profile',
                        text: retval.isError
                    });
                })
                .finally(function () {
                    retval.isLoading = false;
                });

            return d.promise;
        }

        /**
         *
         */
        function fetch(force) {

            var
                url = API_URL + '/profilo/me?include=u,ui,e,s,z,de,i,g',
                cachedModel = store.get('profile'),
                model = {},
                d = $q.defer();

            if (!force && cachedModel) {
                console.debug('Getting cached profile… Done');
                return $q.resolve(cachedModel);
            }

            console.debug('Fetching profile…', url);

            retval.isLoading = true;

            $http.get(url)
                .then(function (res) {
                    model = res.data.payload;
                    store.set('profile', model);

                    console.debug('Fetching profile… Done');

                    return d.resolve(model);
                })
                .catch(function (err) {
                    retval.isError = err.data ? err.data.message : 'Impossibile contattare il server.';

                    UIStateService.errors.push({
                        title: 'Profile',
                        text: retval.isError
                    });
                })
                .finally(function () {
                    retval.isLoading = false;
                });

            return d.promise;
        }

        /**
         *
         */
        function getUtenza() {
            return fetch()
                .then(function (model) {
                    return $q.resolve(model.utenza);
                });
        }

        /**
         *
         */
        function getEdificioById(id) {
            return fetch()
                .then(function (model) {
                    var row = _.findWhere(model.edifici, {id: id});

                    return $q.resolve(row);
                });
        }

        /**
         *
         */
        function getSensoriByUI(id) {
            return fetch()
                .then(function (model) {
                    var rows = _.where(model.sensori, {parent_id: id});
                    return $q.resolve(rows);
                });
        }

        /**
         *
         */
        function getUIByEdificioId(id) {
            return fetch()
                .then(function (model) {
                    var rows = _.where(model.unita_immobiliari, {'parent_id': id + ''});

                    return $q.resolve(rows);
                });
        }

        /**
         *
         */
        function getGeoJson(featureType) {
            return fetch()
                .then(function (model) {
                    return model.geo ? model.geo[featureType] : false;
                });
        }

        /**
         *
         */
        function getUIById(id) {

        }

        /**
         *
         */
        function extraInfo(model) {
            var retval = [];

            /** */
            function capitalize(s){
                return s.toLowerCase().replace(/\b./g, function(a) {
                    return a.toUpperCase();
                });
            };

            model = _.omit(model,
                '$$hashKey',
                'id',
                'parent',
                'parent_id',
                'latLon',
                'consumi'
            );

            _.each(model, function (v, k) {

                if (!v) return;

                if (_.isObject(v)) {
                    _.each(v, function (vv, kk) {
                        retval.push({
                            k: capitalize((k + '_' + kk).replace(/_/g, ' ')),
                            v: vv
                        })
                    })
                } else {
                    k = capitalize(k.replace(/_/g, ' '));

                    retval.push({
                        k: k,
                        v: v
                    });
                }
            });

            return retval;
        }
    }
})();
