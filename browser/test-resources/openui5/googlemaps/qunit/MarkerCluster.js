sap.ui.define(
    [
        "openui5/googlemaps/MarkerCluster", "openui5/googlemaps/Marker", "openui5/googlemaps/Map", "openui5/googlemaps/MapUtils",
        "sap/ui/model/json/JSONModel", "sap/ui/thirdparty/sinon",
        "sap/ui/thirdparty/sinon-qunit"
    ],
    function(MarkerCluster, Marker, Map, MapUtils, JSONModel) {
        "use strict";

        var oModel = new JSONModel(jQuery.sap.getModulePath("test.unit.data", "/ClusterData.json"));
        var oMap;
        var oMarkerCluster;

        sap.ui.getCore().setModel(oModel);

        module("Marker Cluster ");
        test("Should render a Marker Cluster and handle mouse events", function(assert) {
            // Arrange
            var done = assert.async();
            var delay = 1000;

            var clickSpy = this.spy();
            var mouseoverSpy = this.spy();
            var mouseoutSpy = this.spy();

            var bCalled = false;

            var fnClusterEnd = function(oEvent) {
                if (bCalled) {
                    return;
                }
                var aClusters = oMarkerCluster.markerClusterer.getClusters();
                var oCluster = aClusters[0];
                equal(aClusters.length, 1, "Clusters created");
                // Act
                // trigger events
                MapUtils.trigger(oCluster.getMarkerClusterer(), "mouseover");
                MapUtils.trigger(oCluster.getMarkerClusterer(), "mouseout");
                MapUtils.trigger(oCluster.getMarkerClusterer(), "click");

                setTimeout(function() {
                    // Assert
                    equal(mouseoverSpy.callCount, 1, "mouseover event called");
                    equal(mouseoutSpy.callCount, 1, "mouseout event called");
                    equal(clickSpy.callCount, 1, "click event called");

                    done();
                    oMap.destroy(); //Cleanup
                }, delay);

                bCalled = true;
            };

            var oMarkersTemp = new Marker({
                lat: "{lat}",
                lng: "{lng}",
                info: "{location}",
                icon: jQuery.sap.getModulePath("openui5.googlemaps.themes." + "base") + "/img/pinkball.png"
            });

            oMap = new Map({
                lat: "{/Pyrmont/lat}",
                lng: "{/Pyrmont/lng}",
                markerCluster: new MarkerCluster({
                    markers: {
                        path: "/Places",
                        template: oMarkersTemp
                    },
                    clusteringend: fnClusterEnd,
                    click: clickSpy,
                    mouseover: mouseoverSpy,
                    mouseout: mouseoutSpy
                })
            });

            oMap.setModel(oModel);
            oMap.placeAt("qunit-fixture");
            sap.ui.getCore().applyChanges();

            oMarkerCluster = oMap.getMarkerCluster();
            var aMarkers = oMarkerCluster.getMarkers();

            ok(oMarkerCluster, "Marker Cluster Rendered");
            equal(aMarkers.length, 15, "Markers created");
        });
    });
