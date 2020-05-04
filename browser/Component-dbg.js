sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ui5lab/browser/model/SampleModel",
	"ui5lab/browser/model/models",
	"ui5lab/browser/controller/ErrorHandler"
], function (UIComponent, Device, SampleModel, models, ErrorHandler) {
	"use strict";

	return UIComponent.extend("ui5lab.browser.Component", {

		metadata : {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init : function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set up a model that loads samples based on metadata
			var oSampleModel = new SampleModel(this.getModel("i18n"));
			this.setModel(oSampleModel);

			// We resolve the helper promise on component level when the promise in the icon model is resolved.
			// The app controller is instantiated before the components init method, so it cannot directly
			// register to the icon model.

			this.samplesLoaded();

			oSampleModel.loaded().then(function () {
				this._fnSamplesLoadedResolve();
			}.bind(this), function () {
				this._fnSamplesLoadedReject();
			}.bind(this));


			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},

		/**
		 * Wrapper for the sampleModel promise as the controller is instantiated earlier than the model
		 * @return {Promise|*} the samples loaded promise
		 */
		samplesLoaded: function () {
			if (!this._oSamplesLoadedPromise) {
				this._oSamplesLoadedPromise = new Promise(function (fnResolve, fnReject) {
					this._fnSamplesLoadedResolve = fnResolve;
					this._fnSamplesLoadedReject = fnReject;
				}.bind(this));
			}
			return this._oSamplesLoadedPromise;
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy : function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});

});
