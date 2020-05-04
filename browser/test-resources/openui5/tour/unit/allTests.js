sap.ui.require([
  'test/unit/Tour',
  'test/unit/TourStep'
], function() {
  'use strict';

  const node = document.createElement('div');
  node.setAttribute('id', 'content');
  document.body.appendChild(node);
  QUnit.start();
});
