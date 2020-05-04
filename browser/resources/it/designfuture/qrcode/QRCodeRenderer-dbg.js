sap.ui.define([],
	function() {
	"use strict";


	/**
	* QRCode renderer.
	* @static
	* @namespace
	*/
	var QRCodeRenderer = {};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRM The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered.
	 */
	QRCodeRenderer.render = function(oRM, oControl) {
		oRM.write("<div");
		oRM.writeControlData(oControl);
		oRM.addClass("openui5-qrcode");
		oRM.writeClasses();
		oRM.write(">");
		oRM.renderControl(oControl.getAggregation("__qrcodeHTML"));
		oRM.write("</div>");
	};


	return QRCodeRenderer;

}, /* bExport= */ true);