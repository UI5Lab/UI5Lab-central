sap.ui.define(
  [],
  function() {
    "use strict";

    var oSignatureRenderer = {};

    oSignatureRenderer.render = function(oRm, oControl) {
      // get control properties

      oRm.write("<div");
      oRm.writeControlData(oControl);
      oRm.writeStyles();
      oRm.write(">");

      _createSVG(oRm, oControl);

      oRm.write("</div>");
    };

    function _createSVG(oRm, oControl) {
      oRm.write("<svg");

      var sWidth = oControl.getWidth() || "auto";
      var sHeight = oControl.getHeight() || "auto";
      var sBackgroundColor = oControl.getBackgroundColor();

      oRm.writeAttribute("width", sWidth);
      oRm.writeAttribute("height", sHeight);
      oRm.addStyle("background-color", sBackgroundColor);
      oRm.writeStyles();
      oRm.write(">");

      oRm.write("</svg>");
    }

    return oSignatureRenderer;
  },
  /* bExport= */ true
);
