sap.ui.require([
  'sap/ui/base/Object',
  'sap/ui/core/ValueState',
  'sap/ui/core/MessageType',
  'sap/ui/core/message/Message',
  'sap/ui/core/mvc/XMLView',
  'openui5/validator/Validator'
],
/**
 * Module Dependencies
 *
 * @param {typeof sap.ui.base.Object} UI5Object UI5 Object
 * @param {typeof sap.ui.core.ValueState} ValueState UI5 Value State
 * @param {typeof sap.ui.core.MessageType} MessageType UI5 Messate Type
 * @param {typeof sap.ui.core.message.Message} Message UI5 Message object
 * @param {typeof sap.ui.core.mvc.XMLView} XMLView UI5 XML View
 * @param {object} Validator An extended UI5 Object
 * @returns {object} Validator object, an extended UI5 Object
 */
function(UI5Object, ValueState, MessageType, Message, XMLView, Validator) {
  'use strict';

  let viewForTest = {};
  const viewDefinition = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page><VBox>' +
    '<Label text="User ID" /><Input id="userid" />' +
    '<Label text="Description" /><Input id="description" />' +
    '<Label text="Amount $" /><Input id="amount" />' +
    '<Label text="Create Date" /><DatePicker id="createdate" />' +
    '<Label text="Whatever field which is not validated" /><Input id="whatever" />' +
    '</VBox></Page></mvc:View>';

  function getSchema() {
    return {
      properties: {
        userid: {
          type: 'string',
          minLength: 2
        },
        description: {
          type: 'string',
          maxLength: 50,
          minLength: 5
        },
        amount: {
          type: 'number',
          minimum: 5,
          maximum: 999999
        },
        createdate: {
          format: 'date-time'
        }
      }
    };
  }

  const {test} = QUnit;

  QUnit.module('Validator', {
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
        let validator;
        try {
          validator = new Validator();
        } catch (err) {
          assert.strictEqual(err instanceof Error, true, 'Error raised, missing required parameters');
        }

        try {
          validator = new Validator(viewForTest);
        } catch (err) {
          assert.strictEqual(err instanceof Error, true, 'Error raised, schema is missing');
        }

        try {
          validator = new Validator(null, getSchema());
        } catch (err) {
          assert.strictEqual(err instanceof Error, true, 'Error raised, view is missing');
        }

        assert.strictEqual(validator, undefined, 'Validator not instantiated');
      });
      test('Should instantiate the control', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        assert.strictEqual(validator instanceof UI5Object, true, 'Object is instance of sap.ui.base.Object');
        assert.strictEqual(validator._view instanceof Object, true, '_view is ok');
        assert.strictEqual(validator._validProperties instanceof Array, true, '_validProperties is ok');
        assert.strictEqual(validator._validate instanceof Object, true, '_validate is ok');
      });
    });

    QUnit.module('destroy', () => {
      test('Should destroy the control', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.destroy();
        assert.strictEqual(validator._errors, null, '_errors was destroyed');
        assert.strictEqual(validator._view, null, '_view was destroyed');
        assert.strictEqual(validator._payload, null, '_payload was destroyed');
        assert.strictEqual(validator._validate, null, '_validate was destroyed');
      });
    });

    QUnit.module('_getControls', () => {
      test('Should NOT return any control, schema has no properties', (assert) => {
        const schema = getSchema();
        schema.properties = {};
        const validator = new Validator(viewForTest, schema);
        assert.strictEqual(validator._getControls().length, 0, 'none controls returned');
      });
      test('Should NOT return any control, schema has property with unknown ID', (assert) => {
        const schema = getSchema();
        schema.properties = {
          unknownid: {
            type: 'number'
          }
        };
        const validator = new Validator(viewForTest, schema);
        assert.strictEqual(validator._getControls().length, 0, 'ID not found, none controls returned');
      });
      test('Should return the controls to be validated', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        assert.strictEqual(validator._getControls().length, 4, 'controls returned');
        assert.strictEqual(validator._getControls()[0] instanceof UI5Object, true, 'control is an UI5 Object');
      });
    });

    QUnit.module('_getPayloadToValidate', () => {
      test('Should return an empty payload', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        assert.deepEqual(validator._getPayloadToValidate([]), {}, 'empty payload returned');
      });
      test('Should return a payload', (assert) => {
        const payload = {
          'amount': null,
          'description': null,
          'createdate': null,
          'userid': null
        };
        const validator = new Validator(viewForTest, getSchema());
        const controls = validator._getControls();
        assert.deepEqual(validator._getPayloadToValidate(controls), payload, 'payload returned ok');
      });
      test('Should return a payload with values set for properties', (assert) => {
        const payload = {
          'amount': '9000',
          'description': 'Pale Ale',
          'createdate': new Date(),
          'userid': '42'
        };
        const validator = new Validator(viewForTest, getSchema());
        const controls = validator._getControls();
        viewForTest.byId('amount').setValue(payload.amount);
        viewForTest.byId('description').setValue(payload.description);
        viewForTest.byId('createdate').setDateValue(payload.createdate);
        viewForTest.byId('userid').setValue(payload.userid);
        assert.deepEqual(validator._getPayloadToValidate(controls), payload, 'payload returned');
      });
    });

    QUnit.module('_getControlValue', () => {
      test('Should return the value set to the control', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        const amountControl = viewForTest.byId('amount');
        amountControl.setValue(42);
        assert.strictEqual(validator._getControlValue(amountControl), '42', 'value returned');
      });
    });

    QUnit.module('_clearControlStatus', () => {
      test('Should clear Value Status from controls', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        const controls = validator._getControls();
        controls.forEach(function _setValueState(control) {
          control.setValueState(ValueState.Error);
          control.setValueStateText('Error? What error?');
        });
        validator._clearControlStatus(controls);
        controls.forEach(function _testValueState(control) {
          assert.strictEqual(control.getValueState(), ValueState.None, 'ValueState cleared');
          assert.strictEqual(control.getValueStateText(), '', 'ValueStateText cleared');
        });
      });
    });

    QUnit.module('_setControlErrorStatus', () => {
      test('Should set error status', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        const controls = validator._getControls();
        validator._setControlErrorStatus(controls[0], 'Default Error Message');
        assert.strictEqual(controls[0].getValueState(), ValueState.Error, 'ValueState is correct');
        assert.strictEqual(controls[0].getValueStateText(), 'Default Error Message', 'ValueStateText is correct');
      });
    });

    QUnit.module('_processValidationErrors', () => {
      test('Should process errors messages and return MessageObjects', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.validate();
        const errorMessageObjects = validator._processValidationErrors(validator._validate.errors);
        assert.strictEqual(errorMessageObjects instanceof Array, true, 'MessageObjects returned');
        errorMessageObjects.forEach(function(errorMessageObject) {
          assert.strictEqual(errorMessageObject instanceof Message, true, 'MessageObject is ok');
          assert.strictEqual(errorMessageObject.type, MessageType.Error, 'message type is ok');
          assert.ok(errorMessageObject.message, 'message exist');
          assert.ok(errorMessageObject.target, 'target is ok');
          // assert.ok(errorMessageObject.description, 'description exist');
        });
      });
    });

    QUnit.module('getValidProperties', () => {
      test('Should return default valid UI5 Control properties', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        assert.strictEqual(validator.getValidProperties().length, 4, 'Default valid properties');
      });
    });

    QUnit.module('addValidProperties', () => {
      test('Should add 1 new valid UI5 Control property', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.addValidProperties(['ABAP']);
        assert.strictEqual(validator.getValidProperties().length, 5, '1 new property added'); // eslint-disable-line
      });
      test('Should add more than 1 new valid UI5 Control property', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.addValidProperties(['Kamehameha', 'Qi']);
        assert.strictEqual(validator.getValidProperties().length, 6, '2 new properties added');
      });
      test('Should add 1 new valid UI5 Control property for a given instance', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.addValidProperties(['ABAP']);
        assert.strictEqual(validator.getValidProperties().length, 5, '1 new property added'); // eslint-disable-line
        const validator2 = new Validator(viewForTest, getSchema());
        assert.strictEqual(validator2.getValidProperties().length, 4, 'no new properties');
      });
      test('Should be immutable', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.addValidProperties(['ABAP']);
        const validProperties = validator.getValidProperties();
        validProperties.push(['Nodejs']);
        assert.strictEqual(validator.getValidProperties().length, 5, '1 new property added');
      });
    });

    QUnit.module('validate', () => {
      test('Should fail validation', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        assert.strictEqual(validator.validate(), false, 'validation failed');
        validator.getErrors().forEach((errorMessageObject) => {
          assert.strictEqual(errorMessageObject instanceof Message, true, 'error message object ok');
        });
      });
      test('Should pass validation', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        viewForTest.byId('amount').setValue(8000);
        viewForTest.byId('description').setValue('Lager');
        viewForTest.byId('createdate').setDateValue(new Date());
        viewForTest.byId('userid').setValue(42);
        assert.strictEqual(validator.validate(), true, 'validation passed');
        assert.strictEqual(viewForTest.byId('userid').getValueState(), ValueState.None, 'status ok');
        assert.notOk(viewForTest.byId('userid').getValueStateText(), 'status text ok');
      });
      test('Should set error status when fail validation', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.validate();
        assert.strictEqual(viewForTest.byId('userid').getValueState(), ValueState.Error, 'status ok');
        assert.ok(viewForTest.byId('userid').getValueStateText(), 'status text ok');
      });
    });

    QUnit.module('getErrors', () => {
      test('Should return validation errors', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.validate();
        const validationErrors = validator.getErrors();
        assert.strictEqual(validationErrors instanceof Array, true, 'validation failed');
        validationErrors.forEach((errorMessageObject) => {
          assert.strictEqual(errorMessageObject instanceof Message, true, 'error message object ok');
        });
      });
      test('Should not return any error', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        viewForTest.byId('amount').setValue(8000);
        viewForTest.byId('description').setValue('Lager');
        viewForTest.byId('createdate').setDateValue(new Date());
        viewForTest.byId('userid').setValue(42);
        validator.validate();
        const validationResult = validator.getErrors();
        assert.strictEqual(validationResult, null, 'validation passed');
      });
    });

    QUnit.module('getPayloadUsedInValidation', () => {
      test('Should return payload used in validation', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        validator.validate();
        const payload = validator.getPayloadUsedInValidation();
        assert.strictEqual(payload instanceof Object, true, 'payload returned');
      });
      test('Should not return any payload', (assert) => {
        const validator = new Validator(viewForTest, getSchema());
        const payload = validator.getPayloadUsedInValidation();
        assert.strictEqual(payload, null, 'payload null');
      });
    });
  });
});
