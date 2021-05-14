sap.ui.define(
  [
    'sap/ui/core/Control',
    'openui5/licensecode_input/LicenseCodeRenderer',
    './library',
    'sap/m/Input',
    'sap/ui/model/json/JSONModel',
    'openui5/licensecode_input/type/LicenseCodeType',
    'sap/m/delegate/ValueStateMessage',
    'sap/ui/core/ValueState'
  ],
  function (
    Control,
    LicenseCodeRenderer,
    library,
    Input,
    JSONModel,
    LicenseCodeType,
    ValueStateMessage,
    ValueState
  ) {
    // shortcut on Enum
    // var SizeMode = library.SizeMode;

    var LicenseCodeControl = Control.extend('openui5.licensecode_input.LicenseCode', {
      metadata: {
        library: 'openui5.licensecode_input',
        aggregations: {},
        properties: {
          value: { type: 'string' },
          /**
           * Visualizes the validation state of the control, e.g. <code>Error</code>, <code>Warning</code>, <code>Success</code>.
           */
          valueState: {
            type: 'sap.ui.core.ValueState',
            group: 'Appearance',
            defaultValue: sap.ui.core.ValueState.None
          },
          /**
           * Defines the text that appears in the value state message pop-up. If this is not specified, a default text is shown from the resource bundle.
           */
          valueStateText: { type: 'string', group: 'Misc', defaultValue: null },
          /** Number of inner controls (input fields) to display and use for this control */
          controlCount: { type: 'int', defaultValue: 4 },
          /** Length of each inner control (input field). Means: how many characters are allowed in each input field */
          singleControlLength: { type: 'int', defaultValue: 4 }
        }
      },

      /** array with inner input controls that are used to get the data from the user but are not accessible from outside this control */
      innerControls: null,
      renderer: LicenseCodeRenderer,

      init: function () {
        if (Control.prototype.init) {
          // check whether superclass implements the method
          Control.prototype.init.apply(this, arguments); // call the method with the original arguments
        }

        //... do any further initialization of your subclass, e.g.
        this.model = new JSONModel({
          values: []
        });
        this.model.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
        this._oValueStateMessage = new ValueStateMessage(this);
      },

      exit: function () {
        if (this._oValueStateMessage) {
          this._oValueStateMessage.destroy();
        }

        this._oValueStateMessage = null;
      },

      onAfterRendering: function () {
        // set the LicenseCodeType as type for the controls binding
        var type = new LicenseCodeType();
        type.setErrorMsg(this.getValueStateText());
        type.setChunkCount(this.getControlCount())
        type.setChunkLength(this.getSingleControlLength())
        this.getBinding('value').setType(type);
        // create the controls
        this.getControls();
      },

      onfocusin: function () {
        if (this.getValueState() !== ValueState.None) {
          if (this._oValueStateMessage) {
            this._oValueStateMessage.open();
          }
        }
      },

      onfocusout: function () {
        if (this._oValueStateMessage) {
          this._oValueStateMessage.close();
        }
      },

      /**
       * Gets the DOM element reference where the message popup is attached.
       *
       * @returns {object} The DOM element reference where the message popup is attached
       * @protected
       */
      getDomRefForValueStateMessage: function () {
        return this.getFocusDomRef();
      },

      getFocusDomRef: function () {
        return this.getDomRef();
      },

      /**
       * Create the inner controls (input fields) and save them in the innerControls array (instance variable)
       * The creation is only done once.
       */
      getControls: function () {
        if (!this.innerControls || (this.innerControls.length === 0 && this.getControlCount() > 0)) {
          var controls = [];
          var values = this._sliceValue(this._getValueInternal(), this.getSingleControlLength());
          for (var i = 0; i < this.getControlCount(); i++) {
            this.model.setProperty('/value' + i, values[i]);
          }
          this.model.setProperty('values', values);
          for (var i = 0; i < this.getControlCount(); i++) {
            var chunkValue = values[i] ? values[i] : '';
            var inputCtrl = new Input({
              value: {
                path: '/value' + i,
                type: 'sap.ui.model.type.String',
                constraints: { minLength: this.getSingleControlLength(), maxLength: this.getSingleControlLength() }
              },
              maxLength: this.getSingleControlLength(),
              required: true,
              width: this.getInputFieldLength() + 'rem',
              textAlign: 'Center'
            });
            inputCtrl.addStyleClass('sapUiResponsiveContentPadding');
            inputCtrl.setModel(this.model);
            inputCtrl.setFieldGroupIds(['licenseCodeFieldGroup']);
            inputCtrl.attachValidateFieldGroup(this._inputChanged, this);
            inputCtrl.attachLiveChange(this._inputLiveChanged, this);
            controls.push(inputCtrl);
          }
          this.innerControls = controls;
        }
        return this.innerControls;
      },

      /**
       * The input field length is calculated with experimentally determined values
       * TODO: do we have a value for the width of a character in a font?
       */
      getInputFieldLength: function () {
        if (this.getSingleControlLength() < 4) {
          return this.getSingleControlLength() * 1.15
        }
        if (this.getSingleControlLength() < 6) {
          return this.getSingleControlLength() * 1.02
        }
        if (this.getSingleControlLength() < 8) {
          return this.getSingleControlLength() * 1.002
        }
        return this.getSingleControlLength()
      },

      /**
       * Getter for value property
       */
      getValue: function () {
        return this._getValueInternal();
      },

      /**
       * Pulls the values of the inner controls (input fields) and joins them into one
       * string that is returned by this method
       */
      _getValueInternal: function () {
        var chunks = [];
        if (this.innerControls) {
          for (var i = 0; i < this.innerControls.length; i++) {
            var singleValue = this.innerControls[i].getValue();
            for (var j = singleValue.length; j < this.getSingleControlLength(); j++) {
              singleValue += ' ';
            }
            chunks.push(singleValue);
          }
        }
        return chunks.join('');
      },

      /**
       * Slices the value of this control into n chunks with chunkLength length and returns
       * the resulting array.
       * @param {*} value the string that needs to be sliced
       * @param {*} chunkLength the length of each chunk
       */
      _sliceValue: function (value, chunkLength) {
        var retArr = [];
        var iterations = Math.floor(value.length / chunkLength) + 1;
        for (var i = 0; i < iterations; i++) {
          var chunk = value.substr(i * chunkLength, chunkLength);
          retArr.push(chunk);
        }
        var count = retArr.length;
        for (var i = count; i < this.getControlCount(); i++) {
          retArr.push('');
        }
        return retArr;
      },

      /**
       * Event handler for the changed event of the inner controls (input fields)
       * TODO: maybe we should use this event in favour to liveChange??
       * @param {*} oEvent
       */
      _inputChanged: function (oEvent) {
        //console.log(JSON.stringify(oEvent))
      },

      /**
       * Event handler for the liveChanged event of the inner controls (input fields)
       * Combines the values of all inner controls and sets the value property of this control, resp. of the
       * outer model property of this control
       * @param {*} oEvent
       */
      _inputLiveChanged: function (oEvent) {
        var chunkNo = oEvent
          .getSource()
          .getBinding('value')
          .getPath()
          .charAt(oEvent.getSource().getBinding('value').getPath().length - 1);
        let curValueArr = this._getValueInternal().split('');
        for (let i = 0; i < oEvent.getParameter('newValue').length; i++) {
          curValueArr[chunkNo * this.getSingleControlLength() + i] = oEvent.getParameter('newValue').charAt(i);
        }
        this.getModel().setProperty(this.getBindingPath('value'), curValueArr.join(''));
      },

      /**
       * setter for property valueState
       * @param {*} sValueState 
       */
      setValueState: function (sValueState) {
        var sOldValueState = this.getValueState();
        this.setProperty('valueState', sValueState, true);

        this.rerender()

        // get the value back in case of invalid value
        sValueState = this.getValueState();
        if (sValueState === sOldValueState) {
          return this;
        }

        var oDomRef = this.getDomRef();

        if (!oDomRef) {
          return this;
        }

        return this;
      }
    });

    return LicenseCodeControl;
  }
);
