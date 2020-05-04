sap.ui.define(
    [
        "openui5/googlemaps/Map",
        "openui5/googlemaps/MapsApi",
        "openui5/googlemaps/MapUtils",
        "openui5/googlemaps/MapTypeId",
        "openui5/googlemaps/Marker",
        "openui5/googlemaps/Polyline",
        "openui5/googlemaps/Polygon",
        "openui5/googlemaps/Directions",
        "openui5/googlemaps/MarkerCluster",
        "sap/ui/thirdparty/sinon",
        "sap/ui/thirdparty/sinon-qunit"
    ],
    function(Map, MapsApi, MapUtils, MapTypeId, Marker, Polyline, Polygon, Directions, MarkerCluster) {
        "use strict";
        sinon.config.useFakeTimers = false;

        var MAP_POSITION = {};
        MAP_POSITION.lat = parseFloat("-33.895");
        MAP_POSITION.lng = parseFloat("151.275");

        var oCore = sap.ui.getCore();

        module("Map - defaults test");
        test("Should create and destroy a map object", function(assert) {
            // Arrange    
            var sTestID = "MAP1";
            var oMap = new Map(sTestID, {
                lat: undefined,
                lng: undefined
            });

            equal(oMap.getId(), sTestID, "Map has ID: " + sTestID);
            oMap.placeAt("qunit-fixture");

            oCore.applyChanges();
            var oMap2 = oCore.byId(sTestID);

            // Act
            ok(!!oMap2, "Object created and found byId");
            ok(oMap2.$().size() > 0, "DOM has some content");
            equal(oMap.map, undefined, "no lat lng no map");

            // Assert
            // Destroy object
            oMap2.destroy();
            oCore.applyChanges();

            ok(oMap2.$().size() === 0, "DOM content destroyed");

            // try to find destroyed object
            var oMap3 = oCore.byId(sTestID);
            ok(!oMap3, "UI5 Object cannot be found");

            oMap.destroy();
        });

        test("Should smulate API being loaded", function(assert) {
            var oMap = new Map();
            var loadScriptsSpy = this.spy();
            this.stub(google.maps, "loaded", undefined);
            this.stub(jQuery.sap, "includeScript", loadScriptsSpy);

            // Act
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            //Assert
            equal(oMap.subscribed, true, "subscribed to GMAPS load");
            equal(loadScriptsSpy.callCount, 1, "include script called");
            oMap.destroy();
        });

        module("Map Test Options");
        test("Should create a Map with correct default values", function(assert) {
            // Arrange
            var oMap = new Map();

            // Assert
            equal(oMap.getLat(), 1, "default latitude found ");
            equal(oMap.getLng(), 1, "default longitude found ");
            equal(oMap.getDisableDefaultUI(), true, "disable default UI found ");
            ok(MapUtils.floatEqual(oMap.getLat(), 1), "default latitude found ");
            ok(MapUtils.floatEqual(oMap.getLng(), 1), "default longitude found ");
            equal(oMap.getDisableDefaultUI(), true, "disable default UI found ");
            equal(oMap.getWidth(), "auto", "default width found");
            equal(oMap.getHeight(), "20em", "default height found");
            equal(oMap.getZoom(), 8, "default zoom found");
            equal(oMap.getMapTypeId(), "roadmap", "default mapTypeID found");
            equal(oMap.getPanControl(), false, "default panControl found");
            equal(oMap.getMapTypeControl(), false, "default mapTypeControl found");
            equal(oMap.getStreetViewControl(), false, "default streetViewControl found");
            equal(oMap.getFitToMarkers(), false, "default fit to markers false");
            oMap.destroy();
        });

        test("Should create a map with correct settings", function(assert) {
            // Arrange
            var oMap = new Map({
                lat: MAP_POSITION.lat,
                lng: MAP_POSITION.lng,
                width: "20em",
                height: "10em",
                zoom: 10,
                disableDefaultUI: false,
                mapTypeId: MapTypeId.TERRAIN,
                fitToMarkers: true
            });
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            ok(MapUtils.floatEqual(oMap.getLat(), MAP_POSITION.lat), "set latitude found ");
            ok(MapUtils.floatEqual(oMap.getLng(), MAP_POSITION.lng), "set longitude found ");
            equal(oMap.getDisableDefaultUI(), false, "enabled default UI found ");
            equal(oMap.getWidth(), "20em", "set width found");
            equal(oMap.getHeight(), "10em", "set height found");
            equal(oMap.getZoom(), 10, "set zoom found");
            equal(oMap.getMapTypeId(), "terrain", "set mapTypeID found");
            equal(oMap.getPanControl(), false, "default panControl found");
            equal(oMap.getMapTypeControl(), false, "default mapTypeControl found");
            equal(oMap.getStreetViewControl(), false, "default streetViewControl found");
            equal(oMap.getFitToMarkers(), true, "fit to markers set");
            oMap.destroy();
        });

        test("Should set options on map after its creation", function(assert) {
            // Arrange
            assert.expect(11);
            var delay = 1000;
            var done = assert.async();
            var oMap = new Map();
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Act
            oMap
                .setLat(MAP_POSITION.lat)
                .setLng(MAP_POSITION.lng)
                .setDisableDefaultUI(false)
                .setWidth("20em")
                .setHeight("10em")
                .setZoom(10)
                .setMapTypeId(MapTypeId.HYBRID)
                .setPanControl(true)
                .setMapTypeControl(true)
                .setStreetViewControl(true)
                .setZoomControl(true);
            oCore.applyChanges();

            // Assert
            setTimeout(function() {
                ok(MapUtils.floatEqual(oMap.getLat(), MAP_POSITION.lat), "set latitude found ");
                ok(MapUtils.floatEqual(oMap.getLng(), MAP_POSITION.lng), "set longitude found ");
                equal(oMap.getDisableDefaultUI(), false, "enabled default UI found ");
                equal(oMap.getWidth(), "20em", "set width found");
                equal(oMap.getHeight(), "10em", "set height found");
                equal(oMap.getZoom(), 10, "set zoom found");
                equal(oMap.getMapTypeId(), "hybrid", "set mapTypeID found");
                equal(oMap.getPanControl(), true, "set panControl found");
                equal(oMap.getMapTypeControl(), true, "set mapTypeControl found");
                equal(oMap.getStreetViewControl(), true, "set streetViewControl found");
                equal(oMap.getZoomControl(), true, "set ZoomControl found");
                done();
                oMap.destroy();
            }, delay);
        });

        module("Map Test Events");

        test("Should change zoom settings after map creation", function(assert) {
            // Arrange
            var oMap = new Map();
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Act
            oMap.map.setZoom(5);
            oMap.map.setMapTypeId(MapTypeId.HYBRID);
            oCore.applyChanges();

            // Assert
            equal(oMap.getZoom(), 5, "set zoom found");
            equal(oMap.getMapTypeId(), "hybrid", "set mapTypeID found");
            oMap.destroy();
        });

        test("Should reset dragging flag after map change", function(assert) {
            // Arrange
            var delay = 500;
            var done = assert.async();
            var oMap = new Map();
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            oMap.isDragging(true);
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            setTimeout(function() {
                equal(oMap._dragging, false, "has stopped dragging");

                done();
                oMap.destroy();
            }, delay);
        });

        test("Should call map ready event", function(assert) {
            // Arrange
            var done = assert.async();
            var delay = 1000;
            var readySpy = this.spy();
            var oMap = new Map({
                ready: readySpy

            });
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            setTimeout(function() {
                equal(readySpy.callCount, 1, "Ready event called");
                done();
                oMap.destroy(); // Clean up
            }, delay);
        });

        test("Should trigger event on map click", function(assert) {
            // Arrange
            var done = assert.async();
            var delay = 10;
            var clickSpy = this.spy();

            var oMap = new Map({
                click: clickSpy

            });
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Act
            // fire a click on the map
            oMap.trigger("click", { latLng: MapUtils.objToLatLng(MAP_POSITION) });

            // Assert
            setTimeout(function() {
                equal(clickSpy.callCount, 1, "Click event called");
                done();
                oMap.destroy(); // Clean up
            }, delay);
        });

        test("Should notify aggregations of map change", function(assert) {
            // Arrange
            var done = assert.async();
            var delay = 100;
            var aPath = [{
                lat: MAP_POSITION.lat,
                lng: MAP_POSITION.lng
            }];
            var oMap = new Map({
                markers: new Marker(),
                polylines: new Polyline({
                    path: aPath
                }),
                polygons: new Polygon({
                    paths: aPath
                }),
                directions: new Directions(),
                markerCluster: new MarkerCluster()
            });
            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            setTimeout(function() {
                equal(oMap.getMarkers().length, 1, "has one marker");
                equal(oMap.getPolylines().length, 1, "has one polyline");
                equal(oMap.getPolygons().length, 1, "has one polygon");
                equal(!!oMap.getDirections(), true, "has one direction");
                equal(!!oMap.getMarkerCluster(), true, "has one marker cluster");
                done();
                oMap.destroy();
            }, delay);
        });

        module("Map - test map Api");
        test("Should load API on creation of map", function(assert) {
            // arrange
            var done = assert.async();
            var delay = 100;
            this.stub(google.maps, "loaded", undefined);

            var oLoadSpy = this.spy();
            this.stub(MapsApi.prototype, "load", oLoadSpy);

            // act
            var oMap = new Map({});

            oMap.placeAt("qunit-fixture");
            oCore.applyChanges();

            // Assert
            setTimeout(function() {
                equal(oLoadSpy.callCount, 1, "maps api load was called");
                done();
                oMap.destroy();
            }, delay);
        });
    });