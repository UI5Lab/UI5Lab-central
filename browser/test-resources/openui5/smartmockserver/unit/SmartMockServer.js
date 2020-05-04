sap.ui.define([
  'sap/ui/core/util/MockServer',
  'openui5/smartmockserver/SmartMockServer'
], function(MockServer, SmartMockServer) {
  'use strict';

  const entityNameWithoutSmartRules = 'Customer';
  const entityNameWithSmartRules = 'Employee';
  const entityNameWithSapSemantics = 'SAPSemanticEntity';
  const entityNameWithSmartMockServerAnnotations = 'SmartMockServerAnnotationsEntity';
  const mockServer = buildMockServer(true);

  function buildMockServer(withSmartRules) {
    const mockServerUrl = '/';
    const metadataUrl = '../testdata/metadata.xml';
    const server = new SmartMockServer({ rootUri: mockServerUrl });
    SmartMockServer.config({
      autoRespond: true,
      autoRespondAfter: 1
    });
    if (withSmartRules) {
      server.setSmartRules(getSmartRules());
      server.simulate(metadataUrl, { bGenerateMissingMockData: true });
    }
    server.start();
    return server;
  }

  function getSmartRules() {
    return [{
      entityName: entityNameWithSmartRules,
      properties: [
        {
          name: 'FirstName',
          fakerMethod: 'name.firstName'
        },
        {
          name: 'Address',
          fakerMethod: 'address.streetAddress'
        }
      ]
    }];
  }

  function getEntityType(entityName) {
    return mockServer._mEntityTypes[entityName];
  }


  const { test } = QUnit;

  QUnit.module('SmartMockServer', {
      after: function() {
        mockServer.destroy();
      }
    },
    function() {
      QUnit.module('constructor', () => {
        test('Should instantiate SmartMockServer', (assert) => {
          assert.deepEqual(mockServer instanceof MockServer, true);
        });
        test('Should start SmartMockServer', (assert) => {
          assert.deepEqual(mockServer.isStarted(), true);
        });
      });

      QUnit.module('_generateDataFromEntityOriginal', () => {
        test('Should generate dumb mock data', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          assert.deepEqual(mockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
        });
      });

      QUnit.module('_generateDataFromEntity', () => {
        test('Should generate smart mock data only for properties with Smart Rules assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const mockEntity = mockServer._generateDataFromEntity(entityType, 1);
          assert.ok(mockEntity.Address);
          assert.ok(mockEntity.FirstName);
          assert.ok(mockEntity.Country);
          assert.notEqual(mockEntity.Address, 'Address 1');
          assert.notEqual(mockEntity.FirstName, 'FirstName 1');
          assert.deepEqual(mockEntity.Country, 'Country 1');
        });

        test('Should generate dumb mock data because there are no Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntity(entityType, 1);
          assert.deepEqual(mockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
        });
      });

      QUnit.module('_generateDataWithSmartRules', () => {
        test('Should generate smart mock data only for properties with Smart Rules assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataWithSmartRules(entityType.name, mockEntity);
          assert.ok(smartMockEntity.Address);
          assert.ok(smartMockEntity.FirstName);
          assert.ok(smartMockEntity.Country);
          assert.notEqual(smartMockEntity.Address, 'Address 1');
          assert.notEqual(smartMockEntity.FirstName, 'FirstName 1');
          assert.deepEqual(smartMockEntity.Country, 'Country 1');
        });

        test('Should generate dumb mock data because there are no Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataWithSmartRules(entityType.name, mockEntity);
          assert.deepEqual(smartMockEntity.Address, 'Address 1');
          assert.deepEqual(smartMockEntity.CompanyName, 'CompanyName 1');
        });

        test('Should have no Smart Rules before calling _generateDataWithSmartRules', (assert) => {
          const server = buildMockServer(false);
          assert.deepEqual(server._smartRules, undefined);
          server.destroy();
        });

        test('Should have initial Smart Rules after calling _generateDataWithSmartRules', (assert) => {
          const server = buildMockServer(false);
          server._generateDataWithSmartRules(entityNameWithSmartRules, {});
          assert.deepEqual(server._smartRules, []);
          server.destroy();
        });

        test('Should return the mock entity with no changes when an error occurs', (assert) => {
          const server = buildMockServer(false);
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          server.setSmartRules('itShouldBeAnArray');
          const smartMockEntity = server._generateDataWithSmartRules(entityType.name, mockEntity);
          assert.deepEqual(mockEntity, smartMockEntity);
          server.destroy();
        });
      });

      QUnit.module('_generateDataFromEntityWithSmartRules', () => {
        test('Should generate smart mock data only for properties with Smart Rules assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSmartRules(entityType.name, mockEntity);
          assert.ok(smartMockEntity.Address);
          assert.ok(smartMockEntity.FirstName);
          assert.ok(mockEntity.Country);
          assert.notEqual(smartMockEntity.Address, 'Address 1');
          assert.notEqual(smartMockEntity.FirstName, 'FirstName 1');
          assert.deepEqual(mockEntity.Country, 'Country 1');
        });

        test('Should return the same received mock data, no changes', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSmartRules(entityType.name, mockEntity);
          assert.deepEqual(smartMockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
        });
      });

      QUnit.module('_generatePropertyValueWithSmartRules', () => {
        test('Should return a value', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const generatedValue = mockServer._generatePropertyValueWithSmartRules(entityType.name, 'Address');
          assert.ok(generatedValue);
          assert.notEqual(generatedValue, 'Address 1');
        });

        test('Should return an error', (assert) => {
          let errorRaised;
          try {
            const entityType = getEntityType(entityNameWithSmartRules);
            mockServer._generatePropertyValueWithSmartRules(entityType.name, 'Country');

          } catch (err) {
            errorRaised = err;
          }
          assert.deepEqual(errorRaised instanceof Error, true);
          assert.deepEqual(errorRaised.toString(), 'TypeError: Cannot read property \'fakerMethod\' of undefined');
        });
      });

      QUnit.module('_callFakerMethod', () => {
        test('Should call a Faker method and return a value', (assert) => {
          const generatedValue = mockServer._callFakerMethod('name.firstName');
          assert.ok(generatedValue);
        });

        test('Should call an invalid Faker method and return an error', (assert) => {
          let errorRaised;
          const fakerMethodInvalid = 'name.ThisFakerMethodDoesNotExist';
          try {
            mockServer._callFakerMethod(fakerMethodInvalid);

          } catch (err) {
            errorRaised = err;
          }
          assert.deepEqual(errorRaised instanceof Error, true);
          assert.deepEqual(errorRaised.toString(), 'Error: Invalid method: ' + fakerMethodInvalid);
        });
      });

      QUnit.module('_getSmartRulesEntity', () => {
        test('Should return undefined Smart Rules for an Entity without Smart Rules', (assert) => {
          const smartRules = mockServer._getSmartRulesEntity(entityNameWithoutSmartRules);
          assert.deepEqual(smartRules, undefined);
        });

        test('Should return Smart Rules assigned to an Entity', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const smartRules = mockServer._getSmartRulesEntity(entityType.name);
          assert.deepEqual(smartRules, getSmartRules()[0]);
        });
      });

      QUnit.module('_getSmartRulesEntityProperty', () => {
        test('Should return Smart Rules assigned to an Entity Property', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const smartRules = mockServer._getSmartRulesEntityProperty(entityType.name, 'Address');
          assert.deepEqual(smartRules, getSmartRules()[0].properties[1]);
        });

        test('Should return undefined Smart Rules for an Entity without Smart Rules', (assert) => {
          const smartRules = mockServer._getSmartRulesEntityProperty(entityNameWithoutSmartRules, 'Address');
          assert.deepEqual(smartRules, undefined);
        });

        test('Should return undefined Smart Rules for an Entity Property without Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const smartRules = mockServer._getSmartRulesEntityProperty(entityType.name, 'Country');
          assert.deepEqual(smartRules, undefined);
        });
      });

      QUnit.module('_hasSmartRulesEntity', () => {
        test('Should return true for an Entity with Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const hasSmartRules = mockServer._hasSmartRulesEntity(entityType.name);
          assert.deepEqual(hasSmartRules, true);
        });

        test('Should return false for an Entity without Smart Rules', (assert) => {
          const hasSmartRules = mockServer._hasSmartRulesEntity(entityNameWithoutSmartRules);
          assert.deepEqual(hasSmartRules, false);
        });
      });

      QUnit.module('_hasSmartRulesEntityProperty', () => {
        test('Should return true for an Entity Property with Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const hasSmartRules = mockServer._hasSmartRulesEntityProperty(entityType.name, 'Address');
          assert.deepEqual(hasSmartRules, true);
        });

        test('Should return false for an Entity Property without Smart Rules', (assert) => {
          const entityType = getEntityType(entityNameWithSmartRules);
          const hasSmartRules = mockServer._hasSmartRulesEntityProperty(entityType.name, 'Country');
          assert.deepEqual(hasSmartRules, false);
        });
      });

      QUnit.module('_getFakerMethodFromSapSemantics', () => {
        test('Should return the Faker method mapped to the SAP Semantics', (assert) => {
          assert.deepEqual(mockServer.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING instanceof Array, true);
          assert.deepEqual(mockServer.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING.length > 0, true);
          mockServer.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING.forEach(function(item) {
            const fakerMethod = mockServer._getFakerMethodFromSapSemantics(item.sapSemantics);
            assert.ok(fakerMethod);
          });
        });

        test('Should return undefined for SAP Semantics without a mapping', (assert) => {
          const sapSemanticsWithoutMapping = 'unit-of-measure';
          const mapping = mockServer._getFakerMethodFromSapSemantics(sapSemanticsWithoutMapping);
          assert.deepEqual(mapping, undefined);
        });
      });

      QUnit.module('_getEntityPropertiesWithSapSemanticsAnnotations', () => {
        test('Should return Entity Properties with a SAP Semantics Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSapSemantics);
          const propertiesWithSemantics = mockServer._getEntityPropertiesWithSapSemanticsAnnotations(entityType.name);
          assert.notEqual(propertiesWithSemantics.length, 0);
        });

        test('Should return none Entity Properties with a SAP Semantics Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const propertiesWithSemantics = mockServer._getEntityPropertiesWithSapSemanticsAnnotations(entityType.name);
          assert.deepEqual(propertiesWithSemantics.length, 0);
        });
      });

      QUnit.module('_generateDataFromEntityWithSapSemanticsAnnotations', () => {
        test('Should generate smart mock data only for properties with a SAP Semantics Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSapSemantics);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSapSemanticsAnnotations(entityType.name, mockEntity);
          assert.deepEqual(mockEntity.street, 'street 1');
          assert.deepEqual(mockEntity.givenname, 'givenname 1');
          assert.deepEqual(mockEntity.RegularField, 'RegularField 1');
          assert.deepEqual(smartMockEntity.RegularField, mockEntity.RegularField);
          assert.notEqual(smartMockEntity.street, mockEntity.street);
          assert.notEqual(smartMockEntity.givenname, mockEntity.givenname);
        });

        test('Should return the same received mock data, no changes', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSapSemanticsAnnotations(entityType.name, mockEntity);
          assert.deepEqual(mockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
          assert.deepEqual(smartMockEntity.Address, mockEntity.Address);
          assert.deepEqual(smartMockEntity.CompanyName, mockEntity.CompanyName);
        });
      });

      QUnit.module('_getEntityPropertiesWithSmartMockServerAnnotations', () => {
        test('Should return Entity Properties with a Smart MockServer Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSmartMockServerAnnotations);
          const propertiesWithAnnotations = mockServer._getEntityPropertiesWithSmartMockServerAnnotations(entityType.name);
          assert.notEqual(propertiesWithAnnotations.length, 0);
        });

        test('Should return none Entity Properties with a Smart MockServer Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const propertiesWithAnnotations = mockServer._getEntityPropertiesWithSmartMockServerAnnotations(entityType.name);
          assert.deepEqual(propertiesWithAnnotations.length, 0);
        });
      });

      QUnit.module('_generateDataFromEntityWithSmartMockServerAnnotations', () => {
        test('Should generate smart mock data only for properties with a Smart MockServer Annotations assigned to', (assert) => {
          const entityType = getEntityType(entityNameWithSmartMockServerAnnotations);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSmartMockServerAnnotations(entityType.name, mockEntity);
          assert.deepEqual(mockEntity.CustomerID, 'CustomerID 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
          assert.deepEqual(mockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.Country, 'Country 1');
          assert.deepEqual(mockEntity.Phone, 'Phone 1');
          assert.deepEqual(smartMockEntity.Phone, mockEntity.Phone);
          assert.notEqual(smartMockEntity.CustomerID, mockEntity.CustomerID);
          assert.notEqual(smartMockEntity.CompanyName, mockEntity.CompanyName);
          assert.notEqual(smartMockEntity.Address, mockEntity.Address);
          assert.notEqual(smartMockEntity.Country, mockEntity.Country);
        });

        test('Should return the same received mock data, no changes', (assert) => {
          const entityType = getEntityType(entityNameWithoutSmartRules);
          const mockEntity = mockServer._generateDataFromEntityOriginal(entityType, 1);
          const smartMockEntity = mockServer._generateDataFromEntityWithSmartMockServerAnnotations(entityType.name, mockEntity);
          assert.deepEqual(mockEntity.CustomerID, 'CustomerID 1');
          assert.deepEqual(mockEntity.CompanyName, 'CompanyName 1');
          assert.deepEqual(mockEntity.Address, 'Address 1');
          assert.deepEqual(mockEntity.Country, 'Country 1');
          assert.deepEqual(mockEntity.Phone, 'Phone 1');
          assert.deepEqual(smartMockEntity.CustomerID, mockEntity.CustomerID);
          assert.deepEqual(smartMockEntity.CompanyName, mockEntity.CompanyName);
          assert.deepEqual(smartMockEntity.Address, mockEntity.Address);
          assert.deepEqual(smartMockEntity.Country, mockEntity.Country);
          assert.deepEqual(smartMockEntity.Phone, mockEntity.Phone);
        });
      });

      QUnit.module('setSmartRules', () => {
        test('Should set _smartRules property', (assert) => {
          mockServer.setSmartRules(getSmartRules());
          assert.ok(mockServer._smartRules);
          assert.deepEqual(mockServer._smartRules instanceof Array, true);
          assert.deepEqual(mockServer._smartRules, getSmartRules());
        });

        test('Should set default _smartRules property', (assert) => {
          mockServer.setSmartRules();
          assert.deepEqual(mockServer._smartRules, []);
        });
      });
    });
});
