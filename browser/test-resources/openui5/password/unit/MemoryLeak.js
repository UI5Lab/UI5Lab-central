sap.ui.require([
  'sap/ui/qunit/utils/MemoryLeakCheck',
  'openui5/password/Password'
], function(MemoryLeakCheck, Password) {
  'use strict';

  MemoryLeakCheck.checkControl('InputPassword', function() {
    return new Password();
  });
});
