sap.ui.define(
    [
        "openui5/googlemaps/MapsApi"
    ],
    function(MapsApi) {
        "use strict";

        var oConfig = {
            url: location.protocol + "//maps.google.cn/maps/api/js",
            key: "AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM",
            version: "3.20",
            language: "zh-CN",
            clientId: "123ABC",
            signedIn: true,
            expectedUrl: location.protocol + "//maps.google.cn/maps/api/js?&v=3.20&libraries=drawing,geometry,places,visualization&callback=google.maps.callBack&client=123ABC&language=zh-CN&signed_in=true"
        };

        var sDefaultUrl = location.protocol + "//maps.google.com/maps/api/js?&v=3.exp&libraries=drawing,geometry,places,visualization&callback=google.maps.callBack";


        module("MapsApi");
        test("Should return the default API url ", function(assert) {
            // arrange
            var oMapsApi = new MapsApi({});

            // act
            var sUrl = oMapsApi.getLibraryURL();

            // assert
            equal(sUrl, sDefaultUrl, "the default api url");

            oMapsApi.destroy();
        });

        test("Should include properties in API url", function(assert) {
            // arrange
            var oMapsApi = new MapsApi({
                mapsUrl: oConfig.url,
                apiKey: oConfig.key,
                version: oConfig.version,
                language: oConfig.language,
                clientId: oConfig.clientId,
                signedIn: oConfig.signedIn
            });

            // act
            var sUrl = oMapsApi.getLibraryURL();

            // assert
            equal(sUrl, oConfig.expectedUrl, "the change api url matches");

            oMapsApi.destroy();
        });
    });
