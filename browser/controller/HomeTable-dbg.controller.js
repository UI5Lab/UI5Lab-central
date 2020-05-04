sap.ui.define([
	"./BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ui5lab.browser.controller.HomeTable", {

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Navigates to the library details
		 * @param {sap.ui.base.Event} oEvent The press event
		 */
		onShowLibrary: function (oEvent) {
			var oControl = oEvent.getSource(),
				sNamespace = oControl.getBindingContext("homeView").getObject().id;

			this.getModel("appView").setProperty("/helpVisible", false);
			this.getRouter().navTo("sampleList", {
				libraryId: sNamespace
			});
		}
	});
});
