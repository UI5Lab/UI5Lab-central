sap.ui.define(['sap/ui/model/type/String', 'sap/ui/model/ValidateException'], function (String, ValidateException) {
  'use strict';
  var LicenseCodeType = String.extend('openui5.licensecode_input.LicenseCodeType', {
    errorMsg: 'Invalid value',
    chunkCount: 4,
    chunkLength: 4,
    constructor: function () {
      String.apply(this, arguments);
      this.name = 'LicenseCode';
    },

    setErrorMsg: function (errorMsg) {
      this.errorMsg = errorMsg;
    },

    /**
     * number of chunks the value has
     * @param {int} chunkCount
     */
    setChunkCount: function (chunkCount) {
      this.chunkCount = chunkCount;
    },

    /**
     * length of each chunk of the value
     * @param {int} chunkLength
     */
    setChunkLength: function (chunkLength) {
      this.chunkLength = chunkLength;
    },

    formatValue: function (oValue) {
      return oValue;
    },
    parseValue: function (oValue) {
      return oValue;
    },
    /**
     * Validator of this type. Ensures that no space is enclosed in the string
     * @param {string} oValue
     */
    validateValue: function (oValue) {
      // validates the single chunks of the value (Is this necessary?? Why not validate the whole string?)
      if (oValue.trim().length < this.chunkCount*this.chunkLength || !/^[^ ]*$/.test(oValue)) {
        throw new ValidateException(this.errorMsg);
      }
    }
  });

  return LicenseCodeType;
});
