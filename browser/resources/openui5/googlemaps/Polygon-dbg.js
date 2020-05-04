/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "./MapUtils"],
    function(jQuery, Control, gmaps, utils) {
        "use strict";

        var Polygon = Control.extend("openui5.googlemaps.Polygon", {
            metadata: {
                properties: {
                    "strokeColor": {
                        type: "sap.ui.core.CSSColor",
                        group: "Appearance",
                        defaultValue: null
                    },
                    "strokeOpacity": {
                        type: "float",
                        bindable: "bindable"
                    },
                    "strokeWeight": {
                        type: "float",
                        bindable: "bindable"
                    },
                    "fillColor": {
                        type: "string",
                        bindable: "bindable"
                    },
                    "fillOpacity": {
                        type: "float",
                        bindable: "bindable"
                    },
                    "paths": {
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

        Polygon.prototype.setVisible = function(bValue) {
            this.setProperty("visible", bValue, true);
            if (this.polygon) {
                this.polygon.setVisible(this.getVisible());
            }
        };

        Polygon.prototype.parsePaths = function() {
            var aPaths = [];

            if (this.getPaths()) {
                this.getPaths().forEach(function(obj) {
                    aPaths.push(utils.objToLatLng(obj));
                });
            }
            return aPaths;
        };

        Polygon.prototype.createPolygon = function() {
            if (!this.polygon) {
                this.polygon = new gmaps.Polygon();
            }
            // this.polygon.setMap(this.map);
            // } else {
            this.polygon.setMap(this.map);
            this.polygon.setOptions(this.getOptions());
            // }
        };

        Polygon.prototype.getOptions = function() {
            var options = {};
            options.paths = this.parsePaths();
            options.strokeColor = this.getStrokeColor();
            options.strokeOpacity = this.getStrokeOpacity();
            options.strokeWeight = this.getStrokeWeight();
            options.fillOpacity = this.getFillOpacity();
            options.fillColor = this.getFillColor();
            options.visible = this.getVisible();
            options.draggable = this.getDraggable();
            return options;
        };

        Polygon.prototype._mapRendered = function(map) {
            this.map = map;
            this.createPolygon();
        };

        Polygon.prototype.reset = function() {
            this.map = undefined;
            if (this.polygon) {
                this.polygon.setMap(null);
            }
        };

        Polygon.prototype.exit = function() {
            this.reset();
        };

        return Polygon;

    }, /* bExport= */ true);
