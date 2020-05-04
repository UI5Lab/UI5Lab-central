/*!
 * ${copyright}
 */

sap.ui.define([
	"jquery.sap.global"
], function(jQuery) {
		"use strict";

		var sViewerPath, sThirdPartyPath;
		sThirdPartyPath = jQuery.sap.getModulePath("nabi.m.thirdparty");
		sViewerPath = sThirdPartyPath + "/pdfjs/web/viewer.html";

		/**
		 * Example renderer.
		 * @namespace
		 */
		var PDFViewerRenderer = {};

		/**
		 * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm RenderManager object
		 * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
		 */
		PDFViewerRenderer.render = function(oRm, oControl) {

			oRm.write("<iframe");
			oRm.writeControlData(oControl);

			oRm.addClass("nabiMPDFViewer");
			oRm.writeClasses();

			oRm.writeAttribute("src", sViewerPath + "?file=" + oControl.getSource());
			oRm.writeAttribute("height", oControl.getHeight());
			oRm.writeAttribute("width", oControl.getWidth());

			oRm.write("></iframe>");
		};

		return PDFViewerRenderer;

	}, /* bExport= */ true);
