sap.ui.define(
    [
        "openui5/googlemaps/Directions", "openui5/googlemaps/Waypoint", "openui5/googlemaps/Map", "openui5/googlemaps/MapUtils", "sap/ui/model/json/JSONModel"
    ],
    function(Directions, Waypoint, Map, MapUtils, JSONModel) {
        "use strict";
        var MAP_ID = "MAP_TEST";
        var oPlaces = {
            name: "Bondi Beach",
            lat: -33.890542,
            lng: 151.274856,
            start: "Manly",
            end: "Cronulla",
            stops: [
                { "name": "Homebush" },
                { "name": "Bankstown" },
                { "name": "Menai, NSW" }
            ]
        };

        var oModel = new JSONModel(oPlaces);
        sap.ui.getCore().setModel(oModel);


        module("Directions - defaults test");
        test("Should create Directions with Waypoints", function(assert) {
            // Arrange
            var delay = 1000;
            var done = assert.async();
            var oDirectionsTemp = new Directions({
                startAddress: "{/start}",
                endAddress: "{/end}",
                waypoints: {
                    path: "/stops",
                    template: new Waypoint({
                        location: "{name}"
                    })
                },
                optimizeWaypoints: true,
                travelMode: openui5.googlemaps.TravelMode.driving,
                unitSystem: openui5.googlemaps.UnitSystem.IMPERIAL
            });

            var oMap = new Map(MAP_ID, {
                lat: "{/lat}",
                lng: "{/lng}",
                zoom: 7,
                zoomControl: true,
                directions: oDirectionsTemp
            });
            oMap.setModel(oModel);

            oMap.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();


            setTimeout(function() {
                var oDirections = oMap.getDirections();
                ok(oDirections, "Directions on Map");

                var aWaypoints = oDirections.getWaypoints();
                equal(aWaypoints.length, 3, "Waypoints renedered");
                done();
                oMap.destroy(); // Clean up
            }, delay);

        });

    });
