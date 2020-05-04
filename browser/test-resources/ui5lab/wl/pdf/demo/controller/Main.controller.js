sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("be.wl.PDFExample.controller.Main", {
		onInit: function() {
			this.getView().setModel(new JSONModel({
				pdfsource: ""
			}));
		},
		onFileChange: function(oEvent) {
			var reader = new FileReader(),
				me = this;
			reader.onload = function(oEvent){
				me.getView().getModel().setProperty("/pdfsource", oEvent.target.result);
			};
			reader.readAsDataURL(oEvent.getParameter("files")[0]);
		},
		onOpenPDFViewer:function(oEvent){
			if (! this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("be.wl.PDFExample.view.dialog.PDFViewer", this);
				this.getView().addDependent(this._oDialog);
			}
			this._oDialog.open();
		},
		onClose:function(oEvent){
			if(this._oDialog){
				this._oDialog.close();
			}
		}
	});
});