/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library ui5lab.wordcloud.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
    function(jQuery, library1) {
        "use strict";


        /**
         * @namespace
         * @name ui5lab.wordcloud
         * @public
         */

        // library dependencies

        // delegate further initialization of this library to the Core
        sap.ui.getCore().initLibrary({
            name: "ui5lab.wordcloud",
            dependencies: ["sap.ui.core"],
            interfaces: [],
            controls: [
                "ui5lab.wordcloud.WordCloud"
            ],
            elements: ["ui5lab.wordcloud.Word"],
            noLibraryCSS: false,
            version: "${version}"
        });

        return ui5lab.wordcloud;

    });