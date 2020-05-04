/*!
 * ${copyright}
 */

sap.ui.define([],
    function() {
        "use strict";

        /**
         * Renderer for Word Cloud
         * @namespace
         */
        var WordCloudRenderer = {};

        /**
         * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
         *
         * @param {sap.ui.core.RenderManager} oRm RenderManager object
         * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
         */
        WordCloudRenderer.render = function(oRm, oControl) {

            oRm.write("<div");
            oRm.writeControlData(oControl);

            // Generic library+control class
            oRm.addClass("ui5labWordCloud");
            // Library class
            oRm.addClass("tagCloud");
            oRm.writeClasses();
            oRm.addStyle("width", oControl.getWidth());
            oRm.addStyle("height", oControl.getHeight());
            oRm.writeStyles();
            oRm.write(">");


            var aFontSizes = oControl.getFontSizes();
            var aColors = oControl.getColors();
            var bRotate = oControl.getRotate();
            var bRandomOrder = oControl.getRandomOrder();

            // Get list of words
            var aWords = oControl.getWords();

            if (aWords && aWords.length) {
                var aMax = aWords.slice();
                var aMin = aWords.slice();

                aMax.sort(function(word1, word2) {
                    return word2.getWeight() - word1.getWeight();
                });

                aMin.sort(function(word1, word2) {
                    return word1.getWeight() - word2.getWeight();
                });

                var iMax = aMax[0].getWeight();
                var iMin = aMin[0].getWeight();
                var aValues = [-1, 0, 1];

                // randomly sort the words
                if (bRandomOrder) {
                    aWords.sort(function(oData1, oData2) {
                        return aValues[Math.floor(Math.random() * 10) % 3];
                    });
                }

                oRm.write("<ul");
                oRm.addClass("tagList");
                oRm.writeClasses();
                oRm.write(">");
                jQuery.each(aWords, function(i, oWord) {
                    // Create <li>
                    oRm.write("<li>");
                    var plusOrMinus = Math.random() > 0.5 ? -1 : 1;
                    // Default degree
                    var iDeg = 0;

                    if (bRotate) {
                        iDeg = plusOrMinus * ((Math.random() * 100) % 10);
                    }

                    var iIndex = Math.floor(((oWord.getWeight() - iMin) / (iMax - iMin)) *  (aFontSizes.length - 1));
                    var sColor = aColors[Math.floor(Math.random() * 100) % aColors.length];
                    var iFontSize = aFontSizes[iIndex] + 6;
                    oRm.write("<span");
                    oRm.addStyle('font-size', iFontSize + "px");
                    oRm.addStyle('color', sColor);
                    oRm.addStyle('-webkit-transform', 'rotate(' + iDeg + 'deg)');
                    oRm.addStyle('-ms-transform', 'rotate(' + iDeg + 'deg)');
                    oRm.addStyle('-moz-transform', 'rotate(' + iDeg + 'deg)');
                    oRm.addStyle('-o-transform', 'rotate(' + iDeg + 'deg)');
                    oRm.addStyle('display', 'table-cell');
                    oRm.addStyle('z-index', i);
                    oRm.writeStyles();
                    oRm.write(">");
                    if (oWord.getIcon()) {
                        debugger;
                        oRm.renderControl(new sap.ui.core.Icon({src: oWord.getIcon(), size: iFontSize+"px", color: sColor}));
                    }
                    oRm.writeEscaped(oWord.getText());
                    oRm.write("</span>");
                    oRm.write("</li>");
                });

                oRm.write("</ul>");
            }

            oRm.write("</div>");
        };

        return WordCloudRenderer;

    }, /* bExport= */ true);