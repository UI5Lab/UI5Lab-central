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
	var SquareRenderer = {};

	/**
	 * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm RenderManager object
	 * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
	 */
	SquareRenderer.render = function(oRm, oControl) {
		var sShape = oControl.getShape();

		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("ui5labSquare");

		if (sShape === ui5lab.geometry.ShapeType.RoundCorners) {
			oRm.addClass("ui5labSquareRound");
		} else {
			oRm.addClass("ui5labSquareAngled");
		}
		oRm.writeClasses();

		oRm.addStyle("width", oControl.getSize() + "px");
		oRm.addStyle("height", oControl.getSize() + "px");
		oRm.writeStyles();

		oRm.write(">");

		oRm.writeEscaped(oControl.getText());

		oRm.write("</div>");
	};

	return SquareRenderer;

}, /* bExport= */ true);
