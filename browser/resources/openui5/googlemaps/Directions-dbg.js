/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/Control", "google.maps", "./TravelMode", "./UnitSystem"],
    function(jQuery, Control, gmaps, travelMode, unitSystem) {
        "use strict";

        var Directions = Control.extend("openui5.googlemaps.Directions", {
            metadata: {
                properties: {
                    "startAddress": {
                        type: "string",
                        bindable: "bindable"
                    },
                    "endAddress": {
                        type: "string",
                        bindable: "bindable"
                    },
                    "travelMode": {
                        type: "string",
                        defaultValue: travelMode.driving
                    },
                    "optimizeWaypoints": {
                        type: "boolean"
                    },
                    "unitSystem": {
                        type: "string",
                        defaultValue: unitSystem.metric
                    }
                },
                defaultAggregation: "waypoints",
                aggregations: {
                    "waypoints": {
                        type: "openui5.googlemaps.Waypoint",
                        multiple: true,
                        bindable: "bindable"
                    }
                },
                events: {
                    "response": {}
                },
                renderer: {}
            }
        });

        //inspired by Polymer google-map-directions

        Directions.prototype.setStartAddress = function(sValue) {
            this.setProperty("startAddress", sValue, true);
            this.route();
        };

        Directions.prototype.setEndAddress = function(sValue) {
            this.setProperty("endAddress", sValue, true);
            this.route();
        };

        Directions.prototype.setTravelMode = function(sValue) {
            this.setProperty("travelMode", sValue, true);
            this.route();
        };

        Directions.prototype.setOptimizeWaypoints = function(bValue) {
            this.setProperty("optimizeWaypoints", bValue, true);
            this.route();
        };

        Directions.prototype.getWaypointLocations = function() {
            var aLocation = [];
            this.getWaypoints().forEach(function(oWaypoint) {
                aLocation.push({
                    location: oWaypoint.getLocation(),
                    stopover: oWaypoint.getStopover()
                });
            });
            return aLocation;
        };

        Directions.prototype._mapRendered = function(map) {
            this.map = map;
            this.mapChanged();
        };

        Directions.prototype.responseChanged = function() {
            if (this.directions && this.response) {
                this.directions.setDirections(this.response);
            }
        };

        Directions.prototype.mapChanged = function() {
            if (!this.directions) {
                this.directions = new gmaps.DirectionsRenderer();
            }
            this.directions.setMap(this.map);
            this.route();

        };

        Directions.prototype.getRequest = function() {
            var request = {};
            request.origin = this.getStartAddress();
            request.destination = this.getEndAddress();
            request.travelMode = this.getTravelMode();
            request.unitSystem = this.getUnitSystem();
            request.optimizeWaypoints = this.getOptimizeWaypoints();
            request.waypoints = this.getWaypointLocations();
            return request;
        };

        Directions.prototype.route = function() {
            if (!this.map || !this.getStartAddress() || !this.getEndAddress()) {
                return;
            }

            if (!this.directionsService) {
                this.directionsService = new gmaps.DirectionsService();
            }

            jQuery.sap.clearDelayedCall(this.delayedCallId);
            this.delayedCallId = jQuery.sap.delayedCall(0, this, function() {
                this.directionsService.route(this.getRequest(), this.routeResponse.bind(this));
            });
        };

        Directions.prototype.routeResponse = function(response, status) {
            if (status === gmaps.DirectionsStatus.OK) {
                jQuery.sap.log.debug("Directions :: route response -" + response.toString(), this);
                this.response = response;
                this.responseChanged();

                this.fireResponse({
                    response: response
                });
            }
        };

        Directions.prototype.reset = function() {
            if (this.directions) {
                this.directions.setMap(null);
                this.directions = null;
            }
        };

        Directions.prototype.exit = function() {
            this.reset();
        };

        return Directions;

    }, /* bExport= */ true);
