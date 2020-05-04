/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "./MapUtils"],
    function(jQuery, Control, gmaps, utils) {
        "use strict";

        var Polyline = Control.extend("openui5.googlemaps.Polyline", {
            metadata: {
                properties: {
                    "strokeColor": {
                        type: "sap.ui.core.CSSColor",
                        group: "Appearance",
                        defaultValue: null
                    },
                    "strokeOpacity": {
                        type: "float"
                    },
                    "strokeWeight": {
                        type: "float"
                    },
                    "icons": {
                        type: "object"
                    },
                    "path": {
                        type: "object",
                        bindable: "bindable"
                    },
                    "visible": {
                        type: "boolean",
                        bindable: "bindable",
                        defaultValue: true
                    },
                    "draggable": {
                        type: "boolean"
                    }
                },
                renderer: {}
            }
        });

        Polyline.prototype.setVisible = function(bValue) {
            this.setProperty("visible", bValue, true);
            if (this.polyline) {
                this.polyline.setVisible(this.getVisible());
            }
        };

        Polyline.prototype.parsePath = function() {
            var aPath = [];

            if (this.getPath()) {
                this.getPath().forEach(function(obj) {
                    aPath.push(utils.objToLatLng(obj));
                });
            }
            return aPath;
        };

        Polyline.prototype.createPolyline = function() {
            if (!this.polyline) {
                this.polyline = new gmaps.Polyline();
            }
            this.polyline.setMap(this.map);
            this.polyline.setOptions(this.getOptions());
        };

        Polyline.prototype.getOptions = function() {
            var options = {};
            options.path = this.parsePath();
            options.strokeColor = this.getStrokeColor();
            options.strokeOpacity = this.getStrokeOpacity();
            options.strokeWeight = this.getStrokeWeight();
            options.visible = this.getVisible();
            options.draggable = this.getDraggable();

            options.icons = this.getIcons();
            return options;
        };

        Polyline.prototype._mapRendered = function(map) {
            this.map = map;
            this.createPolyline();
        };

        Polyline.prototype.reset = function() {
            this.map = undefined;
            if (this.polyline) {
                this.polyline.setMap(null);
            }
        };

        Polyline.prototype.exit = function() {
            this.reset();
        };

        return Polyline;

    }, /* bExport= */ true);
