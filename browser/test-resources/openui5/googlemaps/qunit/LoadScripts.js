sap.ui.define(
    [
        "openui5/googlemaps/loadScripts", "openui5/googlemaps/MapsApi"
    ],
    function(LoadScripts, MapsApi) {
        "use strict";
        module("LoadScripts");

        test("Should fake loading the google Api scripts", function(assert) {
            // arrange
            this.stub(google.maps, "loaded", undefined);
            var loadScriptsSpy = this.spy();
            this.stub(jQuery.sap, "includeScript", loadScriptsSpy);

            // act
            LoadScripts.loadFromMapsApi(new MapsApi());

            // assert
            equal(loadScriptsSpy.callCount, 1, "include script called");
        });

        test("Should ensure the google Api cannot be loaded twice", function(assert) {
            // arrange
            LoadScripts.loaded = true;
            // this.stub(LoadScripts, "loaded", true);

            //warning stub
            var iWarningCount = 0,
                sMessage = "";

            this.stub(jQuery.sap.log, "warning", function(sMsg) {
                iWarningCount++;
                sMessage = sMsg;
            });

            // act
            LoadScripts.loadFromMapsApi(new MapsApi());

            // assert
            equal(iWarningCount, 1, "warning hit once");
            equal(sMessage, "Can't load the Google Api scripts twice", "correct warning");
        });

        test("Should trigger notify callback after API loaded", function(assert) {
            // arrange

            // stub out the event name in case others controls still listening
            this.stub(LoadScripts, "notifyEvent", "test");

            var loadedEventSpy = this.spy();
            sap.ui.getCore().getEventBus().subscribe(LoadScripts.notifyEvent, loadedEventSpy, this);

            // act
            LoadScripts.callBack();

            // assert
            equal(loadedEventSpy.callCount, 1, "loaded event called");
        });
    });
