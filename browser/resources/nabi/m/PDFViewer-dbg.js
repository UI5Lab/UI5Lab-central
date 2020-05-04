/*!
 * ${copyright}
 */

sap.ui.define([
	"jquery.sap.global",
	"./library",
	"sap/ui/core/Control"
], function(jQuery, library, Control) {
	"use strict";

	/**
	 * Constructor for a new PDFViewer control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control allows to display PDF files on any device.
	 * @extends sap.ui.core.Control
	 *
	 * @public
	 * @alias nabi.m.PDFViewer
	 */
	var PDFViewer = Control.extend("nabi.m.PDFViewer", /** @lends sap.m.PDFViewer.prototype */ {
		/**
		 * Control API
		 */
		metadata : {

			library : "nabi.m",

			properties : {
				/**
				 * Defines the height of the PDF viewer control, respective to the height of
				 * the parent container.
				 */
				 height: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%"},
				 /**
				  * Defines the width of the PDF viewer control, respective to the width of the
				  * parent container.
				  */
				 width: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%"},
				 /**
				  * Specifies the path to the PDF file to display. Can be set to a relative or
				  * an absolute path. Loading of the PDF file might fail in case the same origin policy
				  * of the browser is violated. For security reasons per default only "remote" PDF files
				  * are rejected and thus also fail to be loaded. This might change in future.
				  */
				 source: {type: "sap.ui.core.URI", group: "Misc", defaultValue: null}
			},

			aggregations: { },

			events: { }
		},

		init: function () { }

	});

	/**
	 * Sets the width of the PDFViewer.
	 * @param {sap.ui.core.CSSSize} sWidth The width of the PDFViewer as CSS size.
	 * @returns {sap.m.PDFViewer} Reference to the control instance to allow method chaining.
	 * @public
	 */
	PDFViewer.prototype.setWidth = function (sWidth) {
		this.setProperty("width", sWidth, /*suppressInvalidate*/ true);
		var $oDomRef = this.$();
		if ($oDomRef) {
			$oDomRef.attr("width", sWidth);
		}
		return this;
	};

	/**
	 * Sets the height of the PDFViewer.
	 * @param {sap.ui.core.CSSSize} sHeight The height of the PDFViewer as CSS size.
	 * @returns {sap.m.PDFViewer} Reference to the control instance to allow method chaining.
	 * @public
	 */
	PDFViewer.prototype.setHeight = function (sHeight) {
		this.setProperty("height", sHeight, /*suppressInvalidate*/ true);
		var $oDomRef = this.$();
		if ($oDomRef) {
			$oDomRef.attr("height", sHeight);
		}
		return this;
	};

	return PDFViewer;

});
