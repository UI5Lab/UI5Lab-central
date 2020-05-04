sap.ui.define(
    [
        "openui5/googlemaps/Polyline", "openui5/googlemaps/Map",
        "openui5/googlemaps/MapUtils", "sap/ui/model/json/JSONModel"
    ],
    function(Polyline, Map, MapUtils, JSONModel) {
        "use strict";
        var MAP_ID = "MAP_TEST";

        var oModel = new JSONModel(jQuery.sap.getModulePath("test.unit.data", "/Data.json"));
        sap.ui.getCore().setModel(oModel);

        module("Polyline - defaults test");
        test("Should create a Polyline on map", function(assert) {
            // Arrange
            var oPoly1 = new Polyline("POLY1", {
                path: "{/Beaches}",
                visible: false
            });
            sap.ui.getCore().applyChanges();

            var oMap = new Map(MAP_ID, {
                lat: "{/Pyrmont/lat}",
                lng: "{/Pyrmont/lng}",
                polylines: [oPoly1]
            });
            oMap.setModel(oModel);
            oMap.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            // Assert
            var oPoly = sap.ui.getCore().byId("POLY1");
            ok(oPoly, "Polyline rendered");
            ok(oPoly.map, "Map attached");
            equal(oPoly.getVisible(), false, "Polyline not visible");

            oPoly.setVisible(true);
            equal(oPoly.getVisible(), true, "Polyline is visible");

            oPoly.destroy(); //cleanup
            oMap.destroy();

        });
    });
