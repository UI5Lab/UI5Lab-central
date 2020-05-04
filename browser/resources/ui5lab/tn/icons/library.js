/* global ui5lab:true */
sap.ui.define(["jquery.sap.global", "sap/ui/core/library"],
	function(jQuery, library) {
		"use strict";

		sap.ui.getCore().initLibrary({
			name: "ui5lab.tn.icons",
			dependencies: ["sap.ui.core"],
			types: ["ui5lab.tn.icons.iconFonts.FontAwesome",
					"ui5lab.tn.icons.iconFonts.MaterialDesign"],
			interfaces: [],
			elements: [],
			controls: [],
			version: "${version}"
		});
		
		ui5lab.tn.icons.iconFonts.FontAwesome = "fa";
		ui5lab.tn.icons.iconFonts.MaterialDesign = "md";
		
		return ui5lab.tn.icons;
	});