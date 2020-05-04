sap.ui.define([
  'sap/ui/core/library'
], function() {
  'use strict';

  /**
   * OpenUI5 library: openui5.password.
   *
   * @namespace
   * @name openui5.password
   * @author Mauricio Lauffer
   * @version 0.1.9
   * @public
   */
  return sap.ui.getCore().initLibrary({
    name: 'openui5.password',
    dependencies: [
      'sap.ui.core',
      'sap.m'
    ],
    interfaces: [],
    controls: ['openui5.password.Password'],
    elements: [],
    noLibraryCSS: true,
    version: '0.1.9'
  });
}, /* bExport= */ false);
