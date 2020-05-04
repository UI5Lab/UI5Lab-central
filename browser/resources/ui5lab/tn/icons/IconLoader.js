/* global ui5lab:true */
sap.ui.define([
	"sap/ui/base/Object", 
	"jquery.sap.global",
	"./FontAwesome",
	"./MaterialDesign"
	], function (Object, jQuery, FontAwesome, MaterialDesign) {
		"use strict";

		var o = Object.extend("ui5lab.tn.icons.IconLoader", {

			load: function (icons) {
				if (Array.isArray(icons)){
					for (var sIconFont in icons) {
						this._loadIcon(sIconFont);
					}
				} else {
					this._loadIcon(icons);
				}
			},
			_loadIcon: function(sIconFont){
				switch (sIconFont){
					case ui5lab.tn.icons.iconFonts.FontAwesome:
						FontAwesome.init();
						break;
					case ui5lab.tn.icons.iconFonts.MaterialDesign:
						MaterialDesign.init();
						break;
				}
			}
		});
		return new o();
	});