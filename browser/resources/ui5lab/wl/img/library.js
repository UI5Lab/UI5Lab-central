/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library ui5lab.wl.pdf.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library) {
	"use strict";


	/**
	 * An example library containing geometrical controls
	 *
	 * @namespace
	 * @name ui5lab.geometry
	 * @public
	 */

	// library dependencies

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "ui5lab.wl.img",
		dependencies : ["sap.ui.core"],
		types: [],
		interfaces: [],
		controls: [
			"ui5lab.wl.img.ImageViewer"
		],
		elements: [],
		noLibraryCSS: false,
		version: "${version}"
	});


	return ui5lab.wl.img;

});
