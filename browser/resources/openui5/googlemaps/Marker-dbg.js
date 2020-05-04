/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "openui5/googlemaps/MapUtils", "./Animation"],
    function(jQuery, Control, Gmaps, MapUtils, Animation) {
        "use strict";

        var Marker = Control.extend("openui5.googlemaps.Marker", {
            metadata: {
                properties: {
                    "lat": {
                        type: "float",
                        bindable: "bindable"
                    },
                    "lng": {
                        type: "float",
                        bindable: "bindable"
                    },
                    "draggable": {
                        type: "boolean",
                        bindable: "bindable",
                        defaultValue: false
                    },
                    "info": {
                        type: "string",
                        bindable: "bindable"
                    },
                    "icon": {
                        type: "any",
                        bindable: "bindable"
                    },
                    "visible": {
                        type: "boolean",
                        bindable: "bindable",
                        defaultValue: true
                    },
                    "animation": {
                        type: "int",
                        bindable: "bindable",
                        defaultValue: Animation.DROP
                    },
                     "zIndex": {
                        type: "int",
                        defaultValue: 1
                    },
                    "optimized": {
                        type: "boolean",
                        bindable: "bindable",
                        defaultValue: false  
                    }
                },
                events: {
                    "click": {},
                    "dragEnd": {},
                    "infoWindowClose": {},
                    "mouseover": {},
                    "mouseout": {}
                },
                renderer: {}
            }
        });

        Marker.prototype.init = function() {
            this._dragging = false;
            this.aListeners = [];
            this.iwMaxWidth = 360;
        };

        Marker.prototype.updatePosition = function() {
            if (!this.marker || this.getLat() === null || this.getLng() === null) {
                return;
            }

            jQuery.sap.clearDelayedCall(this.delayedCallId);
            this.delayedCallId = jQuery.sap.delayedCall(0, this, function() {
                this.marker.setPosition(new Gmaps.LatLng(this.getLat(), this.getLng()));
            });
        };

        Marker.prototype.setLat = function(oValue) {
            this.setProperty("lat", parseFloat(oValue), true);
            this.updatePosition();
        };

        Marker.prototype.setLng = function(oValue) {
            this.setProperty("lng", parseFloat(oValue), true);
            this.updatePosition();
        };

        Marker.prototype.setVisible = function(bValue) {
            this.setProperty("visible", bValue, true);
            if (this.marker) {
                this.marker.setVisible(this.getVisible());
            }
        };

        Marker.prototype.setIcon = function(oValue) {
            this.setProperty("icon", oValue, true);
            if (this.marker) {
                this.marker.setIcon(this.getIcon());
            }
        };

        Marker.prototype.getMap = function() {
            return this.map;
        };

        Marker.prototype.setMap = function(map) {
            this.map = map;
        };

        Marker.prototype.createMarker = function() {
            return new Gmaps.Marker(this.getOptions());
        };

        Marker.prototype.setMarker = function() {
            if (!this.marker) {
                this.marker = this.createMarker();
                this.addListener(this.marker, "click", this.onClick.bind(this));
                this.addListener(this.marker, "mouseover", this.onMouseover.bind(this));
                this.addListener(this.marker, "mouseout", this.onMouseout.bind(this));
            }
            if (this.getDraggable()) {
                this.addListener(this.marker, "dragend", this.onDragEnd.bind(this));
            }

            this.marker.setMap(this.map);
            this.marker.setOptions(this.getOptions());
            
            if (typeof this.marker.setZIndex === "function") { //Maker.prorotype.setZIndex only exists in api v3 and above
                this.marker.setZIndex(this.getZIndex());
            }

            if (!this.infoWindow) {
                //http://stackoverflow.com/questions/1554893/google-maps-api-v3-infowindow-not-sizing-correctly
                this.infoWindow = new Gmaps.InfoWindow({
                    maxWidth: this.iwMaxWidth
                });
                this.addListener(this.infoWindow, "closeclick", this.onInfoWindowClose.bind(this));
            }
            this.infoWindow.setContent(this.getInfo());

        };

        Marker.prototype.getOptions = function() {
            var options = {};
            options.position = new Gmaps.LatLng(this.getLat(), this.getLng());
            options.draggable = this.getDraggable();
            options.animation = this.getAnimation();
            options.visible = this.getVisible();
            options.icon = this.getIcon();
            options.optimized = this.getOptimized()
            return options;
        };

        Marker.prototype._mapRendered = function(map) {
            this.setMap(map);
            this.setMarker();
        };

        Marker.prototype.addListener = function(oElement, sEvent, fnCallback) {
            this.aListeners.push(MapUtils.addListener(oElement, sEvent, fnCallback));
        };

        Marker.prototype.removeListeners = function() {
            this.aListeners.forEach(function(oListener) {
                oListener.remove();
            });

            this.aListeners = [];
        };

        Marker.prototype.infoWindowOpen = function() {
            this.infoWindow.open(this.map, this.marker);
        };

        Marker.prototype.infoWindowClose = function() {
            this.infoWindow.close();
        };

        Marker.prototype.onClick = function() {
            if (this.infoWindow) {
                this.infoWindowOpen();
            }

            this.fireClick({
                map: this.map,
                marker: this.marker,
                context: this.getBindingContext(),
                location: {
                    lat: this.getLat(),
                    lng: this.getLng()
                }
            });
        };

        Marker.prototype.onMouseover = function() { 
            this.fireMouseover({
                map: this.map,
                marker: this.marker,
                context: this.getBindingContext(),
                location: {
                    lat: this.getLat(),
                    lng: this.getLng()
                }
            });
        };

        Marker.prototype.onMouseout = function() {
            this.fireMouseout({
                map: this.map,
                marker: this.marker,
                context: this.getBindingContext(),
                location: {
                    lat: this.getLat(),
                    lng: this.getLng()
                }
            });
        };

        Marker.prototype.onDragEnd = function() {
            var oPosition = this.marker.getPosition();

            this.setLat(oPosition.lat());
            this.setLng(oPosition.lng());

            this.fireDragEnd({
                position: oPosition
            });
        };

        Marker.prototype.onInfoWindowClose = function() {
            this.fireInfoWindowClose({});
            this.infoWindowClose();
        };

        Marker.prototype.reset = function() {
            this.map = undefined;
            if (this.marker) {
                this.removeListeners();
                this.marker.setMap(null);
            }
        };

        Marker.prototype.exit = function() {
            this.reset();
        };

        return Marker;

    }, /* bExport= */ true);
