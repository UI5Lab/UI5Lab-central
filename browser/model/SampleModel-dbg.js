sap.ui.define([
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Log, JSONModel, MessageBox) {
	"use strict";

	return JSONModel.extend("ui5lab.browser.model.SampleModel", {

		/**
		 * Loads samples available in the current project based on metadata
		 * @class
		 * @public
		 * @alias ui5lab.browser.model.SampleModel
		 */
		constructor : function (oResourceModel) {
			this._oResourceBundle = oResourceModel.getResourceBundle();

			// call base class constructor
			JSONModel.apply(this, arguments);
			this.setSizeLimit(10000);

			// set up the JSON model data to not block the UI while loading the app
			this._iStartTime = new Date().getTime();
			this._loadLibraries();
			return this;
		},

		/**
		 * Promise to register when the asynchronous loading of samples is finished
		 * @return {Promise} a promise that is resolved when all samples are loaded
		 */
		loaded: function () {
			if (!this._oSamplesLoadedPromise) {
				this._oSamplesLoadedPromise = new Promise(function(fnResolve, fnReject) {
					this._fnSamplesLoadedResolve = fnResolve;
					this._fnSamplesLoadedReject = fnReject;
				}.bind(this));
			}
			return this._oSamplesLoadedPromise;
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Load and process all libraries available in the current project
		 * @private
		 */
		_loadLibraries: function () {
			fetch(sap.ui.require.toUrl("ui5lab/browser/libraries.json"))
				.then(function(oResponse) {
					return oResponse.json();
				})
				.then(this._loadMetadata.bind(this))
				.then(this._onMetadataLoaded.bind(this))
				.catch(this._onError.bind(this));
		},

		/**
		 * Load library metadata
		 * @private
		 */
		_loadMetadata: function (librariesFile) {
			return new Promise(function (fnResolve, fnReject) {
				const aLibraries = librariesFile.libraries;
				this._oMetadata = {};
				this._iLibraryCount = aLibraries.length;
				this._iLibraryLoadedCount = 0;

				if (aLibraries.length > 0) {
					for (let i = 0; i < aLibraries.length; i++) {
						if (typeof aLibraries[i] === "string") {
							//Keeping it just to be retrocompatible
							this._loadSamples(aLibraries[i], fnResolve);
						} else {
							const libraryKey = Object.keys(aLibraries[i])[0];
							this._oMetadata[libraryKey] = aLibraries[i][libraryKey];
							this._iLibraryLoadedCount++;
							// resolve the outer promise when all libs are loaded
							if (this._iLibraryCount === this._iLibraryLoadedCount) {
								fnResolve();
							}

						}
					}
				} else {
					MessageBox.information(this._oResourceBundle.getText("noLibrariesConfigured"));
				}
			}.bind(this));
		},

		/**
		 * Load and process all samples from the metadata
		 * @private
		 */
		_loadSamples: function (sLibraryName, fnResolve, fnReject) {
			//It should always load from test-resources
			var url = sap.ui.require.toUrl("libs/" + sLibraryName.replace(/\./g, '/') + "/index.json");
			jQuery.ajax({
				url: url,
				dataType: "json",
				success: function (oData) {
					// store metadata
					this._oMetadata[sLibraryName] = oData[sLibraryName];
					this._iLibraryLoadedCount++;
				}.bind(this),
				error: function () {
					// just ignore the lib that cannot be loaded
					Log.warning(this._oResourceBundle.getText("noMetadataForLibrary", sLibraryName));
					this._iLibraryCount--;
				}.bind(this),
				complete: function () {
					// resolve the outer promise when all libs are loaded
					if (this._iLibraryCount === this._iLibraryLoadedCount) {
						fnResolve();
					}
				}.bind(this)
			});
		},

		/**
		 *	Post process all data for display in the UI5Lab browser
		 * @private
		 */
		_onMetadataLoaded : function () {
			// trace elapsed time
			Log.info("SampleModel: Loaded all samples in " + (new Date().getTime() - this._iStartTime) + " ms");

			var oSampleData = this._processMetadata(this._oMetadata);

			// set the model data
			this.setProperty("/", oSampleData);
			this.updateBindings(true);

			// resolve samplesLoaded promise
			this._fnSamplesLoadedResolve();
		},

		/**
		 * Sorts and formats the sample metadata to be used in bindings
		 * @param {object} oMetadata Raw metadata coming from the json descriptor
		 * @return {object} Formatted metadata
		 * @private
		 */
		_processMetadata: function (oMetadata) {
			var oModelData = {
					libraries: [],
					assets: [],
					samples: []
				},
				aLibraryNames = oMetadata;

			var aLibraryNames = Object.keys(aLibraryNames);
			for (var i = 0; i < aLibraryNames.length; i++) {
				// store library information
				oMetadata[aLibraryNames[i]].id = aLibraryNames[i];
				oModelData.libraries.push(oMetadata[aLibraryNames[i]]);
				// separately index assets and samples
				var aEntities = Object.keys(oMetadata[aLibraryNames[i]].content);
				for (var j = 0; j < aEntities.length; j++) {
					var oAsset = oMetadata[aLibraryNames[i]].content[aEntities[j]];

					// create global id and store asset
					oAsset.id = aLibraryNames[i] + "." + oAsset.id;
					oAsset.library = aLibraryNames[i];
					oModelData.assets.push(oAsset);

					// list samples separately
					for (var k = 0; k < oAsset.samples.length; k++) {
						var oSample = oAsset.samples[k];

						// create global id and store asset
						oSample.id = oAsset.id + "." + oSample.id;
						oSample.asset = oAsset.id;
						oSample.library = aLibraryNames[i];
						oModelData.samples.push(oSample);
					}
				}
			}
			return oModelData;
		},

		/**
		 * Fires a request failed event in case the metadata for the library could not be read
		 * @param {object} oResponse the response object from the ajax request
		 * @private
		 */
		_onError: function (oResponse) {
			oResponse.error = "Failed to load the metadata, check for parse errors";
			this.fireRequestFailed({response: oResponse});
			this._fnSamplesLoadedReject();
		}
	});
});
