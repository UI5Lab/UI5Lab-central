sap.ui.require([
  'jquery.sap.global',
  'sap/ui/core/ValueState',
  'sap/m/List',
  'sap/m/ResponsivePopover',
  'sap/m/StandardListItem',
  'openui5/password/Password',
  'test/unit/MemoryLeakCheck'
], function(jQuery, ValueState, List, ResponsivePopover, StandardListItem, Password, MemoryLeakCheck) {
  'use strict';

  function createPasswordHelper() {
    let password = new Password();
    password.placeAt('qunit-fixture');
    sap.ui.getCore().applyChanges();
    return password;
  }

  const { test } = QUnit;
  const sandbox = (sinon.createSandbox) ? sinon.createSandbox() : sinon.sandbox.create();
  const resourceBundle = sap.ui.getCore().getLibraryResourceBundle('openui5.password');

  QUnit.module('Password', function() {
    QUnit.module('Password basics', () => {
      test('Should instantiate the control with defaults', (assert) => {
        const password = new Password();
        assert.strictEqual(password.getValue(), '');
        assert.strictEqual(password.getRequireNumbers(), true);
        assert.strictEqual(password.getRequireLetters(), true);
        assert.strictEqual(password.getRequireSymbols(), true);
        assert.strictEqual(password.getRequireLowercase(), true);
        assert.strictEqual(password.getRequireUppercase(), true);
        assert.strictEqual(password.getMinLength(), 0);
        assert.strictEqual(password.getMaxLength(), 0);
        assert.strictEqual(password._popover, undefined);
      });
    });


    QUnit.module('Password properties', () => {
      test('Should get/set properties', (assert) => {
        const password = createPasswordHelper();
        password.setWidth();
        assert.strictEqual(password.getWidth(), '100%');
        password.setWidth('42%');
        assert.strictEqual(password.getWidth(), '42%');
        password.destroy();

        const password2 = new Password();
        password2.setEnabled(false);
        password2.placeAt('qunit-fixture');
        sap.ui.getCore().applyChanges();
        assert.strictEqual(jQuery('#' + password2.getId() + '-inner').prop('readonly'), true);
        password2.destroy();
      });
    });



    QUnit.module('_calculateScore()', () => {
      test('Should load library responsible for the calculation', (assert) => {
        assert.strictEqual(zxcvbn instanceof Function, true);
      });

      test('Should calculate password strength and return score', (assert) => {
        const password = new Password();
        assert.strictEqual(password._calculateScore(), 0);
        assert.strictEqual(password._calculateScore('123456'), 0);
        assert.strictEqual(password._calculateScore('abcd12345'), 1);
        assert.strictEqual(password._calculateScore('@Nac123!'), 2);
        assert.strictEqual(password._calculateScore('@Nac123!P2'), 3);
        assert.strictEqual(password._calculateScore('@Nac123!P2$#'), 4);
      });
    });


    QUnit.module('_setStatus()', () => {
      test('Should set status for password input element', (assert) => {
        const password = new Password();
        password._setStatus(0);
        assert.strictEqual(password.getValueState(), ValueState.Error);
        assert.strictEqual(password.getValueStateText(), resourceBundle.getText('PASSWORD_IS_VERY_WEAK'));
      });
    });


    QUnit.module('_getStatus()', () => {
      test('Should return default status for a not expected score', (assert) => {
        const password = new Password();
        const score0 = password._getStatus();
        const score1 = password._getStatus(5);
        assert.strictEqual(score0.state, ValueState.None);
        assert.strictEqual(score0.text, '');
        assert.strictEqual(score1.state, ValueState.None);
        assert.strictEqual(score1.text, '');
      });

      test('Should return error status for a given score', (assert) => {
        const password = new Password();
        const score0 = password._getStatus(0);
        const score1 = password._getStatus(1);
        assert.strictEqual(score0.state, ValueState.Error);
        assert.strictEqual(score0.text, resourceBundle.getText('PASSWORD_IS_VERY_WEAK'));
        assert.strictEqual(score1.state, ValueState.Error);
        assert.strictEqual(score1.text, resourceBundle.getText('PASSWORD_IS_WEAK'));
      });

      test('Should return warning status for a given score', (assert) => {
        const password = new Password();
        const score2 = password._getStatus(2);
        assert.strictEqual(score2.state, ValueState.Warning);
        assert.strictEqual(score2.text, resourceBundle.getText('PASSWORD_IS_NOT_STRONG_ENOUGH'));
      });

      test('Should return success status for a given score', (assert) => {
        const password = new Password();
        const score3 = password._getStatus(3);
        const score4 = password._getStatus(4);
        assert.strictEqual(score3.state, ValueState.Success);
        assert.strictEqual(score3.text, resourceBundle.getText('PASSWORD_IS_STRONG'));
        assert.strictEqual(score4.state, ValueState.Success);
        assert.strictEqual(score4.text, resourceBundle.getText('PASSWORD_IS_VERY_STRONG'));
      });
    });


    QUnit.module('_getPasswordErrors()', () => {
      test('Should fail because it requires a number', (assert) => {
        const password = new Password({
          requireNumbers: true,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false
        });
        const expectedInfo = '[0-9]';
        let value = 'abcde';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
        value = 'abcde!@#$';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it requires a letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false
        });
        const expectedInfo = '[a-z , A-Z]';
        let value = '123456';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
        value = '1321 !@#$';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it requires a lowercase letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: true,
          requireUppercase: false
        });
        let value = 'ABCDE';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), '[a-z]');
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it requires an uppercase letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: true
        });
        let value = 'abcde';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), '[A-Z]');
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it requires a special symbol', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: true,
          requireLowercase: false,
          requireUppercase: false
        });
        const expectedInfo = '[!, @, #, $, %, &...]';
        let value = 'abcde';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
        value = '123456';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
        value = 'ABce123';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it limits the minimum length', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false,
          minLength: 10
        });
        const expectedInfo = password.getMinLength() + ' characters';
        let value = 'abcde1234';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should fail because it limits the maximum length', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false,
          maxLength: 10
        });
        const expectedInfo = password.getMaxLength() + ' characters';
        let value = 'abcde123456';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 1);
        errors.forEach((err) => {
          assert.strictEqual(err.getInfo(), expectedInfo);
          assert.strictEqual(err.getInfoState(), ValueState.Error);
        });
      });

      test('Should pass because it requires a number', (assert) => {
        const password = new Password({
          requireNumbers: true,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false
        });
        let value = 'abcde1';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = '123456';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = '$@123adsfa456a';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it requires a letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false
        });
        let value = 'abcde';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = 'ABCDE';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = 'abc123DEF!@#';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it requires a lowercase letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: true,
          requireUppercase: false
        });
        let value = 'abcde';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it requires an uppercase letter', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: true
        });
        let value = 'ABCDE';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it requires a symbol', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: true,
          requireLowercase: false,
          requireUppercase: false
        });
        let value = '!@#$%';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = '123$456';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = 'asdf#%ttyty';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = '$@123adsfa4DD%&56a';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it limits the minimum length', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false,
          minLength: 10
        });
        let value = 'abcde12345';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = 'abcde12345$';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });

      test('Should pass because it limits the maximum length', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false,
          maxLength: 10
        });
        let value = 'abcde1234';
        let errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
        value = 'abcde12345';
        errors = password._getPasswordErrors(value);
        assert.strictEqual(errors.length, 0);
      });
    });


    QUnit.module('_createPopover()', () => {
      test('Should instantiate a popover', (assert) => {
        const password = new Password();
        password._createPopover();
        assert.strictEqual(password._popover instanceof ResponsivePopover, true);
        assert.strictEqual(password._popover.getId(), password.getId() + '-popover');
        assert.strictEqual(password._popover.getContent()[0] instanceof List, true);
      });

    });


    QUnit.module('_getPopover()', () => {
      test('Should return a popover instance', (assert) => {
        const password = new Password();
        const oPopover = password._getPopover();
        assert.strictEqual(oPopover instanceof ResponsivePopover, true);
        assert.strictEqual(oPopover.getId(), password.getId() + '-popover');
        assert.strictEqual(password._popover instanceof ResponsivePopover, oPopover instanceof ResponsivePopover);
        assert.strictEqual(password._popover.getId(), oPopover.getId());
        assert.strictEqual(password._popover.getContent()[0].getItems().length, 0);
        for (let i = 0; i < 5; i++) {
          assert.strictEqual(oPopover.getId(), password._getPopover().getId());
        }
      });

      test('Should return a popover instance with errors', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: true,
          requireUppercase: false
        });
        let value = '12345';
        let errors = password._getPasswordErrors(value);
        let popover = password._getPopover(errors);
        assert.strictEqual(popover.getContent()[0].getItems().length, 2);
      });
    });


    QUnit.module('_addPasswordErrorsToPopover()', () => {
      test('Should add messages to a list in a popover', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: true,
          requireSymbols: false,
          requireLowercase: true,
          requireUppercase: false
        });
        let value = '12345';
        let errors = password._getPasswordErrors(value);
        let oPopover = password._getPopover();
        assert.strictEqual(oPopover.getContent()[0].getItems().length, 0);
        for (let i = 0; i < 5; i++) {
          password._addPasswordErrorsToPopover(errors);
          assert.strictEqual(oPopover.getContent()[0].getItems().length, 2);
          assert.strictEqual(password._popover.getContent()[0].getItems()[0] instanceof StandardListItem, true);
        }
      });
    });



    QUnit.module('_showPasswordErrors()', () => {
      test('Should open a popover', (assert) => {
        const password = new Password();
        password.placeAt('qunit-fixture');
        sap.ui.getCore().applyChanges();
        password._showPasswordErrors();
        assert.notStrictEqual(password._getPopover(), undefined);
        assert.strictEqual(password._getPopover().isOpen(), true);
        assert.strictEqual(password.getValueState(), ValueState.Error);
        password.destroy();
      });

      test('Should not open a popover', (assert) => {
        const password = new Password({
          requireNumbers: false,
          requireLetters: false,
          requireSymbols: false,
          requireLowercase: false,
          requireUppercase: false
        });
        password.placeAt('qunit-fixture');
        sap.ui.getCore().applyChanges();
        password._showPasswordErrors();
        assert.notStrictEqual(password._getPopover(), undefined);
        assert.strictEqual(password._getPopover().isOpen(), false);
        assert.strictEqual(password.getValueState(), ValueState.Success);
        password.destroy();
      });
    });


    QUnit.module('exit()', () => {
      test('Should destroy instances when exit', (assert) => {
        const password = createPasswordHelper();
        password._getPopover();
        password.exit();
        assert.strictEqual(password._popover, null);
        password.destroy();
      });
    });


    QUnit.module('oninput()', {
      afterEach: () => {
        sandbox.restore();
      }
    }, () => {
      test('Should fire oninput event', (assert) => {
        const spy = sandbox.spy(Password.prototype, 'oninput');
        const password = createPasswordHelper();
        password.setValue('abcd12345');
        jQuery('#' + password.getId()).trigger('input');
        assert.strictEqual(password.getScore(), 1);
        assert.strictEqual(spy.callCount, 1);
        password.destroy();
      });

      test('Should fire oninput event marked as invalid', (assert) => {
        const spy = sandbox.spy(Password.prototype, 'oninput');
        const fakeEvent = {
          isMarked: () => 'invalid'
        };
        const password = createPasswordHelper();
        password.setValue('abcd12345');
        password.oninput(fakeEvent);
        assert.strictEqual(password.getScore(), 0);
        assert.strictEqual(spy.callCount, 1);
        password.destroy();
      });
    });


    QUnit.module('onfocusin()', {
      afterEach: () => {
        sandbox.restore();
      }
    }, () => {
      test('Should fire onfocusin event', (assert) => {
        const spy = sandbox.spy(Password.prototype, 'onfocusin');
        const password = createPasswordHelper();
        const passwordDomRef = jQuery('#' + password.getId());
        passwordDomRef.trigger('focusin');
        assert.strictEqual(passwordDomRef.hasClass('sapMInputFocused'), true);
        assert.strictEqual(password._getPopover().isOpen(), false);
        passwordDomRef.trigger('focusout');
        passwordDomRef.trigger('focusin');
        assert.strictEqual(password._getPopover().isOpen(), false);
        assert.strictEqual(spy.callCount, 2);
        password.destroy();
      });
    });


    QUnit.module('onfocusout()', {
      afterEach: () => {
        sandbox.restore();
      }
    }, () => {
      test('Should fire onfocusout event', (assert) => {
        const spy = sandbox.spy(Password.prototype, 'onfocusout');
        const password = createPasswordHelper();
        const passwordDomRef = jQuery('#' + password.getId());
        password.focus();
        passwordDomRef.trigger('focusout');
        assert.strictEqual(passwordDomRef.hasClass('sapMInputFocused'), false);
        assert.strictEqual(spy.callCount, 1);
        password.destroy();
      });
    });


    QUnit.module('onsapfocusleave()', {
      afterEach: () => {
        sandbox.restore();
      }
    }, () => {
      test('Should fire onsapfocusleave event', (assert) => {
        const spy = sandbox.spy(Password.prototype, 'onsapfocusleave');
        const password = createPasswordHelper();
        password.focus();
        password.onsapfocusleave();
        assert.notStrictEqual(password._getPopover(), undefined);
        assert.strictEqual(password._getPopover().isOpen(), true);
        assert.strictEqual(spy.callCount, 1);
        password.destroy();
      });
    });


    QUnit.module('Memory Leak Check', () => {
      MemoryLeakCheck.checkControl('Password', function() {
        return new Password();
      });
    });
  });
});
