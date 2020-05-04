/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global", "google.maps"],
    function(jQuery, gmaps) {
        "use strict";

        var MapUtils = {};

        
        /**
        * Get google maps LatLng object
        * @param {Object}  oValue value
        * @returns {google.maps.LatLng} return
        */
        MapUtils.objToLatLng = function(oValue) {
            return new gmaps.LatLng(oValue.lat, oValue.lng);
        };


        /**
         * Get object with lng lat from google maps LatLng object
         * @param {google.maps.LatLng} oValue value
         * @returns {object} return
         */
        MapUtils.latLngToObj = function(oValue) {
            return {
                lat: oValue.lat(),
                lng: oValue.lng()
            };
        };

        /**
         * Comapre 2 floats for near equality
         * @param {Float} nVal1  value 1
         * @param {Float} nVal2 value 2
         * @returns {boolean} return 
         */
        MapUtils.floatEqual = function(nVal1, nVal2) {
            return Math.abs(nVal1 - nVal2) < 0.000001;
        };

        /**
         * Comapre 2 objects for equality based on lat lng
         * @param {object} oValue1 value 1
         * @param {object} oValue2 value 2
         * @returns {boolean} return
         */
        MapUtils.latLngEqual = function(oValue1, oValue2) {
            return this.floatEqual(oValue1.lat, oValue2.lat) && this.floatEqual(oValue1.lng, oValue2.lng);
        };

        /**
         * Get search results for geocode request
         * @param {Object} oRequest request
         * @returns {jQuery.Promise} promise
         */
        MapUtils.search = function(oRequest) {
            var deferred = jQuery.Deferred();
            gmaps.isLoaded.then(function(){
                new gmaps.Geocoder().geocode(oRequest, deferred.resolve);
            }); 
            return deferred.promise();
        };

        /**
         * Get Current Position
         * @returns {jQuery.Promise} promise
         */
        MapUtils.currentPosition = function() {
            var deferred = jQuery.Deferred();
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0 
            };

            var success = function(oPosition) {
                var position = {};
                position.lat = oPosition.coords.latitude;
                position.lng = oPosition.coords.longitude;
                deferred.resolve(position);
            };

            var error = function(err) {
                jQuery.sap.log.info("ERROR(" + err.code + "): " + err.message);
                deferred.reject(err);
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error, options);
            }
            return deferred.promise();
        };

        /**
         * trigger map event
         * @param  {Element} oElement   element to bind event to 
         * @param  {String} sEvent     event name
         * @param  {Object} oArguments arguments to pass to event
         */
        MapUtils.trigger = function(oElement, sEvent, oArguments) {
            gmaps.event.trigger(oElement, sEvent, oArguments);
        };

        /**
         * add listener to map event
         * @param  {Element} oElement   element to bind event to 
         * @param  {String} sEvent     event name
         * @param {Function} fnCallBack callback
         * @returns {type} description
         */
        MapUtils.addListener = function(oElement, sEvent, fnCallBack) {
           return gmaps.event.addListener(oElement, sEvent, fnCallBack);
        };


        /**
         * Get Current Position
         * @param {Object} oPosition position
         * @returns {jQuery.Promise} promise
         */
        MapUtils.geocodePosition = function(oPosition) {
            var deferred = jQuery.Deferred();

            var responses = function(results) {
                if (results && results.length > 0) {
                    deferred.resolve(results[0].formatted_address);
                } else {
                    deferred.reject("Cannot determine address at this location.");
                }
            };

            new gmaps.Geocoder().geocode({
                latLng: oPosition
            }, responses);

            return deferred.promise();
        };

        return MapUtils;
    }, true);
