/*global location*/

sap.ui.define([
	"./BaseController",
	"ui5lab/browser/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/library",
], function (
	BaseController,
	formatter,
	JSONModel,
	History,
	mobileLibrary) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("ui5lab.browser.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the sampleList controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					fullscreen : false,
					href : "",
					busy : true,
					delay : 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().loaded().then(function () {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				}
			);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the sampleList route.
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("sampleList", {}, true);
			}
		},

		/**
		 * Toggles fullscreen mode for the current page
		 */
		toggleFullScreen : function () {
			var oViewModel = this.getModel("objectView");
			var bFullscreen = oViewModel.getProperty("/fullscreen");

			oViewModel.setProperty("/fullscreen", !bFullscreen);
			if (!bFullscreen) {
				// store current layout and go fullscreen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "EndColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
		},

		/**
		 * Opens the current sample in a new tab
		 */
		openInNewTab : function () {
			URLHelper.redirect(this.getModel("objectView").getProperty("/href"), true);
		},

		/**
		 * Closes the current page and returns to the parent route
		 */
		onClose : function (oEvent) {
			this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getRouter().navTo("sampleList", {
				libraryId : this._sLibraryId
			});
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			var oFlexibleLayout = this.getView().getParent().getParent();

			// store library id to be able to navigate back on close
			this._sLibraryId = oEvent.getParameter("arguments").libraryId

			this.getModel().loaded().then( function() {
				this._showSample(sObjectId);
			}.bind(this));

			oFlexibleLayout.setLayout(sap.f.LayoutType.ThreeColumnsEndExpanded);
		},

		/**
		 * Binds the view to the sample path.
		 * @function
		 * @param {string} sObjectId path to the object to be bound
		 * @private
		 */
		_showSample : function (sObjectId) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel(),
				aSamples = this.getModel().getProperty("/samples"),
				sSamplePath = "/samples/";

			for (var i = 0; i < aSamples.length; i++) {
				if (aSamples[i].id === sObjectId) {
					sSamplePath +=  i;
				}
			}

			this.getView().bindElement({
				path: sSamplePath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.loaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding(),
				oContext = oElementBinding.getBoundContext().getObject();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			// Everything went fine.
			if (oContext.url) {
				oViewModel.setProperty("/href", oContext.url);
			} else {
				//It should always load from test-resources
				var url = sap.ui.require.toUrl("libs/" + oContext.library.replace(/\./g, '/') + "/sample/" + oContext.id.split("\.").pop() + ".html");
				oViewModel.setProperty("/href", url);
			}
			oViewModel.setProperty("/busy", false);
		}

	});

});
