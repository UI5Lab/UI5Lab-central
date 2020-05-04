/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Core", "sap/ui/core/library"],
    function(jQuery) {

        "use strict";
        (function() {

            var sPath = jQuery.sap.getResourcePath("openui5/googlemaps/loadScripts");
            jQuery.sap.registerResourcePath("google.maps", sPath);

            //preload types
            jQuery.sap.require("openui5.googlemaps.MapTypeId");
            jQuery.sap.require("openui5.googlemaps.Animation");
            jQuery.sap.require("openui5.googlemaps.TravelMode");
            jQuery.sap.require("openui5.googlemaps.UnitSystem");


            // delegate further initialization of this library to the Core
            sap.ui.getCore().initLibrary({
                name: "openui5.googlemaps",
                dependencies: ["sap.ui.core"],
                types: [
                    "openui5.googlemaps.MapTypeId",
                    "openui5.googlemaps.Animation",
                    "openui5.googlemaps.TravelMode",
                    "openui5.googlemaps.UnitSystem"
                ],
                interfaces: [],
                controls: [
                    "openui5.googlemaps.loadScripts",
                    "openui5.googlemaps.Map", 
                    "openui5.googlemaps.Marker",
                    "openui5.googlemaps.Polyline",
                    "openui5.googlemaps.Polygon",
                    "openui5.googlemaps.Directions",
                    "openui5.googlemaps.Waypoint",
                    "openui5.googlemaps.MarkerCluster"
                ],
                elements: [
                    "openui5.googlemaps.MapsApi"
                ],
                version: "0.0.29"

            });
        })();
        return true;
    }, true);
