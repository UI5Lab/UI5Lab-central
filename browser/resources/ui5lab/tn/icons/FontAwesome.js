/* global _:true */
sap.ui.define(["sap/ui/base/Object", "jquery.sap.global", "sap/ui/core/IconPool", "./util/lodash.min"],
	function (Object, jQuery, IconPool, lodashjs) {
		"use strict";
		var o = Object.extend("ui5lab.tn.icons.FontAwesome", {
			init: function () {
				var path = jQuery.sap.getResourcePath("ui5lab/tn/icons");
				jQuery.ajax({
					url: path + "/fa.json",
					success: function (result) {
						_.forEach(result, function (cssClass) {
							IconPool.addIcon(cssClass.name, "fa", "FontAwesome", cssClass.code);
						});
					},
					async: false
				});
				jQuery.sap.includeStyleSheet(path + "/css/font-awesome.css", "facss");
			}
		});
		return new o();
	});