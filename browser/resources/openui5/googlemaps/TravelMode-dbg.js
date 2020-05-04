/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define("openui5/googlemaps/TravelMode", ["jquery.sap.global"],
    function(jQuery) {
        "use strict";
        var TravelMode = {
            driving: "DRIVING",
            walking: "WALKING",
            bicycling: "BICYCLING",
            transit: "TRANSIT"
        };
        return TravelMode;

    }, /* bExport= */ true);