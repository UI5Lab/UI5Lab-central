sap.ui.define(
  [],
  function () {
    'use strict';

    var LicenseCodeRenderer = {
      render: function (oRM, oControl) {
        oRM.write('<div');
        oRM.writeControlData(oControl); // writes the Control ID and enables event handling - important!
        oRM.writeClasses(); // there is no class to write, but this enables
        if (oControl.getBinding('value').getDataState().getMessages().length > 0) {
            //if(oControl.getValueState() === 'Error') {
          oRM.addStyle('border', 'solid 2px red');
          oRM.writeStyles();
        }
        oRM.write('>');

        // oControl.getBinding('value').getDataState().getMessages()[0]

        var aChildren = oControl.getControls();
        for (var i = 0; i < aChildren.length; i++) {
          if (i > 0) {
            oRM.write('<div');
            oRM.addStyle('width', '2rem');
            oRM.addStyle('display', 'inline-block');
            oRM.addStyle('text-align', 'center');
            oRM.addStyle('vertical-align', 'bottom');
            oRM.addStyle('line-height', '3rem');
            oRM.writeStyles();
            oRM.write('>');
            oRM.write(' - ');
            oRM.write('</div>');
          }
          // loop over all child Controls,
          // render the colored box around them
          oRM.write('<div');
          oRM.addStyle('display', 'inline-block');
          //   oRM.addStyle('border', '3px solid ' + oControl.getBoxColor()); // specify the border around the child
          oRM.writeStyles();
          oRM.write('>');

          oRM.renderControl(aChildren[i]); // render the child Control
          // (could even be a big Control tree, but you don't need to care)

          oRM.write('</div>'); // end of the box around the respective child
        }
        oRM.write('</div>');
      }
    };

    return LicenseCodeRenderer;
  },
  true
);
