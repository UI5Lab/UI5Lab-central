sap.ui.define([
    "openui5/googlemaps/MapsApi",
    "test/unit/Map",
    "test/unit/MapUtils",
    "test/unit/Marker",
    "test/unit/Polygon",
    "test/unit/Polyline",
    "test/unit/Directions",
    "test/unit/MarkerCluster",
    "test/unit/MapsApi",
    "test/unit/LoadScripts"
], function(MapsApi) {
    "use strict";

    // Phantom js does not have a function.bind implementation so we are using a polyfill
    if (!Function.prototype.bind) {
        /*eslint-disable no-extend-native*/
        Function.prototype.bind = function(oThis) {
            return jQuery.proxy(this, oThis);
        };
        /*eslint-enable no-extend-native*/
    }
    
    // Phantom js doesnt have a geolocation function so mock it
    if (navigator.geolocation === undefined) {
        navigator.geolocation = {
            getCurrentPosition: function() {}
        };
    }


    /**
     * Delayed start of QUnit or KarmaJS might break.
     * @returns {void}
    //  */
    function checkStart() {

        if (!window["sap-ui-config"] || !window["sap-ui-config"].libs || !sap) {
            setTimeout(checkStart, 500);
            return;
        }

        var oMapsApi = new MapsApi({
            apiKey: "AIzaSyD6EmAk92gaGzjYVYU-ebd_BK-rgejSoZ0"
        });

        oMapsApi.load();

        /**
         * monkey patch, Karma-QUnit starts testing before libraries are loaded
         * known issue, this is easy than recommended fix
         * https://github.com/karma-runner/karma-qunit/issues/27
         * @returns {void}
         **/
        if (window.__karma__) {
            var myStart = window.__karma__.start;
            window.__karma__.start = function() {
                return google.maps.isLoaded.then(function() {
                    myStart.apply(this, arguments);
                });
            };
        }
    }

    checkStart();
});
