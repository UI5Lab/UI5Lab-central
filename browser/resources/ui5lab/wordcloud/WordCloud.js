/*!
 * ${copyright}
 */

// Provides control ui5lab.wordcloud.WordCloud.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
    function(jQuery, library, Control) {
        "use strict";

        /**
         * Constructor for a new WordCloud control.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         *
         * @class
         * WordClouds are awesome geometrical shapes that are under-represented in today's modern UIs
         * @extends sap.ui.core.Control
         *
         * @public
         * @alias ui5lab.wordcloud.WordCloud
         */
        var oWordCloud = Control.extend("ui5lab.wordcloud.WordCloud", /** @lends ui5lab.wordcloud.WordCloud.prototype */ {
            /**
             * Control API
             */
            metadata: {
                library: "ui5lab.wordcloud",
                properties: {
                    rotate: {
                        type: "boolean",
                        defaultValue: true
                    },
                    width: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "300px"
                    },
                    height: {
                        type: "sap.ui.core.CSSSize",
                        defaultValue: "300px"
                    },
                    randomOrder: {
                        type: "boolean",
                        defaultValue: false
                    },
                    colors: {
                        type: "string[]",
                        defaultValue: ["#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a",
                            "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b",
                            "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7",
                            "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
                        ]
                    },
                    fontSizes: {
                        type: "string[]",
                        defaultValue: [22, 26, 28, 32, 36, 40, 44]
                    }
                },
                aggregations: {
                    words: {
                        type: "ui5lab.wordcloud.Word",
                        bindable: "bindable",
                        cardinality: "0..n",
                        singularName: "Word"
                    }
                }
            },

            /**
             * Lifecycle hook to initialize the control
             */
            init: function() {
                // nothing yet
            },

        });

        return oWordCloud;

    });