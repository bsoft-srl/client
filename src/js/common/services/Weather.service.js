(function () {
    angular
        .module('app')
        .factory('WeatherService', factory);

    /**
     *
     */
    factory.$inject = ['$http', '$q', 'UIStateService', 'SidecoStore', 'API_URL'];

    function factory($http, $q, UIStateService, store, API_URL) {

        var retval = {};

        /* */
        return retval = {

            fetch: fetch,

            /** */
            isLoading: false,
            isError: false,
            model: {}
        };

        /**
         *
         */
        function fetch(force) {

            var
                url = API_URL + '/meteo?include=w,f',
                cachedModel = store.get('weather'),
                d = $q.defer();

            if (!force && cachedModel) {

                console.debug('Getting cached weather… Done');

                retval.model = cachedModel;
                return $q.resolve(retval);
            }

            console.debug('Fetching weather…', url);

            retval.isLoading = true;

            $http.get(url)
                .then(function (res) {
                    retval.model = res.data.payload;
                    store.set('weather', retval.model);

                    console.debug('Fetching weather… Done');

                    return d.resolve(retval);
                })
                .catch(function (err) {
                    retval.isError = err.data ? err.data.message : 'Impossibile contattare il server.';

                    UIStateService.errors.push({
                        title: 'OpenWeatherMap',
                        text: retval.isError
                    });
                })
                .finally(function () {
                    retval.isLoading = false;
                });

            return d.promise;
        }
    }
})();
