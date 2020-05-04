/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "openui5/googlemaps/MapUtils", "./markerclusterer"],
    function(jQuery, Control, Gmaps, MapUtils, MarkerClusterer) {
        "use strict";

        MarkerClusterer = window.MarkerClusterer;

        var MarkerCluster = Control.extend("openui5.googlemaps.MarkerCluster", {
            metadata: {
                properties: {
                    "averageCenter": {
                        type: "boolean",
                        bindable: "bindable",
                        defaultValue: true
                    }
                },
                defaultAggregation: "markers",
                aggregations: {
                    "markers": {
                        type: "openui5.googlemaps.Marker",
                        multiple: true,
                        bindable: "bindable"
                    }
                },
                events: {
                    "clusteringend": {},
                    "click": {},
                    "mouseover": {},
                    "mouseout": {}
                },
                renderer: {}
            }
        });

        MarkerCluster.prototype.init = function() {
            this.aListeners = [];
        };

        MarkerCluster.prototype._mapRendered = function(map) {
            this.map = map;
            this.setClusterer();
        };

        MarkerCluster.prototype.onClusterClick = function(oCluster) {
            this.fireClick({
                cluster: oCluster
            });
        };

        MarkerCluster.prototype.onClusterMouseover = function(oCluster) {
            this.fireMouseover({
                cluster: oCluster
            });
        };

        MarkerCluster.prototype.onClusterMouseout = function(oCluster) {
            this.fireMouseout({
                cluster: oCluster
            });
        };

        MarkerCluster.prototype.onClusteringEnd = function() {
            this.fireClusteringend({
                clusters: this.markerClusterer.getClusters()
            });
        };

        MarkerCluster.prototype._getMarkers = function() {
            var that = this;
            var aMarkers = [];

            this.getMarkers().forEach(function(oMarker) {
                oMarker.setMarker();
                oMarker.setMap(that.map);
                aMarkers.push(oMarker.marker);
            });
            return aMarkers;
        };

        MarkerCluster.prototype.getOptions = function() {
            var sModulePath = jQuery.sap.getModulePath("openui5.googlemaps.themes." + "base" /**sap.ui.getCore().getConfiguration().getTheme()*/); 
            var sImagesPath = sModulePath + "/img";
            var options = {
                styles: [{
                    height: 53,
                    url: sImagesPath + "/m1.png",
                    width: 53
                }, {
                    height: 56,
                    url: sImagesPath + "/m2.png",
                    width: 56
                }, {
                    height: 66,
                    url: sImagesPath + "/m3.png",
                    width: 66
                }, {
                    height: 78,
                    url: sImagesPath + "/m4.png",
                    width: 78
                }, {
                    height: 90,
                    url: sImagesPath + "/m5.png",
                    width: 90
                }]

            };
            options.averageCenter = this.getAverageCenter();
            return options;
        }

        MarkerCluster.prototype.setClusterer = function() {
            this.markerClusterer = new MarkerClusterer(this.map, this._getMarkers(), this.getOptions());
            this.addListener("clusteringend", this.onClusteringEnd.bind(this));
            this.addListener("click", this.onClusterClick.bind(this));
            this.addListener("mouseover", this.onClusterMouseover.bind(this));
            this.addListener("mouseout", this.onClusterMouseout.bind(this));
        };

        MarkerCluster.prototype.addListener = function(sEvent, fnCallback) {
            this.aListeners.push(MapUtils.addListener(this.markerClusterer, sEvent, fnCallback));
        };

        MarkerCluster.prototype.removeListeners = function() {
            this.aListeners.forEach(function(oListener) {
                oListener.remove();
            });

            this.aListeners = [];
        };

        MarkerCluster.prototype.reset = function() {
            if (this.markerClusterer) {
                this.removeListeners();
                this.markerClusterer = undefined;
            }
        };

        MarkerCluster.prototype.exit = function() {
            this.reset();
        };

        return MarkerCluster;

    },
    /* bExport= */
    true);
