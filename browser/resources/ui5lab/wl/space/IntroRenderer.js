sap.ui.define([],
    function() {
        "use strict";
        var IntroRenderer = {};

        IntroRenderer.render = function(oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sw-intro");
            oRm.writeClasses();
            oRm.write(">");

            oRm.write("<p");
            oRm.addClass("intro-text");
            oRm.writeClasses();
            oRm.write(">");
            // property intro
            oRm.writeEscaped(oControl.getIntro());
            oRm.write("</p>");

            oRm.write("<h2");
            oRm.addClass("main-logo");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<img");
            oRm.writeAttributeEscaped("src", oControl.getLogo());
            oRm.write(">");
            oRm.write("</img>");
            oRm.write("</h2>");

            oRm.write("<div");
            oRm.addClass("main-content");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<div");
            oRm.addClass("title-content");
            oRm.writeClasses();
            oRm.write(">");
            oRm.write("<p");
            oRm.addClass("content-header");
            oRm.writeClasses();
            oRm.write(">");
            oRm.writeEscaped(oControl.getTitle());
            oRm.write("</p>");
            oRm.write("<p");
            oRm.addClass("content-body");
            oRm.writeClasses();
            oRm.write(">");
            oRm.writeEscaped(oControl.getText());
            oRm.write("</p>");
            oRm.write("</div>");

            oRm.write("</div>");
        };

        return IntroRenderer;

    }, /* bExport= */ true);