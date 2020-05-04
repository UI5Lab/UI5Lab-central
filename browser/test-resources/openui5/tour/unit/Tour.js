sap.ui.require([
  'sap/ui/core/mvc/XMLView',
  'openui5/tour/Tour',
  'openui5/tour/TourStep',
  'test/unit/MemoryLeakCheck'
], function(XMLView, Tour, TourStep, MemoryLeakCheck) {
  'use strict';

  let viewForTest = {};
  const viewDefinition = '<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><Page id="page"><Panel id="panel"><Title text="Title 1"/></Panel></Page></mvc:View>';

  function createTourStep(target) {
    return new TourStep({
      content: new sap.m.Text({ text: 'Hey! It is a tour!' }),
      target: target,
      title: 'Tour step...'
    });
  }

  const { test } = QUnit;

  QUnit.module('Tour', {
    beforeEach: function() {
      return XMLView.create({
        definition: viewDefinition
      })
        .then((viewCreated) => {
          viewForTest = viewCreated;
          viewForTest.placeAt('qunit-fixture');
          sap.ui.getCore().applyChanges();
        });
    },
    afterEach: function() {
      viewForTest.destroy();
      viewForTest = null;
    }
  }, function() {
    QUnit.module('constructor', () => {
      test('Should instantiate the control', (assert) => {
        const tour = new Tour();
        assert.deepEqual(tour._getCurrentStepIndex(), 0);
        assert.deepEqual(tour.getSteps().length, 0);
      });
      test('Should instantiate the control with 2 steps', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        assert.deepEqual(tour._getCurrentStepIndex(), 0);
        assert.deepEqual(tour.getSteps().length, 2);
      });
    });

    QUnit.module('_getCurrentStepIndex', () => {
      test('Should return the current step index', (assert) => {
        const tour = new Tour();
        tour._setCurrentStepIndex(10);
        assert.deepEqual(tour._getCurrentStepIndex(), 10);
      });
    });

    QUnit.module('_setCurrentStepIndex', () => {
      test('Should set the current step index', (assert) => {
        const tour = new Tour();
        tour._setCurrentStepIndex(10);
        assert.deepEqual(tour._getCurrentStepIndex(), 10);
      });
    });

    QUnit.module('_isValidStepIndex', () => {
      test('Should return step index is valid', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        assert.deepEqual(tour._isValidStepIndex(1), true);
      });

      test('Should return step index is invalid for empty steps', (assert) => {
        const tour = new Tour();
        try {
          tour._isValidStepIndex(0);
          assert.deepEqual(true, false, 'Should never be executed!');
        } catch (e) {
          assert.deepEqual(e instanceof Error, true);
        }
      });

      test('Should return step index is invalid for a lower value', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        try {
          tour._isValidStepIndex(-1);
          assert.deepEqual(true, false, 'Should never be executed!');
        } catch (e) {
          assert.deepEqual(e instanceof Error, true);
        }
      });

      test('Should return step index is invalid for a higher value', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        try {
          tour._isValidStepIndex(3);
          assert.deepEqual(true, false, 'Should never be executed!');
        } catch (e) {
          assert.deepEqual(e instanceof Error, true);
        }
      });
    });

    QUnit.module('_goToStep', () => {
      test('Should close current step, set new current step and open it', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour._goToStep(1);
        const step = tour.getSteps()[1];
        step.open();
        assert.deepEqual(step.getAggregation('_popup').isOpen(), true);
        assert.deepEqual(tour._getCurrentStepIndex(), 1);
        tour.destroy();
      });
    });

    QUnit.module('_setFirstStep', () => {
      test('Should set the first step', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        tour._setFirstStep();
        assert.deepEqual(tour.getSteps()[0]._isFirstStep, true);
        assert.deepEqual(tour.getSteps()[1]._isFirstStep, false);
      });
    });

    QUnit.module('_setLastStep', () => {
      test('Should set the last step', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(), createTourStep()]
        });
        tour._setLastStep();
        assert.deepEqual(tour.getSteps()[0]._isLastStep, false);
        assert.deepEqual(tour.getSteps()[1]._isLastStep, true);
      });
    });

    QUnit.module('start', () => {
      test('Should open first step and start tour', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep()]
        });
        tour.start();
        assert.deepEqual(tour._getCurrentStepIndex(), 0);
        assert.deepEqual(tour.getSteps()[0].getAggregation('_popup').isOpen(), true);
        tour.destroy();
      });
    });

    QUnit.module('complete', () => {
      test('Should close current step and finish tour', (assert) => {
        const done = assert.async();
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour.start();
        tour.nextStep();
        tour.complete();
        assert.deepEqual(tour._getCurrentStepIndex(), 0);
        setTimeout(() => {
          assert.deepEqual(tour.getSteps()[0].getAggregation('_popup').isOpen(), false);
          tour.destroy();
          done();
        }, 500);
      });
    });

    QUnit.module('nextStep', () => {
      test('Should open the next step', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour.start();
        tour.nextStep();
        assert.deepEqual(tour._getCurrentStepIndex(), 1);
        tour.destroy();
      });
      test('Should fail when next step does not exist', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour.start();
        try {
          tour.nextStep();
          tour.nextStep();
          assert.deepEqual(false, true, 'Should not be executed...');
        } catch (e) {
          assert.deepEqual(e instanceof Error, true);
        }
        tour.destroy();
      });
    });

    QUnit.module('previousStep', () => {
      test('Should open the previous step', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour.start();
        tour.nextStep();
        tour.previousStep();

        const done = assert.async();
        setTimeout(function() {
          assert.deepEqual(tour._getCurrentStepIndex(), 0);
          done();
          tour.destroy();
        }, 500);
      });

      test('Should fail when previous step does not exist', (assert) => {
        const tour = new Tour({
          steps: [createTourStep(viewForTest.byId('panel')), createTourStep(viewForTest.byId('panel'))]
        });
        tour.start();
        try {
          tour.previousStep();
          assert.deepEqual(false, true, 'Should not be executed...');
        } catch (e) {
          assert.deepEqual(e instanceof Error, true);
        }
        tour.destroy();
      });
    });

    QUnit.module('Memory Leak Check', () => {
      MemoryLeakCheck.checkControl('Tour', function() {
        return new Tour();
      }, true);
    });
  });
});
