sap.ui.define(["jquery.sap.global", "sap/ui/core/library"], function(
  jQuery,
  library1
) {
  "use strict";

  // load d3 as required library
  jQuery.sap.require("sap.ui.thirdparty.d3");

  sap.ui.getCore().initLibrary({
    name: "ui5.sign",
    dependencies: ["sap.ui.core"],
    types: [],
    interfaces: [],
    controls: ["ui5.sign.Signature"],
    elements: [],
    noLibraryCSS: false,
    version: "${version}"
  });

  return ui5.sign;
});
