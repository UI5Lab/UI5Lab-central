/*!
 * ${copyright}
 */

// Provides control ui5lab.geometry.Triangle.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new Triangle control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Triangles are lacking one angle to make them a square, and that makes them special!
	 * This control is to illustrate more complex control API with events and user interaction.
	 * @extends sap.ui.core.Control
	 *
	 * @public
	 * @alias ui5lab.geometry.Triangle
	 */
	var oTriangle = Control.extend("ui5lab.geometry.Triangle", /** @lends ui5lab.geometry.Triangle.prototype */ {
		/**
		 * Control API
		 */
		metadata: {
			library : "ui5lab.geometry",
			properties: {
				/**
				 * Sets the size (width/height) for the Triangle
				 */
				size: {type: "int", defaultValue: 300},
				/**
				 * Sets the Triangles rotation in degrees
				 */
				rotation: {type: "int", defaultValue: 0},
				/**
				 * Sets the text inside the Triangle
				 */
				text: {type: "string", defaultValue: ""}
			},
			aggregations : {
				/**
				 * An internal control displaying the current rotation
				 */
				_rotationLabel: {type: "sap.m.Label"},
			},
			events : {
				/**
				 * Fires when the triangle is pressed.
				 */
				press: {
					parameters: {
						/**
						 * The rotation in degrees
						 */
						rotation: {type: "int"}
					}
				}
			}
		},

		/**
		 * Lifecycle hook to initialize the control
		 */
		init: function () {
			// nothing
		},

		/**
		 * Lifecycle hook called after the control is rendered to disable the context menu
		 */
		onAfterRendering: function () {
			this.$().bind('contextmenu', function(oEvent) {
				return false;
			});
		},

		/**
		 * Sets the Triangle rotation in degrees without rerendering
		 * @override
		 * @param {int} iValue Rotation in degrees
		 */
		setRotation: function (iValue) {
			// limit to 360
			try {
				iValue = iValue % 360;
			} catch (oException) {
				// nothing
			}
			// validate and save value without rerendering
			this.setProperty("rotation", iValue, true);
			iValue = this.getProperty("rotation");
			// update dom manually
			this.$().css("transform", "rotate(" + iValue + "deg)");
			this.$("rotation").text(iValue + "°");
		},

		/**
		 * Rotates the Triangle with the onmousedown event
		 * @param {jQuery.Event} oEvent The browser event
		 * @private
		 */
		onmousedown: function(oEvent) {
			// set a modified based on the mouse key
			switch (oEvent.which) {
				case 2: this._bRotationModifier = 2; break; // full speed
				case 3: this._bRotationModifier = -1; break; // reverse
				case 1:
				default:
					this._bRotationModifier = 1; break; // normal speed
			}
			this._rotationInterval = setInterval(function () {
				this.setRotation(this.getRotation() + this._bRotationModifier);
			}.bind(this), 10);
		},

		/**
		 * Stops the rotation and fires the press event with the onmouseup event
		 * @param {jQuery.Event} oEvent The browser event
		 * @private
		 */
		onmouseup: function(oEvent) {
			clearInterval(this._rotationInterval);
			this.firePress({
				rotation: this.getRotation()
			});
		},

		/**
		 * Increase by 15 degrees on sap pseudo increase event (Arrow keys and + key)
		 * @private
		 */
		onsapincrease: function() {
			this.setRotation(this.getRotation() + 15);
		},

		/**
		 * Decrease by 15 degrees on sap pseudo decrease event (Arrow keys and - key)
		 * @private
		 */
		onsapdecrease: function() {
			this.setRotation(this.getRotation() - 15);
		}
	});

	return oTriangle;

});
