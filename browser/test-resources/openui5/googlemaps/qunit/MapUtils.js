sap.ui.define(
    [
        "openui5/googlemaps/MapUtils",
        "sap/ui/thirdparty/sinon",
        "sap/ui/thirdparty/sinon-qunit"
    ],
    function(MapUtils) {
        "use strict";

        function stubCurrentLocationSuccess(oSinonSandbox) {
            oSinonSandbox.stub(navigator.geolocation, "getCurrentPosition", function(success, error, options) {
                success({
                    "coords": {
                        "latitude": parseFloat("-33.895"),
                        "longitude": parseFloat("151.275")
                    }
                });

            });
        }

        function stubCurrentLocationError(oSinonSandbox) {
            oSinonSandbox.stub(navigator.geolocation, "getCurrentPosition", function(success, error, options) {
                error({
                    code: 123,
                    message: "failed"
                });
            });
        }


        function stubGeoCodePositionSuccess(oSinonSandbox) {
            oSinonSandbox.stub(google.maps, "Geocoder", function() {
                return {
                    geocode: function(object, callback) {
                        callback([{ "formatted_address": object.address }]);
                    }
                };
            });
        }

        function stubGeoCodePositionError(oSinonSandbox) {
            oSinonSandbox.stub(google.maps, "Geocoder", function() {
                return {
                    geocode: function(object, callback) {
                        callback([]);
                    }
                };
            });
        }

        module("MapUtils - Lat Long tests");
        test("Should compare to lat lang objects", function(assert) {
            // Arrange    
            var oVal = {
                lat: parseFloat("-33.895"),
                lng: parseFloat("151.275")
            };

            // Assert
            ok(MapUtils.latLngEqual(oVal, oVal), "lat lng equals");
        });

        test("Should call LatLng function", function(assert) {
            // Arrange
            var latLngSpy = this.spy();
            this.stub(google.maps, "LatLng", latLngSpy);

            // act
            MapUtils.objToLatLng({});

            // Assert
            equal(latLngSpy.callCount, 1, "latLng was called");
        });

        test("Should return an object from latLng", function(assert) {
            // Arrange
            var latSpy = this.spy();
            var lngSpy = this.spy();

            // act
            MapUtils.latLngToObj({ lat: latSpy, lng: lngSpy });

            // Assert
            equal(latSpy.callCount, 1, "lat was called");
            equal(lngSpy.callCount, 1, "lng was called");
        });

        module("MapUtils - geocode tests");
        test("Should return the current location", function(assert) {
            // arrange
            var currentLocationSpy = this.spy();

            // act
            stubCurrentLocationSuccess(this);
            MapUtils.currentPosition().then(currentLocationSpy);

            // assert
            equal(currentLocationSpy.callCount, 1, "the current location got hit");
        });


        test("Should fail to return the current location", function(assert) {
            // arrange
            var currentLocationSpy = this.spy();

            // act
            stubCurrentLocationError(this);
            MapUtils.currentPosition().then(currentLocationSpy);

            // assert
            equal(currentLocationSpy.callCount, 0, "the current location not found");
        });

        test("Should successfully return a geocode postion", function(assert) {
            // Arrange
            var geocodeSpy = this.spy();

            // act
            stubGeoCodePositionSuccess(this);
            MapUtils.geocodePosition().done(geocodeSpy);

            // Assert
            equal(geocodeSpy.callCount, 1, "the geocode position found");
        });

        test("Should fails to return a geocode position", function(assert) {
            // Arrange
            var geocodeSpy = this.spy();

            // act
            stubGeoCodePositionError(this);
            MapUtils.geocodePosition().done(geocodeSpy);

            // Assert
            equal(geocodeSpy.callCount, 0, "the geocode wasnt position found");
        });

        test("Should perform a geocode search", function(assert) {
            // Arrange
            var sAddress = "Bondi Beach";
            stubGeoCodePositionSuccess(this);

            // Act
            return MapUtils.search({ "address": sAddress }).then(function(res) {
                // Assert
                equal(sAddress, res[0].formatted_address, "correct address returned");
            });
        });
    });