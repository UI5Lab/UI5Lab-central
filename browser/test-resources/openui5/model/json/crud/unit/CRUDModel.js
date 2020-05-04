sap.ui.require([
  'sap/ui/model/json/JSONModel',
  'openui5/model/json/crud/CRUDModel'
], function(JSONModel, CRUDModel) {
  'use strict';

  const { test } = QUnit;
  const sandbox = (sinon.createSandbox) ? sinon.createSandbox() : sinon.sandbox.create();
  const serviceUrl = 'http://localhost:3000/api/';
  const urlPath1 = 'account/';
  const urlPath2 = 'account/12345';
  const propertyPath = '/Account';
  const mockPayload = { a: 1, b: 2, c: 3 };
  const startData = { a: 9, b: 8, c: 7, z: 0 };

  function mockResponseApi(ok, status) {
    return {
      ok: ok,
      status: status || 200,
      headers: { 'Content-type': 'application/json' },
      clone: function() {
        return this;
      },
      json: function() {
        return Promise.resolve(mockPayload);
      }
    };
  }

  QUnit.module('CRUDModel', {
    before: function() {
      sandbox.stub(window, 'fetch').returns(Promise.resolve(mockResponseApi(true)));
    },
    after: function() {
      sandbox.restore();
    }
  }, function() {
    QUnit.module('constructor', () => {
      test('Should instantiate the control', (assert) => {
        const model = new CRUDModel(serviceUrl);
        assert.strictEqual(model instanceof JSONModel, true);
        assert.strictEqual(model._serviceUrl, serviceUrl);
      });
    });

    QUnit.module('getFetchParameters', () => {
      test('Should return fetch parameters', (assert) => {
        const model = new CRUDModel(serviceUrl);
        assert.deepEqual(model.getFetchParameters(), model._fetchParameters);
      });
    });

    QUnit.module('setFetchParameters', () => {
      test('Should set fetch parameters', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const defaultFetchParameters = model.getFetchParameters();
        const newFetchParameters = { mode: 'CORS', credentials: 'include' };
        model.setFetchParameters(newFetchParameters);
        assert.deepEqual(model.getFetchParameters(), Object.assign(defaultFetchParameters, newFetchParameters));
      });
    });

    QUnit.module('getHttpMethods', () => {
      test('Should return HTTP methods for CRUD operations', (assert) => {
        const model = new CRUDModel(serviceUrl);
        assert.deepEqual(model.getHttpMethods(), model._httpMethods);
      });
    });

    QUnit.module('setHttpMethods', () => {
      test('Should set HTTP methods for CRUD operations', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const defaultHttpMethods = model.getHttpMethods();
        const newHttpMethods = { create: 'PUT', update: 'PATCH' };
        model.setHttpMethods(newHttpMethods);
        assert.deepEqual(model.getHttpMethods(), Object.assign(defaultHttpMethods, newHttpMethods));
      });
    });

    QUnit.module('create', () => {
      test('Should POST data to serviceUrl and create entry into the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const payload = Object.assign({}, mockPayload);
        return model.create(urlPath1, propertyPath, payload)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), mockPayload);
          });
      });

      test('Should POST data to serviceUrl, it does not update the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const payload = Object.assign({}, mockPayload);
        return model.create(urlPath1, '', payload)
          .then(function() {
            assert.deepEqual(model.getProperty('/'), {});
          });
      });

      test('Should POST data to root serviceUrl (no extra urlPath) and create entry into the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const payload = Object.assign({}, mockPayload);
        return model.create(null, propertyPath, payload)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), mockPayload);
          });
      });
    });

    QUnit.module('read', () => {
      test('Should GET data from serviceUrl and create entry into the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        return model.read(urlPath2, propertyPath)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), mockPayload);
          });
      });

      test('Should GET data from serviceUrl and update entry into the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, startData);
        return model.read(urlPath2, propertyPath)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), mockPayload);
          });
      });

      test('Should GET data from serviceUrl, it does not update the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        return model.read(urlPath2)
          .then(function() {
            assert.deepEqual(model.getProperty('/'), {});
          });
      });
    });

    QUnit.module('update', () => {
      test('Should PUT data to serviceUrl and update entry into the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const payload = Object.assign({}, mockPayload);
        model.setProperty(propertyPath, startData);
        return model.update(urlPath2, propertyPath, payload)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), Object.assign(startData, payload));
          });
      });

      test('Should PUT data to serviceUrl, it does not updated the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        const payload = Object.assign({}, mockPayload);
        model.setProperty(propertyPath, startData);
        return model.update(urlPath2, null, payload)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), startData);
          });
      });
    });

    QUnit.module('delete', () => {
      test('Should DELETE data from serviceUrl and delete from the model, entry is an object', (assert) => {
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, mockPayload);
        return model.delete(urlPath2, propertyPath)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), undefined);
          });
      });

      test('Should DELETE data from serviceUrl and delete from the model, entry is an array', (assert) => {
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, [mockPayload, startData]);
        return model.delete(urlPath2, propertyPath)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), [startData]);
          });
      });

      test('Should DELETE data from serviceUrl and delete from the model, entry is an object within an array', (assert) => {
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, [mockPayload, startData]);
        return model.delete(urlPath2, propertyPath + '/0')
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), [startData]);
          });
      });

      test('Should DELETE data from serviceUrl, it does not update the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, [mockPayload, startData]);
        return model.delete(urlPath2)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), [mockPayload, startData]);
          });
      });

      test('Should DELETE data from serviceUrl, it does not find the pathProperty in the model', (assert) => {
        const model = new CRUDModel(serviceUrl);
        return model.delete(urlPath2, propertyPath)
          .then(function() {
            assert.deepEqual(model.getProperty(propertyPath), undefined);
          });
      });

      test('Should fail when DELETE data from serviceUrl', (assert) => {
        sandbox.restore();
        sandbox.stub(window, 'fetch').returns(Promise.resolve(mockResponseApi(false, 401)));
        const model = new CRUDModel(serviceUrl);
        model.setProperty(propertyPath, mockPayload);
        return model.delete(urlPath2, propertyPath)
          .then(function() {
            assert.ok(false);
          })
          .catch(function() {
            assert.ok(true);
          });
      });
    });
  });
});
