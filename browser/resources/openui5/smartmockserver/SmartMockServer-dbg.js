sap.ui.define([
  'sap/base/Log',
  'sap/ui/thirdparty/jquery',
  'sap/ui/core/util/MockServer',
  'openui5/smartmockserver/thirdparty/faker.min'
], function(Log, $, MockServer) {
  'use strict';

  const SmartMockServer = MockServer;

  SmartMockServer.prototype._generateDataFromEntityOriginal = SmartMockServer.prototype._generateDataFromEntity;

  /*
  Mapping between SAP Semantics annotations and Faker methods
  https://wiki.scn.sap.com/wiki/display/EmTech/SAP+Annotations+for+OData+Version+2.0#SAPAnnotationsforODataVersion2.0-Property_sap_semanticsAttributesap:semantics
   */
  SmartMockServer.prototype.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING = [
    {
      sapSemantics: 'city',
      fakerMethod: 'address.city'
    },
    {
      sapSemantics: 'country',
      fakerMethod: 'address.country'
    },
    {
      sapSemantics: 'geo-lat',
      fakerMethod: 'address.latitude'
    },
    {
      sapSemantics: 'geo-lon',
      fakerMethod: 'address.longitude'
    },
    {
      sapSemantics: 'region',
      fakerMethod: 'address.state'
    },
    {
      sapSemantics: 'street',
      fakerMethod: 'address.streetAddress'
    },
    {
      sapSemantics: 'zip',
      fakerMethod: 'address.zipCode'
    },
    {
      sapSemantics: 'org',
      fakerMethod: 'company.companyName'
    },
    {
      sapSemantics: 'currency-code',
      fakerMethod: 'finance.currencyCode'
    },
    {
      sapSemantics: 'photo',
      fakerMethod: 'image.avatar'
    },
    {
      sapSemantics: 'bcc',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'cc',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'email',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'from',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'sender',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'to',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'url',
      fakerMethod: 'internet.url'
    },
    {
      sapSemantics: 'body',
      fakerMethod: 'lorem.paragraphs'
    },
    {
      sapSemantics: 'subject',
      fakerMethod: 'lorem.sentence'
    },
    {
      sapSemantics: 'name',
      fakerMethod: 'name.findName'
    },
    {
      sapSemantics: 'givenname',
      fakerMethod: 'name.firstName'
    },
    {
      sapSemantics: 'middlename',
      fakerMethod: 'name.firstName'
    },
    {
      sapSemantics: 'title',
      fakerMethod: 'name.jobTitle'
    },
    {
      sapSemantics: 'familyname',
      fakerMethod: 'name.lastName'
    },
    {
      sapSemantics: 'honorific',
      fakerMethod: 'name.prefix'
    },
    {
      sapSemantics: 'suffix',
      fakerMethod: 'name.suffix'
    },
    {
      sapSemantics: 'tel',
      fakerMethod: 'phone.phoneNumber'
    }
  ];

  /**
   * Generate some mock data for a specific entityType. String value will be
   * based on the property name and an index Integer / Decimal value will be
   * generated randomly Date / Time / DateTime value will also be generated
   * randomly
   *
   * @param {object} oEntityType the Entity type used to generate the data
   * @param {int} iIndex index of this particular object in the parent collection
   * @param {map} mComplexTypes map of the complex types
   * @return {object} the mocked Entity
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntity = function(oEntityType, iIndex, mComplexTypes) {
    let entity = SmartMockServer.prototype._generateDataFromEntityOriginal.apply(this, arguments);
    return this._generateDataWithSmartRules(oEntityType.name, entity);
  };

  /**
   * Generate smart mock data for a specific Entity based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataWithSmartRules = function(entityName, entity) {
    try {
      if (!this._smartRules) {
        this._smartRules = [];
      }
      let entityWithSmartData = $.extend(true, {}, entity);
      entityWithSmartData = this._generateDataFromEntityWithSapSemanticsAnnotations(entityName, entityWithSmartData);
      entityWithSmartData = this._generateDataFromEntityWithSmartMockServerAnnotations(entityName, entityWithSmartData);
      entityWithSmartData = this._generateDataFromEntityWithSmartRules(entityName, entityWithSmartData);
      return entityWithSmartData;

    } catch (err) {
      Log.error(err);
      return entity;
    }
  };

  /**
   * Generate smart mock data for a specific Entity based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSmartRules = function(entityName, entity) {
    if (this._hasSmartRulesEntity(entityName)) {
      const entityWithSmartData = $.extend(true, {}, entity);
      Object.keys(entityWithSmartData).forEach(function(propertyName) {
        if (this._hasSmartRulesEntityProperty(entityName, propertyName)) {
          entityWithSmartData[propertyName] = this._generatePropertyValueWithSmartRules(entityName, propertyName);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Get Entity Properties which contain SAP Semantics Annotations.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @return {array} Entity Properties which contain SAP Semantics Annotations
   * @private
   */
  SmartMockServer.prototype._getEntityPropertiesWithSapSemanticsAnnotations = function(entityName) {
    const entityQuery = 'EntityType[Name="' + entityName + '"]';
    const propertyQuery = 'Property[sap\\:semantics]';
    return $(this._oMetadata).find(entityQuery).find(propertyQuery);
  };

  /**
   * Generate smart mock data for an Entity based on the SAP semantics set for the properties.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSapSemanticsAnnotations = function(entityName, entity) {
    const propertiesWithSemantics = this._getEntityPropertiesWithSapSemanticsAnnotations(entityName);
    if (propertiesWithSemantics && propertiesWithSemantics.length && propertiesWithSemantics.length > 0) {
      const entityWithSmartData = $.extend(true, {}, entity);
      propertiesWithSemantics.each(function(index, propertyXml) {
        const property = $(propertyXml);
        const fakerMethod = this._getFakerMethodFromSapSemantics(property.attr('sap:semantics'));
        if (fakerMethod) {
          entityWithSmartData[property.attr('Name')] = this._callFakerMethod(fakerMethod);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Gets the faker method assigned to the SAP Semantics Annotations
   *
   * @param {string} sapSemantics SAP Semantics Annotations
   * @return {string} the Faker method assigned to the SAP Semantics Annotations
   * @private
   */
  SmartMockServer.prototype._getFakerMethodFromSapSemantics = function(sapSemantics) {
    const mapping = this.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING.find(function(mapping) {
      return mapping.sapSemantics === sapSemantics;
    });
    if (mapping) {
      return mapping.fakerMethod;
    } else {
      return mapping;
    }
  };

  /**
   * Get Entity Properties which contain Smart MockServer Annotations.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @return {array} Entity Properties which contain Smart MockServer Annotations
   * @private
   */
  SmartMockServer.prototype._getEntityPropertiesWithSmartMockServerAnnotations = function(entityName) {
    const entityQuery = 'EntityType[Name="' + entityName + '"]';
    const propertyQuery = 'Property[smartmockserver\\:rule]';
    return $(this._oMetadata).find(entityQuery).find(propertyQuery);
  };

  /**
   * Generate smart mock data for an Entity based on the Smart MockServer Annotations set for the properties.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSmartMockServerAnnotations = function(entityName, entity) {
    const propertiesWithSemantics = this._getEntityPropertiesWithSmartMockServerAnnotations(entityName);
    if (propertiesWithSemantics && propertiesWithSemantics.length && propertiesWithSemantics.length > 0) {
      const entityWithSmartData = $.extend(true, {}, entity);
      propertiesWithSemantics.each(function(index, propertyXml) {
        const property = $(propertyXml);
        const fakerMethod = property.attr('smartmockserver:rule');
        if (fakerMethod) {
          entityWithSmartData[property.attr('Name')] = this._callFakerMethod(fakerMethod);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Generate smart mock data for a specific Entity property based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {string} propertyName the property name which contains a smart rule to generate the data
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generatePropertyValueWithSmartRules = function(entityName, propertyName) {
    const propertyFound = this._getSmartRulesEntityProperty(entityName, propertyName);
    return this._callFakerMethod(propertyFound.fakerMethod);
  };

  /**
   * Calls the Faker method defined in the smart rule and returns its result
   *
   * @param {string} fakerMethod the Entity name used to generate the data
   * @return {object} the result of the Faker method defined in the smart rule (can be any type)
   * @private
   */
  SmartMockServer.prototype._callFakerMethod = function(fakerMethod) {
    return faker.fake('{{' + fakerMethod + '}}');
  };

  /**
   * Gets the Entity with smart rules assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @return {object} the smart rules defined for the Entity
   * @private
   */
  SmartMockServer.prototype._getSmartRulesEntity = function(entityName) {
    return this._smartRules.find(function(item) {
      return item.entityName === entityName;
    });
  };

  /**
   * Gets the Entity property with a smart rule assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @param {string} propertyName the name of the Entity property that has a smart rule
   * @return {object} the smart rule defined for the Entity property
   * @private
   */
  SmartMockServer.prototype._getSmartRulesEntityProperty = function(entityName, propertyName) {
    const entityFound = this._getSmartRulesEntity(entityName);
    if (!entityFound) {
      return entityFound;
    }
    return entityFound.properties.find(function(property) {
      return property.name === propertyName;
    });
  };

  /**
   * Verifies whether the Entity has smart rules assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @return {boolean} true if Entity has any smart rule
   * @private
   */
  SmartMockServer.prototype._hasSmartRulesEntity = function(entityName) {
    return !!this._getSmartRulesEntity(entityName);
  };

  /**
   * Verifies whether the Entity property has a smart rule assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @param {string} propertyName the name of the Entity property that has a smart rule
   * @return {boolean} true if Entity property has any smart rule
   * @private
   */
  SmartMockServer.prototype._hasSmartRulesEntityProperty = function(entityName, propertyName) {
    return !!this._getSmartRulesEntityProperty(entityName, propertyName);
  };

  /**
   * Sets the smart rules to the Entities and their properties
   *
   * @param {Object[]} smartRules An array of smart rules
   * @param {string} smartRules[].entityName The name of an Entity.
   * @param {Object[]} smartRules[].properties An array with Entity properties and its Faker methods.
   * @param {string} smartRules[].properties[].name The name of an Entity property.
   * @param {string} smartRules[].properties[].fakerMethod The Faker method to be used for this property
   * @public
   */
  SmartMockServer.prototype.setSmartRules = function(smartRules) {
    this._smartRules = smartRules || [];
  };

  return SmartMockServer;
});
