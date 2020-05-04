sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Control'
],
function($, Control) {
	"use strict";

	return Control.extend("openui5.parallax.ParallaxLayer", {
		metadata : {
			properties: {
				/**
				 * Relative or absolute path to URL where the image file is stored. The path will be adapted to the density aware format according to the density of the device following the convention that [imageName]@[densityValue].[extension]
				 */
				src : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
				/**
				 * Overrides the relative positioning according to the aggregation index
				 */
				depth: {type : "float", group : "Data", defaultValue : null}
			}
		},

		renderer: function (oRM, oControl) {
			oRM.write("<div data-depth='" + oControl.getDepth() + "'");
			oRM.writeControlData(oControl);
			oRM.addClass("openui5ParallaxLayer");
			oRM.addClass("layer");
			oRM.writeClasses();
			oRM.write(">");

			oRM.write("<div ");
			oRM.write("style='background-image:url(");
			if (oControl.getSrc()) {
				oRM.writeEscaped(oControl.getSrc());
			}
			oRM.write(")'" );
			oRM.write(">");
			oRM.write("</div>");

			oRM.write("</div>");
		}
	});

});
