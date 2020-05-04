sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("QRCode.controller.Home", {
		
		onInit  : function() {
			this.getView().setModel( new JSONModel({
				text: "UI5 Rocks!",
				width: 256,
				height: 256,
				colorDark: "#000000",
				colorLight: "#ffffff",
				correctLevel: 2
			}), "temp");
		}
		
		/////////////////////////////////////////////
		//  EVENTS
		/////////////////////////////////////////////
		

	});
});