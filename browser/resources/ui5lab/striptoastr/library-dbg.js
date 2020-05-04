/**
 * striptoastr - Message Strips that Growl
 * @version v1.0.0
 * @link https://github.com/jasper07/StripToastr#readme
 * @license MIT
 */
/**
 * Initialization Code and shared classes of library ui5lab.striptoastr.
 */
sap.ui.define(["jquery.sap.global", "sap/ui/core/library"],
    function(jQuery, library1) {
        "use strict";


        /**
         * UI5 library: ui5lab.striptoastr.
         *
         * @namespace
         * @name ui5lab.striptoastr
         * @public
         */

        // library dependencies

        // delegate further initialization of this library to the Core
        sap.ui.getCore().initLibrary({
            name: "ui5lab.striptoastr",
            dependencies: ["sap.ui.core"],
            interfaces: [],
            controls: [
                "ui5lab.striptoastr.StripToastr"
            ],
            elements: [],
            noLibraryCSS: false,
            version: "${version}"
        });

        return ui5lab.striptoastr;
    });