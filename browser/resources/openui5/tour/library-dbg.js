sap.ui.define([], function() {
  'use strict';

  /**
   * OpenUI5 library: openui5.tour
   *
   * @namespace
   * @name openui5.tour
   * @author Mauricio Lauffer
   * @version 0.0.18
   * @public
   */
  return sap.ui.getCore().initLibrary({
    name: 'openui5.tour',
    dependencies: [
      'sap.ui.core',
      'sap.m'
    ],
    controls: [
      'openui5.tour.Tour',
      'openui5.tour.TourStep'
    ],
    noLibraryCSS: true,
    version: '0.0.18'
  });
});
