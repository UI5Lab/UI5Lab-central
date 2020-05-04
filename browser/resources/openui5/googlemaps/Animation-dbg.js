/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define("openui5/googlemaps/Animation", ["jquery.sap.global"],
    function(jQuery) {
        "use strict";
        var Animation = {
            BOUNCE: 1,
            DROP: 2,
            k: 3,
            j: 4
        };
        return Animation;

    }, /* bExport= */ true);