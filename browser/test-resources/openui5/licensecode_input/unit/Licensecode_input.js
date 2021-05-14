sap.ui.require([
  'sap/ui/base/Object',
  'sap/ui/core/ValueState',
  'sap/ui/core/MessageType',
  'sap/ui/core/message/Message',
  'sap/ui/core/mvc/XMLView',
  'openui5/licensecode_input/LicenseCode'
],
/**
 * Module Dependencies
 *
 * @param {typeof sap.ui.base.Object} UI5Object UI5 Object
 * @param {typeof sap.ui.core.ValueState} ValueState UI5 Value State
 * @param {typeof sap.ui.core.MessageType} MessageType UI5 Messate Type
 * @param {typeof sap.ui.core.message.Message} Message UI5 Message object
 * @param {typeof sap.ui.core.mvc.XMLView} XMLView UI5 XML View
 * @param {object} LicenceCode An extended UI5 Object
 * @returns {object} LicenseCode object, an extended UI5 Object
 */
function(UI5Object, ValueState, MessageType, Message, XMLView, LicenseCode) {
  'use strict';

  let viewForTest = {};
  const viewDefinition = `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:license="openui5.licensecode_input"><Page><VBox>' +
      <license:LicenseCode id="licenseCode" style='width:100%' 
        value="{path: '/licenseCode'}" 
        valueStateText="Please enter a vaild license code">
        <license:layoutData>
          <l:GridData span="XL7 L7 M10 S10"/>
        </license:layoutData>
      </license:LicenseCode>
   '</VBox></Page></mvc:View>`;

  const {test} = QUnit;

  QUnit.module('LicenseCode', {
    beforeEach: function() {
      return XMLView.create({
        definition: viewDefinition
      })
      .then((viewCreated) => {
        viewForTest = viewCreated;
      });
    },
    afterEach: function() {
      viewForTest.destroy();
      viewForTest = null;
    }
  }, function() {
    QUnit.module('constructor', () => {
      test('Should raise an error when creating instance', (assert) => {
      });
      test('Should instantiate the control', (assert) => {
      });
    });

    QUnit.module('destroy', () => {
      test('Should destroy the control', (assert) => {
      });
    });

  });
});
