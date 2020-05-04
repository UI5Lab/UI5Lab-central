/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
/*global Promise*/

sap.ui.define(["jquery.sap.global"],
    function(jQuery) {
        "use strict";

        var LoadScripts = (function() {
            var Loader = {};

            Loader.notifyEvent = "google.maps.loaded";
            Loader.isLoaded = new Promise(function(fnResolve) {
                Loader.callBack = function() {
                    this.loaded = true;
                    sap.ui.getCore().getEventBus().publish(this.notifyEvent);
                    fnResolve();
                };
            });

            Loader.loadFromMapsApi = function(oMapsApi) {
                if (this.loaded !== undefined) {
                    jQuery.sap.log.warning("Can't load the Google Api scripts twice");
                    return;
                }

                this.loaded = false;
                //async load the scripts, provides namespace
                jQuery.sap.includeScript(oMapsApi.getLibraryURL(), "google.maps", null, null);
                
            };

            return Loader;
        })();

        return LoadScripts;
    }, true);
