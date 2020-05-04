/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library ui5lab.square.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, library1) {
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
		name : "ui5lab.geometry",
		dependencies : ["sap.ui.core"],
		types: [
			"ui5lab.geometry.SquareType"
		],
		interfaces: [],
		controls: [
			"ui5lab.geometry.Square",
			"ui5lab.geometry.Circle",
			"ui5lab.geometry.Triangle"
		],
		elements: [],
		noLibraryCSS: false,
		version: "1.0.0"
	});


	/**
	 * Example type.
	 *
	 * @enum {string}
	 * @public
	 */
	ui5lab.geometry.ShapeType = {

		/**
		 * A value for squares with round corners
		 * @public
		 */
		RoundCorners : "RoundCorners",

		/**
		 * A value for squares with angled corners
		 * @public
		 */
		AngledCorners : "AngledCorners"

	};


	return ui5lab.geometry;

});
