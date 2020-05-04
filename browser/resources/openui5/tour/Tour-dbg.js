sap.ui.define([
  'sap/m/ResponsivePopover',
  'sap/ui/core/Control'
], function(ResponsivePopover, Control) {
  'use strict';

  const Tour = Control.extend('openui5.tour.Tour', {
    metadata: {
      library: 'openui5.tour',
      properties: {},
      defaultAggregation: 'steps',
      aggregations: {
        /**
         * The tour steps to be included in the control.
         */
        steps: {type: 'openui5.tour.TourStep', multiple: true, singularName: 'step'}
      },
      events: {
        /**
         * The started event is fired when the tour is started.
         */
        started: {
          parameters: {}
        },
        /**
         * The completed event is fired when the tour is completed.
         */
        completed: {
          parameters: {}
        },
        /**
         * The nextStep event is fired every time the next step is called.
         */
        nextStep: {
          parameters: {}
        },
        /**
         * The previousStep event is fired every time the previous step is called.
         */
        previousStep: {
          parameters: {}
        }
      }
    }
  });

  /**
   * Initialize tour object
   * @public
   */
  Tour.prototype.init = function () {
    this._currentStepIndex = 0;
  };

  /**
   * Starts the tour, opens dialog step 0
   * @public
   */
  Tour.prototype.start = function() {
    this._setFirstStep();
    this._setLastStep();
    this._setCurrentStepIndex(0);
    this._goToStep(this._getCurrentStepIndex());
    this.fireStarted();
  };

  /**
   * Completes tour object, closes dialog step
   * @public
   */
  Tour.prototype.complete = function() {
    this.getSteps()[this._getCurrentStepIndex()].close();
    //this._closeStep(this._getCurrentStepIndex());
    this._setCurrentStepIndex(0);
    this.fireCompleted();
  };

  /**
   * Goes to the next step.
   * @public
   */
  Tour.prototype.nextStep = function() {
    const nextStep = this._getCurrentStepIndex() + 1;
    this._goToStep(nextStep);
    this.fireNextStep();
  };

  /**
   * Goes to the previous step.
   * @public
   */
  Tour.prototype.previousStep = function() {
    const previousStep = this._getCurrentStepIndex() - 1;
    this._goToStep(previousStep);
    this.firePreviousStep();
  };

  /**
   * Returns the current step index
   * @returns {int} Current step index
   * @private
   */
  Tour.prototype._getCurrentStepIndex = function() {
    return this._currentStepIndex;
  };

  /**
   * Sets the current step index
   * @param {int} stepIndex The current step index
   * @private
   */
  Tour.prototype._setCurrentStepIndex = function(stepIndex) {
    this._currentStepIndex = stepIndex;
  };

  /**
   * Validates the given step.
   * @param {int} stepIndex The step index to be validated.
   * @returns {boolean} Returns if the step is valid.
   * @public
   */
  Tour.prototype._isValidStepIndex = function (stepIndex) {
    if (!this.getSteps()[stepIndex]) {
      throw new Error('Tour does not contain step index #' + stepIndex);
    }
    return true;
  };

  /**
   * Goes to the given step. The step must exist.
   * @param {int} stepIndex The step to go to.
   * @private
   */
  Tour.prototype._goToStep = function (stepIndex) {
    /*this._closeStep(this._getCurrentStepIndex());
    this._setCurrentStepIndex(stepIndex);
    this._openStep(stepIndex);*/

    if (this._isValidStepIndex(stepIndex)) {
      this.getSteps()[this._getCurrentStepIndex()].close();
      this._setCurrentStepIndex(stepIndex);
      this.getSteps()[stepIndex].open();
    }
  };

  /**
   * Sets the first step of the tour.
   * @private
   */
  Tour.prototype._setFirstStep = function() {
    const firstStep = 0;
    if (this._isValidStepIndex(firstStep)) {
      this.getSteps()[firstStep].setIsFirstStep(true);
    }
  };

  /**
   * Sets the last step of the tour.
   * @private
   */
  Tour.prototype._setLastStep = function() {
    const lastStep = this.getSteps().length - 1;
    if (this._isValidStepIndex(lastStep)) {
      this.getSteps()[lastStep].setIsLastStep(true);
    }
  };

  return Tour;
});
