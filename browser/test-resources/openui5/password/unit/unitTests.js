sap.ui.require([
    'sap/ui/thirdparty/qunit-2',
    'sap/ui/thirdparty/sinon'
  ], function() {
    'use strict';

    sap.ui.require([
        'sap/ui/qunit/qunit-coverage',
        'sap/ui/thirdparty/sinon-qunit'
      ], function() {
        QUnit.config.autostart = false;
        if (window.blanket) {
          window.blanket.options('sap-ui-cover-only', 'openui5/password');
          window.blanket.options('sap-ui-cover-never', 'openui5/password/thirdparty');
        }
        sap.ui.require([
            'test/unit/allTests'
          ], function() {
            //Starting QUnit tests
          }
        );
      }
    );
  }
);
