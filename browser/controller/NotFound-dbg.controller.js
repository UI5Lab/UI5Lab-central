sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ui5lab.browser.controller.NotFound", {

		/**
		 * Navigates to the sampleList when the link is pressed
		 * @public
		 */
		onLinkPressed : function () {
			this.getRouter().navTo("sampleList");
		}

	});

});
