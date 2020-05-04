sap.ui.define([
	"sap/m/Label",
	"sap/m/Toolbar",
	"sap/m/ToolbarSpacer",
	"sap/m/Button",
	"sap/m/Link",
	"sap/m/Text"
], function(Label, Toolbar, ToolbarSpacer, Button, Link, Text) {

	return {
		getLink: function(getText, getAction) {
			return new Link({
				text: getText ? getText() : "",
				press: getAction ? getAction : "",
				emphasized: true
			});
		},
		getButton: function(getText, icon, getAction, isVisible, tooltip) {
			var button = new Button({
				text: getText ? getText() : "",
				press: getAction ? getAction : "",
				icon: icon ? "sap-icon://" + icon : "",
				visible: isVisible ? isVisible() : true,
				tooltip: tooltip ? tooltip() : ""
					// ,
					// type: "Emphasized"
			});
			return button;
		},
		getLabel: function(getTextValue, getDesign, getCustomData) {
			var lbl = new Label({
				text: getTextValue(),
				design: getDesign ? getDesign() : "Standard"
			});
			if (getCustomData) {
				lbl.addCustomData(getCustomData());
			}
			return lbl;
		},
		getText: function(getTextValue) {
			return new Text({
				text: getTextValue()
			});
		},
		getToolbar: function(content) {
			return new Toolbar({
				content: content
			});
		},
		getSpacer: function() {
			return new ToolbarSpacer();
		}
	};
});