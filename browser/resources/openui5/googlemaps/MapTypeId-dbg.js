/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define("openui5/googlemaps/MapTypeId", ["jquery.sap.global"],
    function(jQuery) {
        "use strict";
        var MapTypeId = {
            ROADMAP: "roadmap",
            SATELLITE: "satellite",
            HYBRID: "hybrid",
            TERRAIN: "terrain"
        };
        return MapTypeId;

    }, /* bExport= */ true);