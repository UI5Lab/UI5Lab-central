/**
 * openui5-googlemaps - OpenUI5 Google Maps library
 * @version v1.0.4
 * @link http://jasper07.github.io/openui5-googlemaps/
 * @license MIT
 */
sap.ui.define(["jquery.sap.global"],function(i){"use strict";return function(){var e={};return e.notifyEvent="google.maps.loaded",e.isLoaded=new Promise(function(i){e.callBack=function(){this.loaded=!0,sap.ui.getCore().getEventBus().publish(this.notifyEvent),i()}}),e.loadFromMapsApi=function(e){if(void 0!==this.loaded)return void i.sap.log.warning("Can't load the Google Api scripts twice");this.loaded=!1,i.sap.includeScript(e.getLibraryURL(),"google.maps",null,null)},e}()},!0);