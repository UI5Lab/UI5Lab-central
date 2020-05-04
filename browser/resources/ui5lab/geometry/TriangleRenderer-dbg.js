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
	var TriangleRenderer = {};

	/**
	 * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm RenderManager object
	 * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
	 */
	TriangleRenderer.render = function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.writeAttribute('tabindex', '0');
		oRm.addClass("ui5labTriangle");
		oRm.writeClasses();

		// render an equal-sized square just by setting borders
		oRm.addStyle("border-width", "0 " + (oControl.getSize() / 2) + "px " + (oControl.getSize() * 0.86) + "px " + (oControl.getSize() / 2) + "px");
		oRm.addStyle("transform", "rotate(" + oControl.getRotation() + "deg)");
		oRm.writeStyles();

		oRm.write(">");

		oRm.write("<div class=\"ui5labTriangleText\"");

		// position the label in the middle
		oRm.addStyle("top", (oControl.getSize() / 2.5) + "px");
		oRm.addStyle("left", "-" + (oControl.getSize() / 2) + "px");
		oRm.addStyle("width", oControl.getSize() + "px");
		oRm.writeStyles();

		oRm.write(">");

		oRm.write("<div id=\"" + oControl.getId() + "-rotation\" class=\"ui5labTriangleRotation\">");
		oRm.writeEscaped(oControl.getRotation() + "°");
		oRm.write("</div>");

		oRm.writeEscaped(oControl.getText());
		oRm.write("</div>");

		oRm.write("</div>");
	};

	return TriangleRenderer;

}, /* bExport= */ true);
