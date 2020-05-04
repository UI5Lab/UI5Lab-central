/*!
 * ${copyright}
 */

sap.ui.define([
	"jquery.sap.global",
	"./library",
	"sap/ui/unified/FileUploader",
	"sap/ui/unified/FileUploaderRenderer",
	"sap/ui/Device",
	"nabi/m/thirdparty/canvas-to-blob",
], function(jQuery, library, FileUploader, FileUploaderRenderer, Device, canvasToBlob) {
	"use strict";

	/**
	 * Constructor for a new ImageFileUploader control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control allows to upload any file to a server while images can be scaled down
	 * before they get uploaded. Other files than image files will be uploaded as is.
	 * Non-image files are supported because users often scan documents to PDF files instead
	 * of scanning them to JPEG files. Furthermore, I wanted to make this control an
	 * "in-place" replacement for the sap.ui.unified.FileUploader which adds image scaling features.
	 * Make sure to specify fileType and/or mimeType in order to define what files
	 * shall be uploaded.
	 *
	 * Files are uploaded using FormData and XHR. Scaling of the files is based on HTML5
	 * Canvas and the File API (window.File).
	 * This control is not supported by Internet Explorer 9.
	 *
	 * <b>IMPORTANT</b>: This control uses private APIs of sap.ui.unified.FileUploader which is a
	 *            very very very bad practice (see all "FIXME" hints in this control's code).
	 * 						However, this was the easiest/fastest way to leverage
	 *            from the amazing code that already exist (think about the renderer incl. not
	 *            losing values on re-rendering, i18n, accessibility, parameters, OData support,...).
	 *            As soon as SAP offers a clean way for overwriting the right methods (i.e. an interface)
	 *						I will migrate this control. Or maybe SAP even takes over the idea of
	 *            this community control. In the meanwhile make sure to test this control
	 * 						with your version of UI5 (and yes, I will write some automated
	 *						tests soon).
	 *
	 * <b>Hint</b>: The term "resolution" is often referred to as for example "pixels per inch"
	 * 			 or "dots per inch (DPI)". Instead, we use this term in a more pragmatic way, i.e.
	 * 			 it simply means width x height in pixels (similar to your monitor's resolution).
	 *
	 * @extends sap.ui.unified.FileUploader
	 *
	 * @author Nabi Zamani, nabisoft GmbH
	 * @version ${version}
	 *
	 * @constructor
	 * @since 1.52
	 * @public
	 * @alias nabi.m.ImageFileUploader
	 */
	var ImageFileUploader = FileUploader.extend("nabi.m.ImageFileUploader", /** @lends nabi.m.ImageFileUploader.prototype */ {
		/**
		 * Control API
		 */
		metadata : {
			library : "nabi.m",
			interfaces : [],
			properties : {

				/**
				 * Allows to decide in which cases image scaling is is applied, i.e. scale only if the initial file
				 * size exceeds a gives maximum. The following conditions are possible (all of them are based on the
			 	 * initial file):
				 * <ul>
 				 * <li><code>nabi.m.ImageScaleCondition.Size</code>: Scale only if the image size exceeds <code>scaleConditionSize</code>.</li>
 				 * <li><code>nabi.m.ImageScaleCondition.Resolution</code>: Scale only if the image resolution exceeds <code>scaleConditionResolution</code> (width x height).</li>
 				 * <li><code>nabi.m.ImageScaleCondition.Boundary</code>: Scale only if image width exceeds <code>scaleConditionBoundaryWidth</code> or if the image height exceeds <code>scaleConditionBoundaryHeight</code>.</li>
 				 * <li><code>nabi.m.ImageScaleCondition.Any</code>: Scale if any of the other conditions has matched except <code>nabi.m.ImageScaleCondition.None</code>.</li>
				 * <li><code>nabi.m.ImageScaleCondition.None</code>: Always scale image meaning without checking any condition <b>(default)</b>.</li>
				 * </ul>
 				 */
				scaleCondition : {type : "nabi.m.ImageScaleCondition", group : "Data", defaultValue : nabi.m.ImageScaleCondition.None},

				/**
				 * The max allowed initial file size in bytes used for the condition <code>nabi.m.ImageScaleCondition.Size</code>.
				 * Only used if <code>scaleCondition</code> is set to <code>nabi.m.ImageScaleCondition.Size</code> or <code>nabi.m.ImageScaleCondition.Any</code>.
				 * A value &lt;= 0 will disable/skip the corresponding condition.
				 * The default value is 1024 * 1024 * 3 which is 3 MB.
				 */
				scaleConditionSize : {type : "int", group : "Data", defaultValue : 1024 * 1024 * 3},

				/**
				 * The max allowed initial image resolution in pixels (width x height) used for the condition <code>nabi.m.ImageScaleCondition.Resolution</code>.
				 * Only used if <code>scaleCondition</code> is set to <code>nabi.m.ImageScaleCondition.Resolution</code> or <code>nabi.m.ImageScaleCondition.Any</code>.
				 * A value &lt;= 0 will disable/skip the corresponding condition.
				 *
				 * Scaling down will only happen if image height * width exceeds <code>scaleConditionResolution<code>.
				 * The default is 1680 * 1050 = 1764000 which is derived from the defaults of
				 * <code>scaleConditionBoundaryWidth * scaleConditionBoundaryHeight<code>.
				 */
				scaleConditionResolution : {type : "int", group : "Data", defaultValue : 1680 * 1050},

				/**
				 * The max allowed initial image width used for the condition <code>nabi.m.ImageScaleCondition.Boundary</code>.
				 * Only used if <code>scaleCondition</code> is set to <code>nabi.m.ImageScaleCondition.Boundary</code> or <code>nabi.m.ImageScaleCondition.Any</code>.
				 * If <code>scaleConditionBoundaryWidth &lt;= 0<code> then this property is disabled/skipped for the corresponding condition.
				 */
				scaleConditionBoundaryWidth : {type : "int", group : "Data", defaultValue : 1680},

				/**
				 * The max allowed initial image height used for the condition <code>nabi.m.ImageScaleCondition.Boundary</code>.
				 * Only used if <code>scaleCondition</code> is set to <code>nabi.m.ImageScaleCondition.Boundary</code> or <code>nabi.m.ImageScaleCondition.Any</code>.
				 * If <code>scaleConditionBoundaryHeight &lt;= 0<code> then this property is disabled/skipped for the corresponding condition.
				 */
				scaleConditionBoundaryHeight : {type : "int", group : "Data", defaultValue : 1050},

				/**
				 * This property defines <b>how</b> images shall be scaled down:
				 * <ul>
				 * <li><code>nabi.m.ImageScaleType.Factor</code> (default): Uses the property <code>scaleFactor<code> to scale the image.</li>
				 * <li><code>nabi.m.ImageScaleType.Boundary</code>: <code>maximumBoundaryWidth</code> and <code>maximumBoundaryHeight</code> are used to scale the image while keeping the proportions of the image.</li>
				 * </ul>
				 *
				 * <b>Hint:</b> Technically, scaling up might be possible. However, scaling up images was not tested as it was never a goal for this control.
				 */
				scaleType : {type : "nabi.m.ImageScaleType", group : "Data", defaultValue : nabi.m.ImageScaleType.Factor},

				/**
				 * The scale factor which is applied to the selected file before it gets uploaded.
				 * The default value is 0.9, which means the images is scaled down by 10 percent.
				 * Restriction: 0 &lt; scaleFactor &lt;= 1
				 */
				scaleFactor : {type : "float", group : "Data", defaultValue : 0.9},

				/**
				 * A number between 0 and 1 as the scale quality which is applied to the selected file
				 * before it gets uploaded. Only relevant for jpg files.
				 */
				scaledJpgQuality : {type : "float", group : "Data", defaultValue : 1},

				/**
				 * A file size limit in bytes which prevents the upload if at least one file exceeds it.
				 * Zero (0) means any file size.
				 * This is the file size of scaled file. In contrast, <code>maximumFileSize</code> is the file size of the
				 * initially selected file before the file gets scaled. For PDF files this property describes
				 * the original file size (because PDF files are not scaled, see also allowPdf).
				 */
				maximumScaledFileSize : {type : "int", group : "Data", defaultValue : 0},

				/**
				 * Max pixels for width. Only used if scaleType is set to <code>nabi.m.ImageScaleType.Boundary</code>.
				 * Scaling down to <code>maximumBoundaryWidth</code> will automatically take effect
				 * if width in pixels of original image excees <code>maximumBoundaryWidth</code>. The default is 1680, which means the
				 * image gets scaled in a way so that the width has a max of 1680 pixels. The proportions
				 * will not be changed during scaling, meaning that height is scaled then, too.
				 */
				maximumBoundaryWidth : {type : "int", group : "Data", defaultValue : 1680},

				/**
				 * Max pixels for height. Only used if scaleType is set to <code>nabi.m.ImageScaleType.Boundary</code>.
				 * Scaling down to <code>maximumBoundaryHeight</code> will automatically take effect
				 * if height in pixels of original image excees <code>maximumBoundaryHeight</code>. The default is 1050, which means the
				 * image gets scaled in a way so that the height has a max of 1050 pixels. The proportions
				 * will not be changed during scaling, meaning that width is scaled then, too.
				 */
				maximumBoundaryHeight : {type : "int", group : "Data", defaultValue : 1050},

				/**
				 * Allows to convert the selected image file to a given file type before it gets uploaded.
				 * This feature allows to select for example a png file and upload it as a scaled down jpg file.
				 * The default is to use the original image file type (no conversion applied before upload).
				 * Internally, the image file type conversion happens after the image got scaled.
				 */
				uploadType : {type : "nabi.m.ImageType", group : "Data", defaultValue : nabi.m.ImageType.Default}

			},
			aggregations : { },
			events : {
				/**
				 * Fired when the maximum scaled file size of a file exceeds
				 * the property <code>maximumScaledFileSize</code>. For PDF files this event is
				 * thrown if the original file size exceeds the maximumScaledFileSize property.
				 * If this event is fired then the upload is stopped.
				 */
				maxScaledFileSizeExceed : {
					parameters : {
						/**
						 * The name of a file to be uploaded.
						 */
						fileName : {type : "string"},

						/**
						 * The size in bytes of a file to be uploaded.
						 */
						fileSize : {type : "int"}
					}
				},

				/**
				 * Fired if the current browser does not support this control. The best way to
				 * handle this event is telling the user to upgrade the browser or to use
				 * a "modern" browser :-)
				 */
				browserNotSupported : {
					parameters : { }
				}

			}
		},

		init: function () {
			if (!this.isBrowserSupported()) {
				this.fireBrowserNotSupported();
				jQuery.sap.log.error("nabi.m.ImageFileUploader: Browser does not support File API and/or other important APIs. Sorry.");
			}
			FileUploader.prototype.init.apply(this, arguments);

			//config via parent apis (these apis must be overriden in this control to avoid malfunction)
			FileUploader.prototype.setSendXHR.call(this, true);
		},

		renderer : "sap.ui.unified.FileUploaderRenderer"

	});

	//##############################################################
	// Override Parent APIs
	//##############################################################

	/**
	 * Override parent because we have to pass true for the async param upload(true)
	 * @param {boolean} bPreProcessFiles this parameter is always true no matter what you pass. See parent API docs for details.
	 */
	ImageFileUploader.prototype.upload = function() {
		FileUploader.prototype.upload.call(this, true);
	};

	/**
	 * Take the files received and scale the images. The scaled images will then be used for upload via XHR.
	 *
	 * This is the implementation of the interface <code>sap.ui.unified.IProcessableBlobs</code>
	 * received from the parent <code>sap.ui.unified.FileUploader<c/ode>.
	 *
	 * @override
	 * @param {Blob[]} aBlobs The initial Blobs which can be used to determine/calculate a new array of Blobs for further processing.
	 * @return {Promise} A Promise that resolves with an array of Blobs which is used for the final uploading.
	 */
	ImageFileUploader.prototype.getProcessedBlobsFromArray = function (aBlobs){
		return new Promise(function(resolve, reject){

			this._scaleFiles(aBlobs).then(function(aScaledFiles){
				var i, oBlob, aFilesToUpload, iMaxScaledFileSize;
				jQuery.sap.log.debug("Images scaled successfully, now start upload...");

				// chek the file sizes + convert to window.File if possible
				aFilesToUpload = [];
				for (i=0; i<aScaledFiles.length;i++){
					oBlob = aScaledFiles[i];
					// check the max allowed file size
					iMaxScaledFileSize = this.getMaximumScaledFileSize();
					if (iMaxScaledFileSize > 0 && oBlob.size > iMaxScaledFileSize) {
						jQuery.sap.log.info("File: " + oBlob.name + " is of size " + oBlob.size + " bytes which exceeds the file size limit of " + this.getMaximumScaledFileSize() + " bytes.");
						this.fireMaxScaledFileSizeExceed({
							fileName:oBlob.name,
							fileSize:oBlob.size
						});
						reject({
							reason: "MaxScaledFileSizeExceed",
							fileName:oBlob.name,
							fileSize:oBlob.size
						});
						return;
					}

					// maybe we should remove this here
					if (!Device.browser.msie && !Device.browser.edge) {
						// use instances of window.File for image files instead of Blob
						if ( !(oBlob instanceof window.File) ) {
							aFilesToUpload.push( new File([oBlob], oBlob.name, {type: oBlob.type}) );
						} else {
							aFilesToUpload.push(oBlob);
						}
					} else {
						aFilesToUpload.push(oBlob);
					}
				}

				resolve(aFilesToUpload);

			}.bind(this)).catch(function(){
				var sMsg = "File upload failed because on or more files could not be scaled!";
				jQuery.sap.log.error(sMsg);
				reject({
					reason: "ImageScalingFailed",
					message: sMsg,
					args: arguments
				});
			});

		}.bind(this));
	};

	ImageFileUploader.prototype.setSendXHR = function() {
		throw new Error("ImageFileUploader only supports upload via XHR requests (sendXHR is always true). Thus, the setter is obsolete.");
	};

	// Dirty fallback for older versions of UI5 (<1.52) where the parent does not implement
	// the interface <code>sap.ui.unified.IProcessableBlobs</code> shipped with pull request https://github.com/SAP/openui5/pull/1623.
	// ==> so only override in case sap.ui.unified.IProcessableBlobs is not available:
	if (FileUploader.getMetadata().isInstanceOf("sap.ui.unified.IProcessableBlobs")) {
		// probably it would be better to search in FileUploader.getMetadata().getInterfaces() or getting it from library

		/**
		 * "Dirty" because private APIs of the parent are used inside this method.
		 * @type {void}
		 * @public
		 * @override
		 */
		ImageFileUploader.prototype.upload = function() {
			//supress Upload if the FileUploader is not enabled
			if (!this.getEnabled() || !window.File || !this.getValue()) {
				jQuery.sap.log.debug("ImageFileUploader - Upload skipped because disabled");
				return;
			}

			this._bUploading = true;									// using private apis is dirty
			var aFiles = this.FUEl.files;								// using private apis is dirty

			// probably it's better to split image file and non-image files into
			// two arrays and pass only the images to this._scaleFiles(...)
			this._scaleFiles(aFiles).then(function(aScaledFiles){
				var i, oBlob, aFilesToUpload, iMaxScaledFileSize;
				try {
					jQuery.sap.log.debug("Images scaled successfully, now start upload...");

					// chek the file sizes + convert to window.File if possible
					aFilesToUpload = [];
					for (i=0; i<aScaledFiles.length;i++){
						oBlob = aScaledFiles[i];
						// check the max allowed file size
						iMaxScaledFileSize = this.getMaximumScaledFileSize();
						if (iMaxScaledFileSize > 0 && oBlob.size > iMaxScaledFileSize) {
							jQuery.sap.log.info("File: " + oBlob.name + " is of size " + oBlob.size + " bytes which exceeds the file size limit of " + this.getMaximumScaledFileSize() + " bytes.");
							this.fireMaxScaledFileSizeExceed({
								fileName:oBlob.name,
								fileSize:oBlob.size
							});
							this._bUploading = false;		// using private apis is dirty
							return;
						}

						// this line would not send the file name because in FormData.append(...) the third param is not passed:
						// this._sendFilesWithXHR(aScaledFiles);
						//
						// workaround: let's just create a new instance of window.File and pass it
						// However, this does not work on IE/Edge, we don't use a polyfill //TODO use polyfill if possible
						if (!Device.browser.msie && !Device.browser.edge) {
							// use instances of window.File for image files instead of Blob
							if ( !(oBlob instanceof window.File) ) {
								aFilesToUpload.push( new File([oBlob], oBlob.name, {type: oBlob.type}) );
							} else {
								aFilesToUpload.push(oBlob);
							}
						} else {
							aFilesToUpload.push(oBlob);
						}
					}

					// finally call the private API - sorry for that :-(
					this._sendFilesWithXHR(aFilesToUpload);		// using private apis is dirty

				} catch (oException) {
					jQuery.sap.log.error("File upload failed:\n" + oException.message);
					this._bUploading = false;
				}
			}.bind(this)).catch(function(){
				jQuery.sap.log.error("File upload failed because on or more files could not be scaled!");
			});

		};

	}

	//##############################################################
	// Own/New APIs
	//##############################################################

	ImageFileUploader.prototype.exit = function () {
		/* release resources that are not released by the SAPUI5 framework */
		FileUploader.prototype.exit.apply(this, arguments);
	};

	/**
	 * Sets the scale factor with the constrant 0 < sVal <= 1. Values out of this range are silently ignored.
	 * This setter does not trigger a rerendering.
	 *
	 * @param {float} [fVal] the scale factor
	 * @returns {object} this
	 * @public
	 */
	ImageFileUploader.prototype.setScaleFactor = function(fVal) {
		if (jQuery.isNumeric(fVal) && fVal > 0 && fVal <= 1){
			this.setProperty("scaleFactor", fVal, /*suppressInvalidate*/ true);		//do not re-render
		}
		return this;
	};

	/**
	 * Scales a list of window.File instances. Depending on the property uploadType the files
	 * are also converted into the correct file type. The returned promise is resolved with
	 * an array of the new image files (Blob).
	 *
	 * @param {File} [aFiles] the image files to be scaled and optionally converted (see property uploadType)
	 * @returns {Promise} resolves after all the files in aFiles have been successfully processed
	 * @private
	 */
	ImageFileUploader.prototype._scaleFiles = function (aFiles){
		var aPromises, fnScaleConditionMatched;
		aPromises = [];

		fnScaleConditionMatched = this._getScaleConditionMatchedFunction().bind(this);
		return new Promise(function(resolve, reject) {
			var i;

			for (i=0; i < aFiles.length; i++){
				aPromises.push(
					this._scaleFile(aFiles[i], fnScaleConditionMatched)
				);
			}

			Promise.all(aPromises).then(function(aScaledFiles){
				resolve(aScaledFiles);
			}).catch(function(){
				reject(arguments);
			});

		}.bind(this));
	};

	/**
	 * Returns a function that checks the scale conditions.
	 *
	 * @returns {Function} the function that can be called to check if the scale conditions match or not
	 * @private
	 */
	ImageFileUploader.prototype._getScaleConditionMatchedFunction = function (){
		var sScaleCondition, fnResult;
		sScaleCondition = this.getScaleCondition();

		switch (sScaleCondition) {
			case nabi.m.ImageScaleCondition.Size:
				fnResult = this._scaleConditionSizeMatched;
				break;
			case nabi.m.ImageScaleCondition.Resolution:
				fnResult = this._scaleConditionResolutionMatched;
				break;
			case nabi.m.ImageScaleCondition.Boundary:
				fnResult = this._scaleConditionBoundaryMatched;
				break;
			case nabi.m.ImageScaleCondition.Any:
				fnResult = this._scaleConditionAnyPassed;
				break;
			case nabi.m.ImageScaleCondition.None:
		  default:
				fnResult = this._scaleConditionNoneMatched;
		}
		return fnResult;
	};

	/**
	 * Checks if the scaleCondition <code>nabi.m.ImageScaleCondition.Size</code> has matched.
	 * The condition matches if the parameter <code>oParams.file</code> exceeds the property <code>scaleConditionSize</code>.
	 *
	 * @param {Object} [oParams] Object containing named parameters
	 * @param {int} [oParams.size] the initial size in bytes of the image file
	 * @returns {boolean} true if the file size of <code>oParams.size</code> exceeds the property <code>scaleConditionSize</code>, else false.
	 * @private
	 */
	ImageFileUploader.prototype._scaleConditionSizeMatched = function (oParams){
		return this.getScaleConditionSize() > 0 && oParams.size > this.getScaleConditionSize();
	};

	/**
	 * Checks if the scaleCondition <code>nabi.m.ImageScaleCondition.Resolution</code> has matched.
	 * The condition matches if the parameter <code>oParams.canvas</code> has a larger resolution than <code>scaleConditionResolution</code>.
	 *
	 * @param {Object} [oParams] Object containing named parameters
	 * @param {int} [oParams.width] the width of the initial image file in pixels
	 * @param {int} [oParams.height] the height of the initial image file in pixels
	 * @returns {boolean} true if <code>oParams.width * oParams.height</code> exceeds the property <code>scaleConditionResolution</code>, else false.
	 * @private
	 */
	ImageFileUploader.prototype._scaleConditionResolutionMatched = function (oParams){
		return this.getScaleConditionResolution() > 0 && ((oParams.width * oParams.height) > this.getScaleConditionResolution());
	};

	/**
	 * Checks if the scaleCondition <code>nabi.m.ImageScaleCondition.Boundary</code> has matched.
	 * The condition matches if the parameter <code>oParams.canvas</code> has a width &gt; <code>scaleConditionBoundaryWidth</code>
	 * or a height &gt; <code>scaleConditionBoundaryHeight</code>.
	 *
	 * @param {Object} [oParams] Object containing named parameters
	 * @param {int} [oParams.width] the width of the initial image file in pixels
	 * @param {int} [oParams.height] the height of the initial image file in pixels
	 * @returns {boolean} true if <code>oParams.width</code> &gt; <code>scaleConditionBoundaryWidth</code> or a <code>oParams.height<code> &gt; <code>scaleConditionBoundaryHeight</code>, else false.
	 * @private
	 */
	ImageFileUploader.prototype._scaleConditionBoundaryMatched = function (oParams){
		return (this.getScaleConditionBoundaryWidth() > 0 && oParams.width > this.getScaleConditionBoundaryWidth()) ||
					 (this.getScaleConditionBoundaryHeight() > 0 && oParams.height > this.getScaleConditionBoundaryHeight());
	};

	/**
	 * Checks if the scaleCondition <code>nabi.m.ImageScaleCondition.Boundary</code> has matched.
	 * The condition matches if one of <code>scaleConditionSize</code>, <code>scaleConditionResolution</code>, or <code>scaleConditionBoundary</code>
	 * has matched.
	 *
	 * @param {Object} [oParams] Object containing named parameters
	 * @param {int} [oParams.size] the initial size in bytes of the image file
	 * @param {int} [oParams.width] the width of the initial image file in pixels
	 * @param {int} [oParams.height] the height of the initial image file in pixels
	 * @returns {boolean} true if at least one of <code>scaleConditionSize</code>, <code>scaleConditionResolution</code>, or <code>scaleConditionBoundary</code> has matched, else false
	 * @private
	 */
	ImageFileUploader.prototype._scaleConditionAnyPassed = function (oParams){
		return this._scaleConditionSizeMatched(oParams) ||
					 this._scaleConditionResolutionMatched(oParams) ||
					 this._scaleConditionBoundaryMatched(ooParams);
	};

	/**
	 * <code>scaleConditionNone</code> means no checks need to be done at all. Thus, this private API
	 * always returns true indicating that the file shall be scaled at all times because there is no condition.
	 *
	 * @returns {boolean} always true
	 * @private
	 */
	ImageFileUploader.prototype._scaleConditionNoneMatched = function (){
		return true;
	};

	/**
	 * Scales a single window.File instance. Depending on the property uploadType the file
	 * is also converted into the correct file type. The returned promise is resolved with
	 * the new image file as a Blob.
	 *
	 * @param {File} [oFile] the image file to be scaled and optionally converted (see property uploadType)
	 * @param {Function} [fnScaleConditionMatched] checks against the scaleCondition, i.e. returns true if scaling should be applied and false if it should be skipped
	 * @returns {Promise} resolves after the file has been successfully processed or rejects in case of errors
	 * @private
	 */
	ImageFileUploader.prototype._scaleFile = function (oFile, fnScaleConditionMatched){
		var that = this;
		return new Promise(function(resolve, reject) {
			if (!oFile.type.match("image/.*")) {
				// no scaling for non-image files
				resolve(oFile);

			} else {
				that._imageToCanvas(oFile, fnScaleConditionMatched).then(function(elCanvas){
					var oProperties = that._calculateFileProperties(oFile);
					elCanvas.toBlob(function(blob){
						blob.name = oProperties.filename;
						resolve(blob);
					}, oProperties.mimetype, oProperties.quality);		//quality only set for jpg, else undefined
				}).catch(function(oResult){
					//check the reason and reject in case of errors or resolve in case of skipped conditions
					if (oResult.success) {
						resolve(oFile);		//all good, because scaling is just skipped because of scaling conditions
					} else {
						reject(oResult);	//we have an error
					}
				});
			}
		});
	};

	/**
 	 * Converts an image File to a scaled canvas image.
	 * The property scaleType is used to determine how to scale the image.
	 * The scale conditions are also checked. If scaling shall be skipped, then the promise
	 * is rejected with an object containing a success property set to true.
 	 *
 	 * @param {File} [oFile] the image file (window.File)
	 * @param {Function} [fnScaleConditionMatched] checks against the scaleCondition, i.e. returns true if scaling should be applied and false if it should be skipped
 	 * @returns {Promise} resolves with the HTML5 canvas element after the file has been successfully processed
 	 * @private
 	 */
	ImageFileUploader.prototype._imageToCanvas = function (oFile, fnScaleConditionMatched){
		return new Promise(function(resolve, reject){
			var oImage = new Image();
			oImage.onload = function(){
				var canvas, fFactor, oBoundary, scaleType;

				//check for scale conditions
				if ( !fnScaleConditionMatched({ size : oFile.size, width : oImage.width, height : oImage.height }) ){
					reject({
						success : true,
						message: "Scaling is skipped because no matching scaling condition found",
						file : oFile
					});
					return;
				}

				canvas = document.createElement("canvas");
				scaleType	= this.getScaleType();
				if (scaleType === nabi.m.ImageScaleType.Factor) {
					fFactor = this.getScaleFactor();
					canvas.width = oImage.width * fFactor;
					canvas.height = oImage.height * fFactor;

				} else if (scaleType === nabi.m.ImageScaleType.Boundary) {
					oBoundary = this._calculateBoundaries(oImage);
					canvas.width = oBoundary.width;
					canvas.height = oBoundary.height;
				}

				canvas.ctx = canvas.getContext("2d");
				canvas.ctx.drawImage(oImage, 0, 0, canvas.width, canvas.height);
				resolve(canvas);

			}.bind(this);
			oImage.onerror = function(){
				oImage.onerror = null;
				reject({success: false, message: "Failed to load the selected image from ObjectURL", file : oFile});
			};
			oImage.src = URL.createObjectURL(oFile);
		}.bind(this));
	};

	/**
 	 * Proportional calculation of width and height boundaries of a given image
	 * based on tha max allowed values.
	 * If the property <code>scaleType</code> is not <code>nabi.m.ImageScaleType.Boundary</code> then an error is thrown.
 	 *
 	 * @param {File} [oImage] the image
 	 * @returns {object} an object containing a width and height property
 	 * @private
 	 */
	ImageFileUploader.prototype._calculateBoundaries = function (oImage) {
		var oBoundary, iMaxHeight, iMaxWidth;

		oBoundary = {
			height: oImage.height,
			width: oImage.width
		};

		if (this.getScaleType() !== nabi.m.ImageScaleType.Boundary){
				throw new Error("ImageFileUploader: boundaries can only be calculated for nabi.m.ImageScaleType.Boundary, but received nabi.m.ImageScaleType." + this.getScaleType());
		}

		iMaxHeight = this.getMaximumBoundaryHeight();
		iMaxWidth = this.getMaximumBoundaryWidth();
		if (iMaxHeight <= 0 || iMaxWidth <= 0){
			throw new Error("Invalid values for maximumBoundaryHeigth and/or maximumBoundaryWidth, both must be > 0");
		}

		if (iMaxHeight && oImage.height > iMaxHeight) {
			oBoundary.width = oImage.width * ( iMaxHeight / oImage.height );
			oBoundary.height = iMaxHeight;
		}

		if (iMaxWidth && oImage.width > iMaxWidth) {
			oBoundary.height = oBoundary.height * ( iMaxWidth / oBoundary.width );
			oBoundary.width = iMaxWidth;
		}

		return oBoundary;
	};

	/**
 	 * Calculates FileName, MimeType, and Quality properties to be used for the file upload.
 	 *
 	 * @param {File} [oFile] the image (window.File)
 	 * @returns {object} an object containing the properties name (=filename), mimetype, quality (only for jpg)
 	 * @private
 	 */
	ImageFileUploader.prototype._calculateFileProperties = function (oFile) {
		var oProperties, sUploadType, sExtension;

		oProperties = {
			filename : oFile.name,
			mimetype : oFile.type,
			quality : undefined
		};

		sExtension = oFile.name.substr(oFile.name.lastIndexOf('.') + 1).toLowerCase();
		sUploadType = this.getUploadType();
		if (sUploadType === nabi.m.ImageType.Default) {
			return oProperties;

		} else if (sUploadType === nabi.m.ImageType.png){
			oProperties.filename = sExtension === "png" ? oProperties.filename : oProperties.filename + ".png";
			oProperties.mimetype = nabi.m.MimeType.PNG;

		} else if (sUploadType === nabi.m.ImageType.jpg){
			oProperties.filename = sExtension === "jpg" ? oProperties.filename : oProperties.filename + ".jpg";
			oProperties.mimetype = nabi.m.MimeType.JPEG;
			oProperties.quality = this.getScaledJpgQuality();
		}
		return oProperties;
	};

	/**
	 * Checks if the ImageFileUploader supports the current browser.
	 *
	 * @returns {boolean} true if the current browser supports this control, else false.
	 * @static
	 * @public
	 */
	ImageFileUploader.prototype.isBrowserSupported = function () {

	  function checkFileAPI() {
	    var fi = document.createElement('INPUT');
	    fi.type = 'file';
	    return window.File && 'files' in fi;
	  };

	  function checkAjaxUploadProgressEvents() {
	    var xhr = new XMLHttpRequest();
	    return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
	  };

	  function checkFormData() {
	    return !!window.FormData;
	  }

		return checkFileAPI() && checkAjaxUploadProgressEvents() && checkFormData();
	};

	return ImageFileUploader;

}, /* bExport= */ true);
