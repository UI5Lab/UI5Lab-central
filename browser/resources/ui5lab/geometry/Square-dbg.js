/*!
 * ${copyright}
 */

// Provides control ui5lab.geometry.Square.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new Square control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Squares are awesome geometrical shapes that are under-represented in today's modern UIs
	 * @extends sap.ui.core.Control
	 *
	 * @public
	 * @alias ui5lab.geometry.Square
	 */
	var oSquare = Control.extend("ui5lab.geometry.Square", /** @lends ui5lab.geometry.Square.prototype */ {
		/**
		 * Control API
		 */
		metadata: {
			library : "ui5lab.geometry",
			properties: {
				/**
				 * Sets the size (width/height) for the square
				 */
				size: {type: "int", defaultValue: 50},
				/**
				 * Sets the text inside the square
				 */
				text: {type: "string", defaultValue: ""},
				/**
				 * Sets a predefined shape for the square
				 */
				shape: {type: "ui5lab.geometry.ShapeType", defaultValue: "AngledCorners"},
			}
		},

		/**
		 * Lifecycle hook to initialize the control
		 */
		init: function () {
			// nothing yet
		},

	});

	return oSquare;

});
