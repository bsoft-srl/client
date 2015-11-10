(function(){angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("dashboard/dashboard.html","<div class=\"so-overlay\" ng-class=\"{\'so-overlay--error\': dashboard.error}\" ng-show=\"dashboard.loading\"></div>\n\n<div class=\"content-wrapper\">\n    <h3 class=\"clearfix\">\n        <span class=\"pull-left\">\n            <em class=\"fa fa-pie-chart\"></em> Dashboard\n        </span>\n\n        <div class=\"btn-toolbar pull-right\">\n            <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"\">\n                <button type=\"button\" class=\"btn btn-default\" ng-click=\"dashboard.logout()\"><em class=\"fa fa-sign-out\"></em> Esci</button>\n            </div>\n        </div>\n    </h3>\n\n    <div class=\"row\">\n        <aside class=\"col-lg-3 col-lg-push-9\">\n\n            <div class=\"panel panel-default\" ng-if=\"dashboard.store.edifici\" ng-repeat=\"e in dashboard.store.edifici\">\n                <div class=\"panel-heading\">\n                    <div class=\"panel-title\">{{e.denominazione}}</div>\n                    <small class=\"text-muted\">{{e.indirizzo}} {{e.civico}}</small>\n                </div>\n\n                <div class=\"panel-body\">\n                    <div class=\"list-group mb0\">\n                        <a href=\"#\" class=\"list-group-item\" ng-click=\"dashboard.select(ui.id)\" ng-repeat=\"ui in dashboard.findByE(e.id)\">\n                            <span class=\"label label-warning pull-right\">{{dashboard.getSmartMeterByUI(ui.id).length}}</span>\n                            <em class=\"fa fa-home mr\"></em>{{ui.id}}\n                        </a>\n                    </div>\n                </div>\n\n                <!--<div class=\"panel-footer\">\n                    FOOTER\n                </div>-->\n            </div>\n\n\n        </aside>\n        <main class=\"col-lg-9 col-lg-pull-3\">\n\n            <div class=\"row animated fadeInDown\" ng-if=\"dashboard.selected\">\n                <div class=\"col-lg-4 col-md-12\">\n                    <div class=\"panel widget bg-success\">\n                        <div class=\"row row-table\">\n                            <div class=\"col-xs-4 text-center bg-success-dark pv-lg\">\n                                <em class=\"fa fa-home fa-3x\"></em>\n                            </div>\n                            <div class=\"col-xs-8 pv-lg\">\n                                <div class=\"h2 m0 text-bold\">{{dashboard.selected}}</div>\n                                <div class=\"text-uppercase\">Numero Contatore</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"col-lg-4 col-md-12\">\n                    <div class=\"panel widget bg-warning\">\n                        <div class=\"row row-table\">\n                            <div class=\"col-xs-4 text-center bg-warning-dark pv-lg\">\n                                <em class=\"fa fa-plug fa-3x\"></em>\n                            </div>\n                            <div class=\"col-xs-8 pv-lg\">\n                                <div class=\"h2 m0 text-bold\">{{dashboard.store.sensori.length}}</div>\n                                <div class=\"text-uppercase\">Numero Sensori</div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n\n                <div class=\"col-lg-4 col-md-12\">\n                    <div class=\"panel widget bg-purple\">\n                        <div class=\"row row-table\">\n                            <div class=\"col-xs-4 text-center bg-purple-dark pv-lg\">\n                                <em class=\"fa fa-calendar fa-3x\"></em>\n                            </div>\n                            <div class=\"col-xs-8 pv-lg\">\n                                <input class=\"h2 m0 text-bold\" id=\"so-from\" so-date-picker ng-model=\"dashboard.from\" type=\"text\" placeholder=\"Inizio\" ng-click=\"dashboard.handleFromClick()\">\n                                <input id=\"so-to\" so-date-picker type=\"text\" ng-model=\"dashboard.to\" placeholder=\"Fine\" ng-disabled=\"!dashboard.from || (dashboard.from && dashboard.to)\">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"row\" ng-if=\"dashboard.selected && !dashboard.smartMeterDidInit && dashboard.from && dashboard.to\">\n                <div class=\"col-lg-12\">\n                    <div class=\"progress\">\n                      <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 100%\">\n                        <span class=\"sr-only\">Loading…</span>\n                      </div>\n                    </div>\n                </div>\n            </div>\n\n            <so-smart-meter\n                id=\"dashboard.selected\"\n                data=\"sm\"\n                metric=\"sm.tipologia\"\n                from=\"dashboard.from\"\n                to=\"dashboard.to\"\n                channels=\"sm.numero_canali\"\n                initialized=\"dashboard.smartMeterInitialized(dashboard.store.sensori.length)\"\n                ng-repeat=\"sm in dashboard.store.sensori\"\n                ng-if=\"dashboard.selected && dashboard.from && dashboard.to\">\n            </so-smart-meter>\n\n            <so-weather fetch=\"dashboard.getWeather()\" limit=\"5\"></so-weather>\n        </main>\n    </div>\n</div>\n");
$templateCache.put("login/login.html","<div class=\"row\">\n    <div class=\"col-sm-4 col-sm-offset-4\">\n        <h1>LoginView</h1>\n        <form>\n            <div class=\"panel panel-default\" ng-class=\"{\'is-loading\': login.loading, \'animated shake\': login.error}\">\n                <div class=\"panel-body\">\n                    <div class=\"form-group\">\n                        <input placeholder=\"Codice Fiscale\" class=\"form-control input-lg\" ng-model=\"login.codiceFiscale\">\n                    </div>\n                    <div class=\"form-group\">\n                        <input placeholder=\"Password\"  class=\"form-control input-lg\" ng-model=\"login.password\" type=\"password\">\n                    </div>\n\n                    <div class=\"alert alert-danger\" role=\"alert\" ng-show=\"login.error\">{{login.error}}</div>\n                </div>\n                <div class=\"panel-footer clearfix\">\n                    <button type=\"submit\" class=\"btn btn-primary btn-lg pull-right\" ng-click=\"login.login(login.codiceFiscale, login.password)\">Entra</button>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n");
$templateCache.put("common/directives/smart-meter/smart-meter.html","<div class=\"row animated fadeInDown\" ng-if=\"sm.chartData\">\n    <div class=\"col-lg-12\">\n        <div class=\"panel widget\" ng-class=\"{\'is-loading\': sm.loading}\">\n            <div class=\"panel-heading\">\n                <h2 class=\"panel-title pull-left\">{{sm.title}}</h2>\n\n                <div class=\"btn-toolbar pull-right\">\n                    <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"canali\">\n                        <button\n                            type=\"button\"\n                            class=\"btn btn-default\"\n                            ng-class=\"{\'active\': sm.channel == c}\"\n                            ng-repeat=\"c in sm.channels\"\n                            ng-click=\"sm.refresh(c)\"\n                        >\n                          {{c == 0 ? \'Canale\' : \'\'}} {{c + 1}}\n                      </button>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"panel-body\">\n                <div class=\"pv-lg\">\n                    <div so-chart=\"sm.chartData\" options=\"sm.chartOptions\"></div>\n                </div>\n            </div>\n\n            <div class=\"panel-footer\">\n                <ul class=\"list-inline\">\n                    <li><span class=\"label label-info\">MAC</span> {{sm.info.mac_address}}</li>\n                    <li><span class=\"label label-info\">DATALOGGER</span> {{sm.info.mac_address_datalogger}}</li>\n                </ul>\n            </div>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("common/directives/weather/weather.html","<div class=\"row animated fadeInDown\" ng-if=\"weather.data\">\n    <div class=\"col-lg-12\">\n        <div class=\"panel widget\" ng-class=\"{\'is-loading\': weather.loading}\">\n           <div class=\"row row-table\">\n\n              <div class=\"col-md-2 col-sm-3 col-xs-6 text-center bg-info pv-xl\">\n                  <em class=\"fa fa-refresh so-weather__refresh hidden-xs\" ng-click=\"weather.refresh(true)\"></em>\n                 <em class=\"wi wi-{{weather.data.attuale.icona}} fa-4x\"></em>\n              </div>\n              <div class=\"col-md-2 col-sm-3 col-xs-6 pv br\">\n                 <div class=\"h1 m0 text-bold\">{{weather.data.attuale.temperatura}}°</div>\n                 <div class=\"text-uppercase\">{{weather.iconCondition(weather.data.attuale.icona)}}</div>\n              </div>\n\n              <div class=\"col-md-2 col-sm-3 pv text-center\" ng-class=\"{\'br\': !$last, \'hidden-xs\': $index > 2}\" ng-repeat=\"p in weather.data.previsioni.slice(1) | limitTo:(limit-1)\">\n                 <div class=\"text-info text-sm\">{{p.data}}</div>\n                 <div class=\"text-muted text-md\">\n                    <em class=\"wi wi-{{p.icona}}\"></em>\n                 </div>\n                 <div class=\"text-info\">\n                    <em class=\"wi wi-sprinkles\"></em>\n                    <span class=\"text-muted\">\n                        Umidit&agrave; {{p.umidita_pct}}%\n                    </span>\n                 </div>\n                 <div>\n                     <span class=\"text-muted\">\n                         {{p.temperature.max}}°\n                     </span>\n                     <span style=\"color: #bbb\">\n                         {{p.temperature.min}}°\n                     </span>\n                 </div>\n              </div>\n           </div>\n        </div>\n    </div>\n\n   <div class=\"col-lg-12\" ng-if=\"weather.chartData\">\n      <div class=\"panel widget\" ng-class=\"{\'is-loading\': weather.loading}\">\n        <div class=\"panel-body\">\n            <div class=\"text-info\">\n                <em class=\"wi wi-thermometer fa-2x text-muted pull-right\"></em>\n                Andamento previsionale temperature a {{weather.chartData.columns[0].length - 1}} giorni\n            </div>\n            <div class=\"pv-lg\">\n                <div\n                    so-chart=\"weather.chartData\"\n                    options=\"weather.chartOptions\"\n                ></div>\n            </div>\n        </div>\n        <div class=\"panel-footer\">\n            <small class=\"text-muted\">Dati offerti dal servizio meteo <a href=\"http://www.openweathermap.org\">OpenWeatherMap</a>. Risultati aggiornati al {{weather.data.attuale.data}}.</small>\n        </div>\n      </div>\n   </div>\n</div>\n");}]);})();