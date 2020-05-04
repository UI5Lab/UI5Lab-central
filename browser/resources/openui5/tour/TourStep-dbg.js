sap.ui.define([
  'sap/m/Button',
  'sap/m/ButtonType',
  'sap/m/PlacementType',
  'sap/m/ResponsivePopover',
  'sap/ui/core/Control'
], function(Button, ButtonType, PlacementType, ResponsivePopover, Control) {
  'use strict';

  const TourStep = Control.extend('openui5.tour.TourStep', {
    metadata: {
      library: 'openui5.tour',
      properties: {
        /**
         * Determines the title of the step. The title is visualized in the dialog control.
         */
        title: {type: 'string', group: 'Appearance', defaultValue: ''},
        /**
         * Determines the icon that is displayed for this step.
         * This property only takes effect on phone. Please see the documentation sap.m.Dialog#icon.
         */
        icon: {type: 'sap.ui.core.URI', group: 'Appearance', defaultValue: ''},
        /**
         * Determines the UI5/DOM object which will be the reference for the dialog.
         */
        target: {type: 'object', group: 'Behavior', defaultValue: ''},
        /**
         * Determines where the dialog will be placed.
         * This property only takes effect on desktop or tablet. Please see the documentation sap.m.Popover#placement.
         */
        placement: {type : 'sap.m.PlacementType', group : 'Behavior', defaultValue : PlacementType.PreferredTopOrFlip}
      },
      defaultAggregation: 'content',
      aggregations: {
        /**
         * Content is supported by both variants. Please see the documentation on sap.m.Popover#content and sap.m.Dialog#content
         */
        content: {type: 'sap.ui.core.Control', multiple: false},
        /**
         * The internal popup instance which is either a dialog on phone or a popover on the rest of platforms
         */
        _popup: {type: 'sap.ui.core.Control', multiple: false, visibility: 'hidden'}
      }
    }
  });

  /**
   * Initializes step object
   * @public
   */
  TourStep.prototype.init = function () {
    this.setIsFirstStep(false);
    this.setIsLastStep(false);
  };

  /**
   * Destroys all content on tour step
   * @public
   */
  TourStep.prototype.exit = function () {
  };

  /**
   * Opens dialog step
   * @public
   */
  TourStep.prototype.open = function () {
    if (!this.getTarget()) {
      throw new Error('The step you are trying to open has no target assigned.');
    }
    if (!this.getAggregation('_popup')) {
      this.setAggregation('_popup', this._getPopup());
    }
    this.getTarget().getDomRef().scrollIntoView();
    this.getAggregation('_popup').openBy(this.getTarget());
  };

  /**
   * Closes dialog step
   * @public
   */
  TourStep.prototype.close = function () {
    if (this.getAggregation('_popup') && this.getAggregation('_popup').isOpen()) {
      this.getAggregation('_popup').close();
    }
  };

  TourStep.prototype.setIsFirstStep = function (isFirstStep) {
    this._isFirstStep = (isFirstStep);
  };

  TourStep.prototype.setIsLastStep = function (isLastStep) {
    this._isLastStep = (isLastStep);
  };

  TourStep.prototype._setFirstStep = function (popup) {
    popup.getBeginButton().setEnabled(false);
  };

  TourStep.prototype._setLastStep = function (popup) {
    this._setFinishButton(popup);
  };

  TourStep.prototype._getPopup = function() {
    if (this.getContent()) {
      this.getContent().addStyleClass('sapUiSmallMargin');
    }
    const popup = this._createPopup(this.getId(), this.getPlacement(), this.getTitle(), this.getIcon(), this.getContent());
    this._setPreviousButton(popup);
    if (this._isFirstStep) {
      this._setFirstStep(popup);
    }
    if (this._isLastStep) {
      this._setLastStep(popup);
    } else {
      this._setNextButton(popup);
    }
    return popup;
  };

  TourStep.prototype._setFinishButton = function (popup) {
    const button = this._createFinishButton(popup.getId(), this._finishStep.bind(this));
    popup.setEndButton(button);
    button.setType(ButtonType.Emphasized);
  };

  TourStep.prototype._setNextButton = function (popup) {
    const button = this._createNextButton(popup.getId(), this._nextStep.bind(this));
    popup.setEndButton(button);
    button.setType(ButtonType.Emphasized);
  };

  TourStep.prototype._setPreviousButton = function (popup) {
    const button = this._createPreviousButton(popup.getId(), this._previousStep.bind(this));
    popup.setBeginButton(button);
  };

  TourStep.prototype._createPopup = function(tourStepId, placement, title, icon, content) {
    return new ResponsivePopover(tourStepId + '-popover', {
      modal: true,
      placement: placement,
      title: title,
      icon: icon,
      content: content
    });
  };

  TourStep.prototype._createFinishButton = function (popupId, handlePress) {
    return new Button(popupId + '-finishButton', {
      icon: 'sap-icon://accept',
      text: 'Done',
      //type: ButtonType.Accept,
      press: handlePress
    });
  };

  TourStep.prototype._createNextButton = function (popupId, handlePress) {
    return new Button(popupId + '-nextButton', {
      icon: 'sap-icon://open-command-field',
      text: 'Next',
      //type: ButtonType.Emphasized,
      press: handlePress
    });
  };

  TourStep.prototype._createPreviousButton = function (popupId, handlePress) {
    return new Button(popupId + '-previousButton', {
      icon: 'sap-icon://close-command-field',
      text: 'Back',
      press: handlePress
    });
  };

  /**
   * Validates the current step, and moves one step further.
   * @private
   */
  TourStep.prototype._nextStep = function () {
    this.getParent().nextStep();
  };

  /**
   * Discards the current step and goes one step back.
   * @private
   */
  TourStep.prototype._previousStep = function () {
    this.getParent().previousStep();
  };

  /**
   * Discards the current step and goes one step back.
   * @private
   */
  TourStep.prototype._finishStep = function () {
    this.getParent().complete();
  };

  return TourStep;
});
