sap.ui.require([
  'sap/m/Title',
  'sap/m/Text',
  'sap/m/Page',
  'sap/m/PlacementType',
  'openui5/tour/Tour',
  'openui5/tour/TourStep',
  'test/unit/MemoryLeakCheck'
], function(Title, Text, Page, PlacementType, Tour, TourStep, MemoryLeakCheck) {
  'use strict';

  let target = {};

  function buildTarget() {
    const target = new Text();
    target.placeAt('content');
    sap.ui.getCore().applyChanges();
    return target;
  }

  function buildTourStep() {
    return new TourStep({
      content: new Text({ text: 'Hey! It is a tour!' }),
      target: target,
      title: 'Test TourStep'
    });
  }

  const { test } = QUnit;

  QUnit.module('TourStep', {
    after: function () {
      target.destroy();
      target = null;
    },
    before: function () {
      target = buildTarget();
    }
  }, function() {
    QUnit.module('constructor', () => {
      test('Should instantiate the control with default values', (assert) => {
        const tourStep = buildTourStep();
        assert.deepEqual(tourStep.getTitle(), 'Test TourStep');
        assert.deepEqual(tourStep._isFirstStep, false);
        assert.deepEqual(tourStep._isLastStep, false);
        assert.deepEqual(tourStep.getPlacement(), PlacementType.PreferredTopOrFlip);
        tourStep.destroy();
      });
    });

    QUnit.module('open', () => {
      test('Should open the control', (assert) => {
        const tourStep = buildTourStep();
        tourStep.open();
        assert.deepEqual(tourStep.getAggregation('_popup').isOpen(), true);
        tourStep.destroy();
      });

      test('Should raise an error when opening the control without a target', (assert) => {
        let errorRaised;
        try {
          const tourStep = new TourStep();
          tourStep.open();

        } catch (err) {
          errorRaised = err;
        }
        assert.deepEqual(errorRaised instanceof Error, true);
        assert.deepEqual(errorRaised.toString(), 'Error: The step you are trying to open has no target assigned.');
      });
    });


    QUnit.module('close', () => {
      test('Should close the control', (assert) => {
        const tourStep = buildTourStep();
        tourStep.open();
        tourStep.close();
        const done = assert.async();
        setTimeout(function() {
          assert.deepEqual(tourStep.getAggregation('_popup').isOpen(), false);
          done();
          tourStep.destroy();
        }, 500);
      });
    });


    QUnit.module('setIsFirstStep', () => {
      test('Should set control as First Step', (assert) => {
        const tourStep = buildTourStep();
        tourStep.setIsFirstStep(true);
        assert.deepEqual(tourStep._isFirstStep, true);
        tourStep.destroy();
      });
    });


    QUnit.module('setIsLastStep', () => {
      test('Should set control as First Step', (assert) => {
        const tourStep = buildTourStep();
        tourStep.setIsLastStep(true);
        assert.deepEqual(tourStep._isLastStep, true);
        tourStep.destroy();
      });
    });


    QUnit.module('setIsLastStep', () => {
      test('Should set control as First Step', (assert) => {
        const tourStep = buildTourStep();
        tourStep.setIsLastStep(true);
        assert.deepEqual(tourStep._isLastStep, true);
        tourStep.destroy();
      });
    });


    QUnit.module('_getPopup', () => {
      test('Should set popup with both buttons enabled', (assert) => {
        const tourStep = buildTourStep();
        const popup = tourStep._getPopup();
        assert.deepEqual(popup.getBeginButton().getEnabled(), true);
        assert.deepEqual(popup.getEndButton().getEnabled(), true);
        tourStep.destroy();
      });

      test('Should set popup as First Step', (assert) => {
        const tourStep = buildTourStep();
        tourStep.setIsFirstStep(true);
        const popup = tourStep._getPopup();
        assert.deepEqual(popup.getBeginButton().getEnabled(), false);
        assert.deepEqual(popup.getEndButton().getEnabled(), true);
        tourStep.destroy();
      });

      test('Should set popup as Last Step', (assert) => {
        const tourStep = buildTourStep();
        tourStep.setIsLastStep(true);
        const popup = tourStep._getPopup();
        assert.deepEqual(popup.getBeginButton().getEnabled(), true);
        assert.deepEqual(popup.getEndButton().getEnabled(), true);
        tourStep.destroy();
      });
    });


    QUnit.module('Memory Leak Check', () => {
      MemoryLeakCheck.checkControl('TourStep', function() {
        return new Tour({steps: [buildTourStep(), buildTourStep()] });
      }, true);
    });
  });
});
