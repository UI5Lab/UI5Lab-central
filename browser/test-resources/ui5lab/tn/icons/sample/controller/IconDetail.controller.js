sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/ObjectListItem"
], function (Controller, JSONModel, History, ObjectListItem) {
	"use strict";
	return Controller.extend("be.tn.IconsDemo.controller.IconDetail", {
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("detail").attachMatched(function (oEvent) {
				var sIcon = "sap-icon://fa/" + oEvent.getParameter("arguments").icon;
				this.getView().setModel(new JSONModel({"icon": sIcon}), "icon");
			}, this);
		},
		
		onNavBack: function(){
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("home", {});
			}
		}
	});
});