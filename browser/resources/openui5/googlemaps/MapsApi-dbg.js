/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["sap/ui/base/ManagedObject", "google.maps"],
    function(ManagedObject, LoadScripts) {
        "use strict";

        var MapsApi = ManagedObject.extend("openui5.googlemaps.MapsApi", {

            constructor: function(sId, mSettings) {
                ManagedObject.apply(this, arguments);
            },

            metadata: {
                properties: {
                    /**
                     * Url for maps Api if not given defauls to  "(location protocol)//maps.googleapis.com/maps/api/js?"
                     */
                    mapsUrl: {
                        type: "string",
                        defaultValue: ""
                    },
                    /**
                     * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
                     */
                    apiKey: {
                        type: "string",
                        defaultValue: ""
                    },
                    /**
                     * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see developers.google.com/maps/documentation/business/.
                     * If set, a Client ID will take precedence over an API Key.
                     */
                    clientId: {
                        type: "string",
                        defaultValue: ""
                    },
                    /**
                     * Version of the Maps API to use.
                     */
                    version: {
                        type: "string",
                        defaultValue: "3.exp"
                    },
                    /**
                     * The localized language to load the Maps API with. For more information
                     * see https://developers.google.com/maps/documentation/javascript/basics#Language
                     *
                     * Note: the Maps API defaults to the preffered language setting of the browser.
                     * Use this parameter to override that behavior.
                     */
                    language: {
                        type: "string",
                        defaultValue: ""
                    },
                    /**
                     * If true, sign-in is enabled.
                     * See https://developers.google.com/maps/documentation/javascript/signedin#enable_sign_in
                     */
                    signedIn: {
                        type: "boolean",
                        defaultValue: false
                    }
                }
            },

            getLibraryURL: function() {
                var sMapsUrl = this.getMapsUrl();

                if (!sMapsUrl) {
                    sMapsUrl = location.protocol.replace("file", "https") + "//maps.google.com/maps/api/js?";
                }

                if (!jQuery.sap.endsWith(sMapsUrl, "?")) {
                    sMapsUrl += "?";
                }

                var sUrl = sMapsUrl + "&v=" + this.getVersion();

                // Always load all Maps API libraries.
                sUrl += "&libraries=drawing,geometry,places,visualization";

                // Always add callback
                sUrl += "&callback=google.maps.callBack";

                if (this.getApiKey() && !this.getClientId()) {
                    sUrl += "&key=" + this.getApiKey();
                }

                if (this.getClientId()) {
                    sUrl += "&client=" + this.getClientId();
                }
                // Log a warning if the user is not using an API Key or Client ID.
                if (!this.getApiKey() && !this.getClientId()) {
                    var warning = "No Google Maps API Key or Client ID specified. " +
                        "See https://developers.google.com/maps/documentation/javascript/get-api-key " +
                        "for instructions to get started with a key or client id.";
                    jQuery.sap.log.warning(warning);
                }



                if (this.getLanguage()) {
                    sUrl += "&language=" + this.getLanguage();
                }
                if (this.getSignedIn()) {
                    sUrl += "&signed_in=" + this.getSignedIn();
                }
                return sUrl;
            },

            load: function() {
                LoadScripts.loadFromMapsApi(this);
            }
        });

        return MapsApi;

    }, /* bExport = */ true);
