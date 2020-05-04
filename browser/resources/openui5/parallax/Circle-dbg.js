/*!
 * ${copyright}
 */

// Provides control ui5lab.geometry.Square.
sap.ui.define(['jquery.sap.global', './library', 'ui5lab/geometry/Square'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new Circle control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Circles are squares with infinite angles so we extend a square and make it round.
	 * This control is to illustrate that in custom control libraries there can be inheritance as well.
	 * @extends ui5lab.geeometry.Square
	 *
	 * @public
	 * @alias ui5lab.geometry.Circle
	 */
	var oCircle = Control.extend("ui5lab.geometry.Circle", /** @lends ui5lab.geometry.Circle.prototype */ {
		library : "ui5lab.geometry",

		/**
		 * Control API
		 */
		// no surprises here, just the base parameters from the Square

		/**
		 * Lifecycle hook to initialize the control
		 */
		init: function () {
			// override size default
			this.setSize(300);
			this.setText("Circle");
		},

	});

	return oCircle;

});
