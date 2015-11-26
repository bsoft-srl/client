(function () {
    angular
        .module('app')
        .factory('SmartMeterService', factory);

    /**
     *
     */
    factory.$inject = ['$http', '$q', 'SidecoStore', 'UIStateService', 'API_URL'];

    function factory($http, $q, store, UIStateService, API_URL) {

        var retval;

        /* */
        return retval = {

            fetch: fetch,

            /** */
            isLoading: false,
            isError: false
        };

        /**
         *
         */
        function fetch(id, opts) {

            var

            url = API_URL + '/sensori/',
            dps = [],
            d = $q.defer(),

            /** */
            defaults = {
                channel: 0,
                start: moment(),
                end: moment()
            };

            opts = _.extend(defaults, opts);

            url += id + '/' + opts.metric + '/' + (opts.channel + 1) + '?start=' + startOfDay(opts.start) + '&end=' + endOfDay(opts.end);

            console.debug('Fetching smart meter data…', url);
            retval.isLoading = true;

            $http.get(url)
                .then(function (res) {
                    dps = res.data.payload[0].dps;

                    console.debug('Fetching smart meter data… Done');

                    return d.resolve(dps);
                })
                .catch(function (err) {
                    retval.isError = err.data ? 'MISURATORE ' + opts.metric.toUpperCase() + ': ' + err.data.message : 'Impossibile contattare il server.';
                    UIStateService.errors.push({
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
        function startOfDay(m) {
            return moment(m).startOf('day').valueOf();
        }

        /**
         *
         */
        function endOfDay(m) {
            return moment(m).endOf('day').valueOf();
        }
    }
})();
