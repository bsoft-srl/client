(function () {
    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', controller);

    /**
     *
     */
    controller.$inject = [
        '$scope',
        'DTOptionsBuilder',
        'profile',
        'weather',
        'ProfileService',
        'SmartMeterService',
        'SidecoStore',
        '$state',
        '$http',
        'UIStateService',
        'API_URL'
    ];

    function controller($scope, DTOptionsBuilder, model, weather, profile, smartMeter, store, $state, $http, UIState, API_URL) {
        var vm = this;

        /** */
        vm.utenza = model.utenza;

        /** */
        vm.edifici = model.edifici;
        vm.sensori = model.sensori;
        vm.dispositiviElettrici = model.dispositivi_elettrici;

        /** */
        vm.zone = model.zone;
        vm.illuminazione = model.illuminazione

        vm.profile = profile;
        vm.state = UIState;
        vm.smartMeter = smartMeter;
        vm.dismissAlert = dismissAlert;
        vm.offsideToggle = offsideToggle;
        vm.weather = weather;
        vm.chartData = {};

        /** */
        vm.u = {};
        vm.u.size = _.size;

        /* setta la flag della produzione energetica */
        UIState.canProduceEnergy = _.some(vm.sensori, function (model) {
            return model.tipologia.indexOf('produzione') != -1;
        });
        console.log("Può produrre energia?", UIState.canProduceEnergy);

        /**
         * Filtra i dispositivi elettrici in base all'unità selezionata
         */
         $scope.$watchCollection(function () {
             if (UIState.selectedUI) {
                 return _.filter(model.dispositivi_elettrici, function (model) {
                     return model.parent_id == UIState.selectedUI.id;
                 });
             }
         }, function (newvalue) {
            if (newvalue && _.size(newvalue))
                UIState.selectedUI.dispositivi_elettrici = newvalue;
         });

        /** */
        vm.chartData.dispositiviElettrici = {};
        vm.chartData.zone = {};

        vm.chartData.dispositiviElettrici.consumoEnergetico = function () {
            var model = this;
            return (model.potenza_nominale_w * model.modalita_utilizzo_h_g) / 1000;
        }

        vm.chartData.zone.consumoEnergetico = function () {
            var model = this;

            return _.reduce(model.illuminazione, function (memo, model) {
                return memo + model.potenza_nominale_w * model.quantita;
            }, 0);
        }

         /**
          * Filtra le zone in base all'unità selezionata
          */
          $scope.$watchCollection(function () {
              if (UIState.selectedUI) {
                  return _.filter(model.zone, function (model) {
                      return model.parent_id == UIState.selectedUI.id;
                  });
              }
          }, function (newvalue) {

              if (newvalue && _.size(newvalue)) {
                  UIState.selectedUI.zone = newvalue;

                _.each(UIState.selectedUI.zone, function (zona, i) {
                    zona.illuminazione = _.filter(model.illuminazione, function (model) {
                        return model.parent_id == zona.id;
                    });
                });
              }
          });

        /**
         * TODO: ottimizzare, rendere generica
         */
        vm.parsed = {};

        $scope.$watch(function () {
            return UIState.selectedUI && UIState.selectedUI.consumi;
        }, function (newvalue) {
            vm.parsed = prepareTable(newvalue);
        });

        function parseTh(th) {
            var parts = th.split('_');

            /** */
            function capitalize(s){
                return s.toLowerCase().replace(/\b./g, function(a) {
                    return a.toUpperCase();
                });
            };

            parts = _.map(parts, function (part) {
                return capitalize(part);
            });

            return parts.join(' ');
        }

        /**
         *
         */
        function prepareTable(target) {
            var table = {};

            _.each(target, function (collection, k) {
                table[k] = {
                    th: [],
                    tr: []
                };

                _.each(collection, function (model, th) {
                    var row = [];

                    _.each(model, function (td, th) {
                        th = parseTh(th);

                        if (table[k].th.indexOf(th) == -1) table[k].th.push(th);
                        row.push(td);
                    });

                    table[k].tr.push(row);

                });
            });

            return table;
        }

        /** */
        vm.panel = UIState.setPanel;
        vm.isPanel = UIState.isPanel;
        vm.logout = logout;

        /** */
        vm.selectedUI = null;
        vm.selectUI = selectUI;

        /** */
        vm.start = moment().format('DD-MM-YYYY');
        vm.end = moment().format('DD-MM-YYYY');
        vm.parseStart = parseStart;
        vm.parseEnd = parseEnd;

        /** */
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withDOM('<"panel-heading clearfix"f>t<"panel-footer clearfix"p>')
            .withBootstrap()
            .withBootstrapOptions({
                pagination: {
                    classes: {
                        ul: 'pagination pagination-sm'
                    }
                }
            })
            .withLanguage({
                "decimal":        "",
                "emptyTable":     "Nessun risultato da visualizzare.",
                "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty":      "Showing 0 to 0 of 0 entries",
                "infoFiltered":   "(filtered from _MAX_ total entries)",
                "infoPostFix":    "",
                "thousands":      ",",
                "lengthMenu":     "Show _MENU_ entries",
                "loadingRecords": "Caricamento…",
                "processing":     "Elaborazione…",
                "search":         "<i class='fa fa-filter mr'></i>Filtro:",
                "zeroRecords":    "Il filtro non ha restituito alcun risultato.",
                "paginate": {
                    "first":      "Primo",
                    "last":       "Ultimo",
                    "next":       "Prossimo",
                    "previous":   "Precedente"
                },
                "aria": {
                    "sortAscending":  ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                }
            });

        initialize();

        /**
         *
         */
        function initialize() {
        }

        /**
         *
         */
        function selectUI(id) {
            vm.selectedUI = id;
        }

        /**
         *
         */
        function offsideToggle() {
            UIState.offsideToggled = !UIState.offsideToggled;
        }

        /**
         *
         */
        function parseStart(date, raw) {
             var retval = moment(date, 'DD-MM-YYYY').startOf('day');
             return raw ? retval : retval.valueOf();
        }

        /**
         *
         */
        function parseEnd(date, raw) {
              var retval = moment(date, 'DD-MM-YYYY').endOf('day');
              return raw ? retval : retval.valueOf();
        }

        /**
         *
         */
        function logout() {
            // Pulisce la sessione
            store.remove('tokenId');
            store.remove('profile');
            store.remove('weather');

            // Resetta lo stato
            UIState.selectedUI = null;
            UIState.selectedBuilding = null;
            UIState.activeBuilding = null;
            UIState.sensori = null;
            UIState.panel = 'home';
            UIState.initialized = false;
            UIState.errors = [];

            $state.go('login');
        }

        /**
         *
         */
        function select(id) {
            vm.selected = id;
        }

        /**
         *
         */
        function dismissAlert(alert) {
            var index = UIState.errors.indexOf(alert);
            UIState.errors.splice(index, 1);
        }
    }
})();
