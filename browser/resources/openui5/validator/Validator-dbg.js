/*
 * openui5-validator
 * (c) Copyright 2017-2020 Mauricio Lauffer
 * Licensed under the MIT license. See LICENSE file in the project root for full license information.
 */

sap.ui.define([
  'sap/ui/base/Object',
  'sap/ui/core/Control',
  'sap/ui/core/ValueState',
  'sap/ui/core/MessageType',
  'sap/ui/core/message/Message',
  'openui5/validator/thirdparty/ajv.min'
],
/**
 * Module Dependencies
 *
 * @param {typeof sap.ui.base.Object} UI5Object UI5 Object
 * @param {typeof sap.ui.core.Control} UI5Control UI5 Control
 * @param {typeof sap.ui.core.ValueState} ValueState Value State
 * @param {typeof sap.ui.core.MessageType} MessageType Messate Type
 * @param {typeof sap.ui.core.message.Message} Message UI5 Message object
 * @returns {object} Validator object, an extended UI5 Object
 */
function(UI5Object, UI5Control, ValueState, MessageType, Message) {
  'use strict';

  /**
   * A list of properties of UI5 Controls which will be used to dynamically get the field value.
   * Validation is dynamic, it neither knows the control's type nor the property which is being validated.
   *
   * @type {string[]}
   * @private
   */
  const VALID_UI5_CONTROL_PROPERTIES = ['dateValue', 'selectedKey', 'selected', 'value'];

  /**
   * Default parameters to initialize Ajv.
   * https://github.com/epoberezkin/ajv#options
   *
   * @type {object}
   * @private
   */
  const DEFAULT_AJV_OPTIONS = {
    $data: true,
    allErrors: true,
    coerceTypes: true,
    errorDataPath: 'property'
  };

  /**
   * OpenUI5 Validator.
   *
   * @author Mauricio Lauffer
   * @version 0.1.17
   *
   * @class
   * @namespace
   * @name openui5.validator
   * @public
   * @alias openui5.validator.Validator
   */
  const Validator = UI5Object.extend('openui5.validator.Validator', {
  /**
   * Constructor for a new Validator.
   * @extends sap.ui.base.Object
   *
   * @constructor
   * @param {typeof sap.ui.core.mvc.View} view UI5 view which contains the fields to be validated.
   * @param {object} schema Schema used for validation.
   * @param {object} opt Parameters to initialize Ajv.
   * @public
   */
    constructor: function(view, schema, opt) {
      if (!view || !schema) {
        throw new Error('Missing parameters!');
      }
      UI5Object.apply(this, arguments);

      // OpenUI5 controls always return their values as STRING, so we force the correct type for validation
      const ajv = new Ajv(opt || DEFAULT_AJV_OPTIONS);
      this._validate = ajv.compile(schema);
      this._view = view;
      this._errors = null;
      this._payload = null;
      this._validProperties = [];
      this.addValidProperties(VALID_UI5_CONTROL_PROPERTIES);
    }
  });

  Validator.prototype.destroy = function() {
    this._validate = null;
    this._view = null;
    this._errors = null;
    this._payload = null;
    this._validProperties = null;
  };


  /**
   * Validates the payload against the schema.
   *
   * @returns {boolean} Returns "true" if validation is successful and "false" in case of any validation error.
   * @public
   */
  Validator.prototype.validate = function() {
    const controls = this._getControls();
    this._payload = this._getPayloadToValidate(controls);
    this._clearControlStatus(controls);
    const isValid = this._validate(this._payload);
    if (isValid) {
      this._errors = null;
    } else {
      this._errors = this._processValidationErrors(this._validate.errors);
    }
    return isValid;
  };

  /**
   * Returns all validation errors.
   *
   * @returns {typeof sap.ui.core.message.Message[]} Array of sap.ui.core.message.Message objects.
   * @public
   */
  Validator.prototype.getErrors = function() {
    return this._errors;
  };

  /**
   * Returns the payload used in the validation.
   *
   * @returns {object} [payload] Payload used in the validation.
   * @public
   */
  Validator.prototype.getPayloadUsedInValidation = function() {
    return this._payload;
  };

  /**
   * Returns all valid properties which will be used to dynamically get the field value.
   *
   * @returns {array} Array with all valid properties.
   * @public
   */
  Validator.prototype.getValidProperties = function() {
    return this._validProperties.map(function _getValidProperties(validProperty) {
      return validProperty;
    });
  };

  /**
   * Adds new valid properties to be used to dynamically get the field value.
   *
   * @param {array} validProperties An array containing valid properties to be added to the class.
   * @public
   */
  Validator.prototype.addValidProperties = function(validProperties) {
    const that = this;
    validProperties.forEach(function _addValidProperty(property) {
      that._validProperties.push(property);
    });
  };

  /**
   * Returns all UI5 Controls which will be validated.
   *
   * @returns {array} List of UI5 Controls to be validated.
   * @private
   */
  Validator.prototype._getControls = function() {
    const that = this;
    if (this._validate.schema && this._validate.schema.properties) {
      return Object.keys(this._validate.schema.properties)
          .map(function _mapSchemaProperties(key) {
            const control = that._view.byId(key);
            return (control instanceof UI5Control) ? control : null;
          })
          .filter(function _filterSchemaProperties(control) {
            return (control);
          });
    } else {
      return [];
    }
  };

  /**
   * Returns the payload to be validated.
   *
   * @param {typeof sap.ui.core.Control[]} controls List of UI5 Controls to be validated.
   * @returns {object} Payload to be validated.
   * @private
   */
  Validator.prototype._getPayloadToValidate = function(controls) {
    const that = this;
    const payload = {};
    controls.forEach(function _setPayloadProperty(control) {
      const viewIdIndex = control.getId().lastIndexOf('-') + 1;
      const controlId = control.getId().substring(viewIdIndex);
      payload[controlId] = that._getControlValue(control);
    });
    return payload;
  };

  /**
   * Returns the property value of the control.
   *
   * @param {typeof sap.ui.core.Control} control The control which will have its value extracted.
   * @returns {string} The property value of the control.
   * @private
   */
  Validator.prototype._getControlValue = function(control) {
    let value = null;
    const controlProperties = Object.keys(control.mProperties);
    this._validProperties.forEach(function _filterControlProperties(validProperty) {
      if (!value) {
        const isValidProperty = controlProperties.find(function _findValidProperty(controlProperty) {
          return (controlProperty === validProperty);
        });
        if (isValidProperty) {
          /** Could use control.getProperty(property), but UI5 documentation says:
           * Note: This method is a low-level API as described in the class documentation.
           * Applications or frameworks must not use this method to generically retrieve the value of a property.
           * Use the concrete method getXYZ for property 'XYZ' instead.
           * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/getProperty
           */
          const getPropertyMethod = ['get', validProperty.substring(0, 1).toUpperCase(), validProperty.substring(1)].join('');
          if (control[getPropertyMethod]) {
            value = control[getPropertyMethod]();
          }
        }
      }
    });
    return value;
  };

  /**
   * Clears the status set to a list of controls
   *
   * @param {typeof sap.ui.core.Control[]} controls The controls which will have the status cleared.
   * @private
   */
  Validator.prototype._clearControlStatus = function(controls) {
    controls.forEach(function _setValueState(control) {
      if (control && control.setValueState) {
        control.setValueState(ValueState.None);
      }
      if (control && control.setValueStateText) {
        control.setValueStateText();
      }
    });
  };

  /**
   * Sets error status and error message to a control
   *
   * @param {typeof sap.ui.core.Control} control The control which will have the status updated.
   * @param {string} message The error message to be assigned to the control.
   * @private
   */
  Validator.prototype._setControlErrorStatus = function(control, message) {
    if (control && control.setValueState) {
      control.setValueState(ValueState.Error);
    }
    if (control && control.setValueStateText) {
      control.setValueStateText(message);
    }
  };

  /**
   * Process all validation errors.
   *
   * @param {array} errors A list with all errors returned by the validation.
   * @returns {typeof sap.ui.core.message.Message[]} A list of sap.ui.core.message.Message objects.
   * @private
   */
  Validator.prototype._processValidationErrors = function(errors) {
    const that = this;
    /**
     * @type {typeof sap.ui.core.message.Message[]}
     */
    const errorMessageObjects = [];
    errors.forEach(function _mapErrors(err) {
      const controlId = err.dataPath.substring(1);
      const control = that._view.byId(controlId);
      if (control) {
        that._setControlErrorStatus(control, err.message);
        errorMessageObjects.push(that._createErrorMessageObject(control, err.message, ''));
      }
    });
    return errorMessageObjects;
  };

  /**
   * Creates an UI5 error message object.
   *
   * @param {typeof sap.ui.core.Control} control The control with invalid value.
   * @param {string} shortMessage The short error message to be displayed.
   * @param {string} longMessage The long error message to be displayed.
   * @returns {sap.ui.core.message.Message} The UI5 error message object.
   * @private
   */
  Validator.prototype._createErrorMessageObject = function(control, shortMessage, longMessage) {
    return new Message({
      message: shortMessage,
      description: longMessage,
      type: MessageType.Error,
      target: [control.getId(), '/'].join('')
    });
  };

  return Validator;
});
