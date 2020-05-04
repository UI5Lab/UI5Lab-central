sap.ui.define([
  'sap/base/Log',
  'sap/ui/model/json/JSONModel'
], function(Log, JSONModel) {
  'use strict';

  const logger = Log.getLogger('openui5.model.json.crud.CRUDModel');
  const defaultHttpMethods = {
    create: 'POST',
    read: 'GET',
    update: 'PUT',
    delete: 'DELETE'
  };
  const defaultFetchParameters = {
    body: null,
    headers: {}
  };

  /**
   * Constructor for a new CRUDModel.
   *
   * @param {string} serviceUrl Base URI of the service to request data from;
   *                            additional URL parameters appended here will be appended to every request.
   * @class
   * Model implementation for CRUD JSON.
   *
   * @extends sap.ui.model.json.JSONModel
   *
   * @author Mauricio Lauffer
   * @version 0.0.10
   *
   * @public
   * @alias openui5.model.json.crud.CRUDModel
   */
  const CRUDModel = JSONModel.extend('openui5.model.json.crud.CRUDModel', {
    metadata: {
      library: 'openui5.model.json.crud',
      publicMethods : ['create', 'read', 'update', 'delete',
        'getHttpMethods', 'setHttpMethods', 'getFetchParameters', 'setFetchParameters']
    },

    constructor: function(serviceUrl) {
      JSONModel.apply(this, []);
      this._serviceUrl = serviceUrl;
      this._fetchParameters = Object.assign({}, defaultFetchParameters);
      this._httpMethods = Object.assign({}, defaultHttpMethods);
    }
  });

  /**
   * Get Fetch parameters to be used.
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
   *
   * @return {object} Fetch parameters object
   * @public
   */
  CRUDModel.prototype.getFetchParameters = function() {
    return Object.assign({}, this._fetchParameters);
  };

  /**
   * Set Fetch parameters to be used.
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
   *
   * @param {object} parameters Fetch parameters object
   * @public
   */
  CRUDModel.prototype.setFetchParameters = function(parameters) {
    this._fetchParameters = Object.assign(this.getFetchParameters(), parameters);
  };

  /**
   * Get HTTP methods for CRUD operations.
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   * @return {object} HTTP Methods to be used by the CRUD operations
   * @public
   */
  CRUDModel.prototype.getHttpMethods = function() {
    return Object.assign({}, this._httpMethods);
  };

  /**
   * Set HTTP methods for CRUD operations.
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   * @param {object} httpMethods HTTP Methods to be used by the CRUD operations
   * @public
   */
  CRUDModel.prototype.setHttpMethods = function(httpMethods) {
    this._httpMethods = Object.assign(this.getHttpMethods(), httpMethods);
  };

  /**
   * Creates entry in the backend and into the local model
   * It returns a Response Object from Fetch - https://developer.mozilla.org/en-US/docs/Web/API/Response
   *
   * @param {string} urlPath The path to the service
   * @param {string} propertyPath The path to the property into the model; empty value does not update local model
   * @param {any} payload The payload to be sent to the service
   * @return {Promise} Returns a Promise, if resolved, resolves with a Response Object returned from Fetch
   * @public
   */
  CRUDModel.prototype.create = function(urlPath, propertyPath, payload) {
    const parameters = this._mergeParameters(payload, this.getHttpMethods().create);
    return this._callService(urlPath, parameters)
      .then(function(result) {
        if (propertyPath) {
          this.setProperty(propertyPath, result.data);
        }
        return result.response;
      }.bind(this));
  };

  /**
   * Reads entry from the backend and save it into the local model
   * It returns a Response Object from Fetch - https://developer.mozilla.org/en-US/docs/Web/API/Response
   *
   * @param {string} urlPath The path to the service
   * @param {string} propertyPath The path to the property into the model; empty value does not update local model
   * @return {Promise} Returns a Promise, if resolved, resolves with a Response Object returned from Fetch
   * @public
   */
  CRUDModel.prototype.read = function(urlPath, propertyPath) {
    const parameters = this._mergeParameters(null, this.getHttpMethods().read);
    return this._callService(urlPath, parameters)
      .then(function(result) {
        if (propertyPath) {
          this.setProperty(propertyPath, result.data);
        }
        return result.response;
      }.bind(this));
  };

  /**
   * Updates entry in the backend and into the local model
   * It returns a Response Object from Fetch - https://developer.mozilla.org/en-US/docs/Web/API/Response
   *
   * @param {string} urlPath The path to the service
   * @param {string} propertyPath The path to the property into the model; empty value does not update local model
   * @param {any} payload The payload to be sent to the service
   * @return {Promise} Returns a Promise, if resolved, resolves with a Response Object returned from Fetch
   * @public
   */
  CRUDModel.prototype.update = function(urlPath, propertyPath, payload) {
    const parameters = this._mergeParameters(payload, this.getHttpMethods().update);
    return this._callService(urlPath, parameters)
      .then(function(result) {
        if (propertyPath) {
          this.setProperty(propertyPath, Object.assign(this.getProperty(propertyPath), result.data));
        }
        return result.response;
      }.bind(this));
  };

  /**
   * Deletes entry from the backend and from the local model
   * It returns a Response Object from Fetch - https://developer.mozilla.org/en-US/docs/Web/API/Response
   *
   * @param {string} urlPath The path to the service
   * @param {string} propertyPath The path to the property into the model; empty value does not update local model
   * @return {Promise} Returns a Promise, if resolved, resolves with a Response Object returned from Fetch
   * @public
   */
  CRUDModel.prototype.delete = function(urlPath, propertyPath) {
    const parameters = this._mergeParameters(null, this.getHttpMethods().delete);
    return this._callService(urlPath, parameters)
      .then(function(result) {
        if (propertyPath) {
          const lastSlash = propertyPath.lastIndexOf('/');
          const objectOnlyPath = propertyPath.substring(0, lastSlash || 1);
          const propertyOnlyPath = propertyPath.substr(lastSlash + 1);
          const modelEntry = this.getProperty(objectOnlyPath);
          if (Array.isArray(modelEntry[propertyOnlyPath])) {
            modelEntry[propertyOnlyPath].splice(propertyOnlyPath, 1);
          } else if (Array.isArray(modelEntry)) {
            modelEntry.splice(propertyOnlyPath, 1);
          } else if (this.getProperty(propertyPath) && typeof modelEntry === 'object') {
            delete modelEntry[propertyOnlyPath];
          } else {
            logger.warning(propertyPath + ' was not found in the local model');
          }
        }
        return result.response;
      }.bind(this));
  };

  /**
   * Set Fetch parameters to be used.
   * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
   *
   * @param {any} body The payload to be sent to the service
   * @param {string} httpMethod The HTTP Method to be used in the operation
   * @return {object} Fetch parameters
   * @private
   */
  CRUDModel.prototype._mergeParameters = function(body, httpMethod) {
    const parameters = this.getFetchParameters();
    parameters.body = body;
    parameters.method = httpMethod;
    return parameters;
  };

  /**
   * Calls Fetch API
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   *
   * @param {string} urlPath The path to the service
   * @param {object} parameters Fetch parameters to be used
   * @return {Promise} Returns a Promise with the Fetch results
   * @private
   */
  CRUDModel.prototype._callService = function(urlPath, parameters) {
    const path = urlPath || '';
    const url = this._serviceUrl + path;
    const result = {
      data: null,
      response: null
    };
    return fetch(url, parameters)
      .then(function (response) {
        if (response.ok) {
          result.response = response.clone();
          return response.json();
        } else {
          throw response;
        }
      })
      .then(function(data) {
        result.data = data;
        return result;
      });
  };

  return CRUDModel;
});
