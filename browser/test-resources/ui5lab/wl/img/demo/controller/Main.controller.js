sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"ui5lab/wl/img/ImageViewer"
], function(Controller, JSONModel,ImageViewer) {
	"use strict";

	return Controller.extend("be.wl.ImageDemo.controller.Main", {
		onInit: function() {
		},
		onFileChange: function(oEvent) {
			var reader = new FileReader(),
				me = this;
			reader.onload = function(oEvent) {
				me.imageViewer = new ImageViewer({
					src: oEvent.target.result
				});
				me.imageViewer.open();
			};
			reader.readAsDataURL(oEvent.getParameter("files")[0]);
		},
		onOpenImageViewer: function(oEvent) {
			if (this.imageViewer) {
				this.imageViewer.open();
			}
		}
	});
});