/*global Parallax*/

sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Control',
	'openui5/parallax/thirdparty/parallax.min'
],
function($, Control, parallax) {
	"use strict";

	/* implementation of Parallax.js in UI5: see https://github.com/wagerfield/parallax for configuration options */
	return Control.extend("openui5.parallax.ParallaxScroller", {
		metadata : {
			properties: {

				/**
				 * Defines the horizontal movement speed, set to 0 to disable
				 */
				speedX: {type: "float", group: "Misc", defaultValue: 10},
				/**
				 * Defines the vertical movement speed, set to 0 to disable
				 */
				speedY: {type: "float", group: "Misc", defaultValue: 5},
				/**
				 * Enables vertical scrolling
				 */
				vertical: {type: "boolean", group: "Misc", defaultValue: true},
				/**
				 * Enables horizontal scrolling
				 */
				horizontal: {type: "boolean", group: "Misc", defaultValue: true},
				/**
				 * Inverts vertical scrolling
				 */
				invertVertical: {type: "boolean", group: "Misc", defaultValue: false},
				/**
				 * Enables horizontal scrolling
				 */
				invertHorizontal: {type: "boolean", group: "Misc", defaultValue: false}
			},
			defaultAggregation: "layers",
			aggregations : {
				/**
				 * Defines the layers of the parallax effect
				 */
				layers : {type : "openui5.parallax.ParallaxLayer", multiple : true, singularName : "layer", bindable : "bindable"}
			}
		},

		onAfterRendering: function () {
			var $this = this.$();

			// init parallax scene
			this._parallax = new Parallax($this[0], {
				relativeInput: true
			}); // good, we can store a pointer
			this._parallax.enable();
			this._parallax.scalarX = this.getSpeedX();
			this._parallax.scalarY = this.getSpeedY();
			this._parallax.limitX = !this.getHorizontal();
			this._parallax.limitY = !this.getVertical();
		},

		/**
		 * returns an instance of the Parallax.js object to do direct API operations
		 * @return {object} Parallax.js object for this scroller
		 */
		getParallaxInstance: function () {
			return this._parallax;
		},

		renderer: function (oRM, oControl) {
			var aLayers = oControl.getLayers();
			oRM.write("<div data-scalar-x='" + oControl.getSpeedX() + "' data-scalar-Y='" + oControl.getSpeedY() + "' data-limit-x='" + !oControl.getHorizontal() + "' data-limit-y='" + !oControl.getVertical() + "' ");
			oRM.writeControlData(oControl);
			oRM.addClass("openui5ParallaxScroller");
			oRM.addClass("scene");
			oRM.writeClasses();
			oRM.write(">");

			for (var i = 0; i < aLayers.length; i++) {
				oRM.renderControl(aLayers[i]);
			}

			oRM.write("</div>");
		}
	});

});
