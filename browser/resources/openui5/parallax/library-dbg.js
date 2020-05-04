/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library michadelic.openui5-parallax.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library1) {
	"use strict";


	/**
	 * An example library containing geometrical controls
	 *
	 * @namespace
	 * @name openui5.parallax
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "openui5.parallax",
		dependencies : ["sap.ui.core"],
		interfaces: [],
		controls: [
			"openui5.parallax.ParallaxLayer",
			"openui5.parallax.ParallaxScroller"
		],
		elements: [],
		noLibraryCSS: false,
		version: "1.0.0"
	});

	return openui5.parallax;

});
