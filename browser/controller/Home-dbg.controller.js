sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/library"
], function (BaseController, JSONModel, Filter, FilterOperator, MobileLibrary) {
	"use strict";

	return BaseController.extend("ui5lab.browser.controller.Home", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the sampleList controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel;

			// local model used to manipulate control states
			oViewModel = new JSONModel({
				title: this.getResourceBundle().getText("homePanelTitle"),
				query: "",
				libraryRows: [
					// filled automatically by _fillLayout
				],
				libraries: [
					// filled automatically by _fillLayout
				]
				// example for library metadata dynamically composed from index.json file
				/*{
					id: "ui5lab.geometry",
					name: "Geometry",
					source: "http://",
					documentation: "http://",
					demo: "http://",
					license: "Apache 2.0",
				}*/
			});
			this.setModel(oViewModel, "homeView");

			this.getRouter().getTarget("home").attachEventOnce("display", this._onHomeTargetMatched, this);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Searches and filters the UI5Lab libraries in both views
		 * @param [sap.ui.base.Event] vEvent the SearchField liveChange event
		 */
		onSearch: function (oEvent) {
			var sQuery = (oEvent ? oEvent.getParameter("newValue") : this.getModel("homeView").getProperty("/query")),
				oSubView = this.byId("projects").getContent()[0];

			// store query for switching views without loosing the filter
			this.getModel("homeView").setProperty("/query", sQuery);

			if (oSubView.byId("table")) {
				oSubView.byId("table").getBinding("items").filter(new Filter("name", FilterOperator.Contains, sQuery));
			} else {
				// filter each row
				oSubView.byId("grid").getContent().forEach(function (oRow) {
					oRow.getBinding("content").filter(new Filter("name", FilterOperator.Contains, sQuery));
				});
				// show/hide no data text if needed
				setTimeout(function() {
					var bHasResults = false;
					oSubView.byId("grid").getContent().forEach(function (oRow) {
						if (oRow.getContent().length > 0) {
							bHasResults = true;
						}
					});
					oSubView.byId("nodata").setVisible(!bHasResults);
				}, 0);
			}
		},

		/**
		 * Toggles between grid and table view of the libraries
		 * @param {sap.ui.base.Event} oEvent The SegmentedButton select event
		 */
		onSelect: function (oEvent) {
			var sKey = oEvent.getParameter("key");

			this.byId("projects").removeAllContent();
			this.getRouter().getTarget("home" + sKey).display().then(function () {
				this.onSearch();
			}.bind(this));
		},

		/**
		 * Redirects to the official documentation of UI5Lab project
		 */
		onHelp : function () {
			MobileLibrary.URLHelper.redirect("https://ui5lab.io/docs/", true);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Called once to display the default view on all entry points
		 * @private
		 */
		_onHomeTargetMatched: function (oEvent) {
			var bTableMode = arguments[0].getParameter("data")["?query"];
			if (this.byId("projects").getContent().length === 0) {
				this.getRouter().getTarget("homeGrid").display().then(function () {
					this.getOwnerComponent().samplesLoaded().then(this._fillLayout.bind(this), this._fillLayout.bind(this));
				}.bind(this));
			}
		},

		/**
		 * Set up of the local view model to display libraries and the title on the home screen
		 * @private
		 */
		_fillLayout: function () {
			var oViewModel = this.getModel("homeView"),
				oSampleModel = this.getModel();

			if (oSampleModel) {
				var aLibraries = oSampleModel.getData().libraries,
						aLibraryRows = [],
						iCurrentRow = 0,
						iCellsPerRow = 4;

				// flat list of libraries for table view
				oViewModel.setProperty("/libraries", aLibraries);

				// chunks of data for grid view
				for (var i = 0; i < aLibraries.length; i++) {
					if (!aLibraryRows[iCurrentRow]) {
						aLibraryRows[iCurrentRow] = [];
					}
					aLibraryRows[iCurrentRow].push(aLibraries[i]);
					if (i % iCellsPerRow === iCellsPerRow - 1) {
						iCurrentRow++;
					}
				}
				oViewModel.setProperty("/libraryRows", aLibraryRows);

				oViewModel.setProperty("/title", this.getResourceBundle().getText("homePanelTitleCount", [oSampleModel.getData().libraries.length]));

				var oSubView = this.byId("projects").getContent()[0];

				oSubView.byId("nodata").setVisible(aLibraryRows.length === 0);
			}
		}
	});
});
