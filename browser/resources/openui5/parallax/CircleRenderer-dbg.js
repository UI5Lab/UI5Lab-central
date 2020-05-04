/*!
 * ${copyright}
 */

sap.ui.define([],
	function() {
	"use strict";

	/**
	 * Example renderer.
	 * @namespace
	 */
	var CircleRenderer = {};

	/**
	 * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm RenderManager object
	 * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
	 */
	CircleRenderer.render = function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("ui5labSquare");
		oRm.addClass("ui5labCircle");
		oRm.writeClasses();

		oRm.addStyle("width", oControl.getSize() + "px");
		oRm.addStyle("height", oControl.getSize() + "px");
		oRm.addStyle("line-height", (oControl.getSize() - 32) + "px");
		oRm.writeStyles();

		oRm.write(">");

		oRm.writeEscaped(oControl.getText());

		oRm.write("</div>");
	};

	return CircleRenderer;

}, /* bExport= */ true);
