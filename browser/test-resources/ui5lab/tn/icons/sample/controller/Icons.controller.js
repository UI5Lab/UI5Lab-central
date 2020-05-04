sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/ObjectListItem",
	"sap/ui/model/Filter",
	"ui5lab/tn/icons/IconLoader",
	"sap/ui/model/json/JSONModel"
], function (Controller, ObjectListItem, Filter, IconLoader, JSONModel) {
	"use strict";
	return Controller.extend("be.tn.IconsDemo.controller.Icons", {
		onInit: function () {
			// Load Icon Set
			var sIconSet = this.getOwnerComponent().getIconSet();
			if (sIconSet) {
				IconLoader.load(sIconSet);
				var path = jQuery.sap.getResourcePath("ui5lab/tn/icons");
				var oModel = new JSONModel(path + "/" + sIconSet + ".json");
				this.getView().setModel(oModel);
				var oViewModel = new JSONModel({
					title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sIconSet + "-title")
				});
				this.getView().setModel(oViewModel, "view");
			}
		},
		onItemPress: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("detail", {
				icon: oEvent.getSource().getBindingContext().getObject().name
			});
		},
		onSearch: function (oEvent) {
			var mFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("name", sap.ui.model.FilterOperator.Contains, sQuery);
				mFilters.push(filter);
			}
			var list = this.byId("iconList");
			var binding = list.getBinding("items");
			binding.filter(mFilters, "Application");
		}
	});
});