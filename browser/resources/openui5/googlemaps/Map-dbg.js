/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "sap/ui/core/ResizeHandler", "google.maps", "./MapsApi", "./MapUtils", "./MapTypeId"],
    function(jQuery, Control, ResizeHandler, Gmaps, MapsApi, MapUtils, MapTypeId) {
        "use strict";
        /* eslint no-extend-native:0 */
        var Map = Control.extend("openui5.googlemaps.Map", {
            metadata: {
                properties: {
                    /**
                     * A latitude to center the map on.
                     */
                    lat: {
                        type: "float",
                        bindable: "bindable",
                        defaultValue: 1
                    },
                    /**
                     * A longitude to center the map on.
                     */
                    lng: {
                        type: "float",
                        bindable: "bindable",
                        defaultValue: 1
                    },

                    /**
                     * sets the width of the map control
                     */
                    width: {
                        type: "sap.ui.core.CSSSize",
                        group: "Dimension",
                        defaultValue: "auto"
                    },

                    /**
                     * sets the height of the map control
                     */
                    height: {
                        type: "sap.ui.core.CSSSize",
                        group: "Dimension",
                        defaultValue: "20em"
                    },

                    /**
                     * A zoom level to set the map to.
                     */
                    zoom: {
                        type: "int",
                        defaultValue: 8
                    },

                    /**
                     * If set, removes the map's default UI controls.
                     */
                    disableDefaultUI: {
                        type: "boolean",
                        defaultValue: true
                    },
                    /**
                     * Map type to display. One of 'roadmap', 'satellite', 'hybrid', 'terrain'.
                     */
                    mapTypeId: {
                        type: "string",
                        defaultValue: MapTypeId.ROADMAP
                    },

                    /**
                     * If set, adds the map's 'pan' UI control.
                     */
                    panControl: {
                        type: "boolean",
                        defaultValue: false
                    },

                    /**
                     * If true, prevent the user from zooming the map interactively.
                     */
                    zoomControl: {
                        type: "boolean",
                        defaultValue: false
                    },

                    /**
                     * If set, adds allows the user to change map type.
                     */
                    mapTypeControl: {
                        type: "boolean",
                        defaultValue: false
                    },

                    /**
                     * If set, adds the map's 'street view' UI controls.
                     */
                    streetViewControl: {
                        type: "boolean",
                        defaultValue: false
                    },

                    /**
                     * If set, the zoom level is set such that all markers are brought into view.
                     */
                    fitToMarkers: {
                        type: "boolean",
                        defaultValue: false
                    },
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
                },
                defaultAggregation: "markers",
                aggregations: {
                    /**
                     * The markers on the map.
                     */
                    "markers": {
                        type: "openui5.googlemaps.Marker",
                        multiple: true,
                        bindable: "bindable"
                    },
                    /**
                     * The polylines on the map.
                     */
                    "polylines": {
                        type: "openui5.googlemaps.Polyline",
                        multiple: true,
                        bindable: "bindable"
                    },
                    /**
                     * The polygons on the map.
                     */
                    "polygons": {
                        type: "openui5.googlemaps.Polygon",
                        multiple: true,
                        bindable: "bindable"
                    },

                    /**
                     * The directions on the map.
                     */
                    "directions": {
                        type: "openui5.googlemaps.Directions",
                        multiple: false,
                        bindable: "bindable"
                    },

                    /**
                     * The marker cluster on the map.
                     */
                    "markerCluster": {
                        type: "openui5.googlemaps.MarkerCluster",
                        multiple: false,
                        bindable: "bindable"
                    }
                },
                events: {
                    /**
                     * The map ready event
                     */
                    "ready": {},
                    /**
                     * The map clicked event
                     */
                    "click": {}
                }
            },
            renderer: function(oRm, oControl) {
                oRm.write("<div ");
                oRm.writeControlData(oControl);
                oRm.addStyle("width", "auto");
                oRm.addStyle("height", "auto");
                oRm.writeClasses();
                oRm.writeStyles();
                oRm.write(">");
                oRm.renderControl(oControl._html);
                oRm.write("</div>");
            }
        });

        Map.prototype.init = function() {
            this._dragging = false;
            this.aListeners = [];
            this.mapId = this.getId() + "-map";
            this._html = new sap.ui.core.HTML({
                content: "<div style='height: " + this.getHeight() + ";width: " + this.getWidth() + ";' id='" + this.mapId + "'></div>"
            });

        };

        Map.prototype.onBeforeRendering = function() {
            // if the google maps api is not already loaded trigger it here
            if (Gmaps.loaded === undefined && this._oMapsApi === undefined) {
                this._oMapsApi = new MapsApi({
                    mapsUrl: this.getMapsUrl(),
                    apiKey: this.getApiKey(),
                    clientId: this.getClientId(),
                    version: this.getVersion(),
                    language: this.getLanguage(),
                    signedIn: this.getSignedIn()
                });

                this._oMapsApi.load();
            }
        };

        Map.prototype.setHeight = function(sValue) {
            this.setProperty("height", sValue, true);
            this.setSize();

            return this;
        };

        Map.prototype.setWidth = function(sValue) {
            this.setProperty("width", sValue, true);
            this.setSize();

            return this;
        };

        Map.prototype.setSize = function() {
            if (!jQuery.sap.domById(this.mapId)) {
                var content = jQuery(this._html.getContent());
                content.css("height", this.getHeight()).css("width", this.getWidth());
                this._html.setContent(content.outerHTML());
            } else {
                jQuery.sap.byId(this.mapId).css("height", this.getHeight()).css("width", this.getWidth());
            }

            return this;
        };

        Map.prototype.setZoom = function(iValue) {
            this.setProperty("zoom", iValue, true);
            if (this.map && iValue !== this.map.getZoom()) {
                this.map.setZoom(iValue);
            }

            return this;
        };

        Map.prototype.setLat = function(oValue) {
            var val = parseFloat(oValue);
            if (!MapUtils.floatEqual(val, this.getLat())) {
                this.setProperty("lat", val, true);
                this._updateCenter();
            }

            return this;
        };

        Map.prototype.setLng = function(oValue) {
            var val = parseFloat(oValue);
            if (!MapUtils.floatEqual(val, this.getLng())) {
                this.setProperty("lng", val, true);
                this._updateCenter();
            }

            return this;
        };


        Map.prototype.setFitToMarkers = function(bValue) {
            this.setProperty("fitToMarkers", bValue, true);
            this._fitToMarkers();

            return this;
        };

        Map.prototype._updateCenter = function() {
            if (!this.map || this.getLat() === null || this.getLng() === null) {
                return;
            }

            // delay if lat and lng updated through binding
            jQuery.sap.clearDelayedCall(this.delayedCallId);
            this.delayedCallId = jQuery.sap.delayedCall(0, this, function() {
                this.map.setCenter(new Gmaps.LatLng(this.getLat(), this.getLng()));
                this.notifyAggregations("mapRendered");
            });
        };

        Map.prototype.setMapTypeId = function(sValue) {
            this.setProperty("mapTypeId", sValue, true);
            if (this.map && sValue !== this.map.getMapTypeId()) {
                this.map.setMapTypeId(sValue);
            }

            return this;
        };

        Map.prototype.setZoomControl = function(bValue) {
            this.setProperty("zoomControl", bValue, true);
            if (this.map && bValue !== this.map.zoomControl) {
                this.map.zoomControl = bValue;
            }

            return this;
        };

        Map.prototype.setDisableDefaultUI = function(bValue) {
            this.setProperty("disableDefaultUI", bValue, true);
            if (this.map) {
                this.map.setOptions({
                    disableDefaultUI: this.getDisableDefaultUI()
                });
            }
            return this;
        };

        Map.prototype.zoomChanged = function() {
            if (this.map.getZoom() !== this.getZoom()) {
                this.setZoom(this.map.getZoom());
            }
        };

        Map.prototype.mapTypeIdChanged = function() {
            if (this.map.getMapTypeId() !== this.getMapTypeId()) {
                this.setMapTypeId(this.map.getMapTypeId());
            }
        };

        Map.prototype.onResize = function() {
            var oCenter = this.map.getCenter();
            this.trigger("resize");
            this.map.setCenter(oCenter);
        };

        Map.prototype._getMapOptions = function() {
            var mapOptions = {};
            mapOptions.zoom = this.getZoom();
            mapOptions.center = new Gmaps.LatLng(this.getLat(), this.getLng());
            mapOptions.disableDefaultUI = this.getDisableDefaultUI();
            mapOptions.mapTypeId = this.getMapTypeId();
            mapOptions.panControl = this.getPanControl();
            mapOptions.zoomControl = this.getZoomControl();
            mapOptions.mapTypeControl = this.getMapTypeControl();
            mapOptions.streetViewControl = this.getStreetViewControl();
            return mapOptions;
        };

        Map.prototype.notifyAggregations = function(sEvent) {
            // notify markers, polylines and poloygons
            var oAggregations = this.getMetadata().getAggregations();
            var aAggregations = Object.keys(oAggregations).map(function(sKey){ return oAggregations[sKey];});
            var oMap = this.map;
            var fnNotify = function(oElement){
                // eg marker._mapRendered(map)
                oElement["_" + sEvent](oMap);
            };

            aAggregations.forEach(function(oAggregation){
                 var oValue = this[oAggregation._sGetter]();
                 if (oValue){
                    if (oAggregation.multiple === true){
                        oValue.forEach(fnNotify); 
                    } else {
                        fnNotify(oValue);
                    }  
                } 
            }.bind(this));
        };

        Map.prototype.onAfterRendering = function() {
            //if map not loaded yet subscribe to its event
            if (!Gmaps.loaded) {
                if (this.subscribed === undefined) {
                    sap.ui.getCore().getEventBus().subscribe(Gmaps.notifyEvent, this.createMap, this);
                    this.subscribed = true;
                }
                return;
            }

            if (!this.initialized) {
                this.createMap();
            } else {
                this._updateCenter();
            }
        };

        Map.prototype.createMap = function() {
            if (!this.getLat() || !this.getLng()) {
                return;
            }

            //  create map
            this.map = new Gmaps.Map(jQuery.sap.domById(this.mapId), this._getMapOptions());

            this.notifyAggregations("mapRendered");

            // set up listeners
            this.addListener("drag", this.isDragging.bind(this));
            this.addListener("dragstart", this.isDragging.bind(this));
            this.addListener("zoom_changed", this.zoomChanged.bind(this));
            this.addListener("idle", this.mapChanged.bind(this));
            this.addListener("maptypeid_changed", this.mapTypeIdChanged.bind(this));
            this.addListener("click", this.clicked.bind(this));

            this.resizeID = ResizeHandler.register(jQuery.sap.domById(this.mapId), this.onResize.bind(this));

            this._fitToMarkers();

            this.initialized = true;
        };

        Map.prototype.addListener = function(sEvent, fnCallback) {
            this.aListeners.push(MapUtils.addListener(this.map, sEvent, fnCallback));
        };

        Map.prototype.removeListeners = function() {
            this.aListeners.forEach(function(oListener) {
                oListener.remove();
            });
            this.aListeners = [];
        };

        Map.prototype.trigger = function(sEvent, oArguments) {
            Gmaps.event.trigger(this.map, sEvent, oArguments);
        };

        Map.prototype.isDragging = function() {
            this._dragging = true;
        };

        Map.prototype.isNotDragging = function() {
            this._dragging = false;
        };

        Map.prototype.mapChanged = function() {
            if (this._dragging) {
                this.isNotDragging();
            }

            this.fireReady({
                map: this.map,
                context: this.getBindingContext(),
                lat: this.getLat(),
                lng: this.getLng()
            });
        };

        Map.prototype._fitToMarkers = function() {
            if (this.map && this.getFitToMarkers() && this.getMarkers().length > 0) {
                var oLatLngBounds = new Gmaps.LatLngBounds();

                this.getMarkers().forEach(function(oMarker) {
                    oLatLngBounds.extend(oMarker.marker.getPosition());
                });

                // For one marker, don't alter zoom, just center it.
                if (this.getMarkers().length > 1) {
                    this.map.fitBounds(oLatLngBounds);
                }
            }
        };

        Map.prototype.resetMap = function() {
            this.removeListeners();
            if (this.map) {
                this.map.set(null);
            }
        };

        Map.prototype.exit = function() {
            this.resetMap();
            ResizeHandler.deregister(this.resizeID);
        };

        Map.prototype.clicked = function(oEvent) {
            this.fireClick({
                map: this.map,
                context: this.getBindingContext(),
                lat: oEvent.latLng.lat(),
                lng: oEvent.latLng.lng()
            });
        };

        return Map;

    }, /* bExport= */ true);
