/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define("openui5/googlemaps/UnitSystem", ["jquery.sap.global"],
    function(jQuery) {
        "use strict";
        // These need to match Google"s constants
        var UnitSystem = {
            IMPERIAL: 1,
            METRIC: 0
        };
        return UnitSystem;
    }, true);
