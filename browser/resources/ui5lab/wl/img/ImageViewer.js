/* global Viewer:true */
sap.ui.define(["sap/ui/core/Control", 'sap/ui/core/Popup', './lib/viewer.min'], function(Control, Popup) {
	"use strict";
	return Control.extend("ui5lab.wl.img.ImageViewer", {
		"metadata": {
			"properties": {
				"src": "string"
			},
			"events": {}
		},
		keyEnter: 13,
		init: function() {
			this.log = jQuery.sap.log;
			this.attachBrowserEvent("keydown", this.catchOnEnter);

		},
		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.write("<img");
			oRm.writeAttributeEscaped("src", oControl.getSrc());
			oRm.write(">");
			oRm.write("</img>");
			oRm.write("</div>");
		},
		onBeforeRendering: function(evt) {
		},
		onAfterRendering: function(evt) {
			if (this.getSrc() && this.getSrc().length > 0) {
				this.viewer = new Viewer(this.getDomRef(), {
					title: false,
					tooltip: false,
					movable: false,
					scalable: false,
					navbar: false,
					fullscreen: false,
					transition: false
				});
			}
		},
		catchOnEnter: function(oEvent) {
			this.log.info("keydown:" + event.keyCode);

			switch (event.keyCode) {
				case this.keyEnter:
					this.viewer.hide();
					break;
				default:
			}
		},
		open: function() {
			sap.ui.getCore().getRenderManager().render(this, sap.ui.getCore().getStaticAreaRef());
			if (this.viewer) {
				this.viewer.show();
			}
		},
		setSrc: function(value) {
			this.setProperty("src", value, true);
			return this;
		}
	});
});