// Provides control it.designfuture.qrcode.QRCode
sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/HTML",
	"./thirdparty/js/qrcode.min"
], function (Control, HTML, qrcode) {
	"use strict";
	
	/**
	 * Constructor for a new QRCode.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * QRCode Control to render a QR Code
	 * @extends sap.ui.code.Control
	 * @version 1.0.2
	 *
	 * @constructor
	 * @public
	 * @since 1.40
	 * @name it.designfuture.qrcode.QRCode
	 */
	var QRCodeControl =  Control.extend("it.designfuture.qrcode.QRCode", {
		
		__qrcode: undefined,
		
		metadata : {
			library: 'it.designfuture.qrcode',
			properties: {
				
				/**
				 * QRCode's text
				 */
				text : {type : "string", group : "Appearance", defaultValue : null},
				
				/**
				 * QRCode's width
				 */
				width : {type : "int", group : "Appearance", defaultValue : 256},
				
				/**
				 * QRCode's height
				 */
				height : {type : "int", group : "Appearance", defaultValue : 256},
				
				/**
				 * HTML color (black/#ffffff) of the dark part of the QRCode
				 */
				colorDark : {type : "sap.ui.core.CSSColor", group : "Appearance", defaultValue : "#000000"},
				
				/**
				 * HTML color (white/#ffffff) of the dark part of the QRCode
				 */
				colorLight : {type : "sap.ui.core.CSSColor", group : "Appearance", defaultValue : "#ffffff"},
				
				/**
				 * Error correction level 0/1/2/3
				 */
				correctLevel : {type : "int", group : "Appearance", defaultValue : QRCode.CorrectLevel.H}
			},
			aggregations: {
				__qrcodeHTML : {type : "sap.ui.core.HTML", multiple: false, visibility : "hidden"}
			},
			events: {}
		},
		
		init: function() {
			this.setAggregation("__qrcodeHTML", new HTML({
				content: "<div class='openui5-qrcode' id='" + this.getId() + "-qrcode'></div>"
			}));
		},
		
		onAfterRendering: function() {
			var iCorrectLevel = this.getCorrectLevel() < 0 || this.getCorrectLevel() > 3 ? QRCode.CorrectLevel.H : this.getCorrectLevel();
			if( this.__qrcode ) {
				this.__qrcode._htOption.width = this.getWidth();
				this.__qrcode._htOption.height = this.getHeight();
				this.__qrcode._htOption.colorDark = this.getColorDark();
				this.__qrcode._htOption.colorLight = this.getColorLight();
				this.__qrcode._htOption.correctLevel = iCorrectLevel;
				if( this.getText() ) {
					this.__qrcode.makeCode( this.getText() );
				} else {
					this.__qrcode.clear();
				}
			} else {
				this.destroyQRCode();
				this.__qrcode = new QRCode( jQuery.sap.domById( this.getId() + "-qrcode" ), {
					text: this.getText(),
					width: this.getWidth(),
					height: this.getHeight(),
					colorDark: this.getColorDark(),
					colorLight: this.getColorLight(),
					correctLevel: iCorrectLevel
				});	
			}
		},
		
		//////////////////////////////////////////////
		// GETTER / SETTER
		//////////////////////////////////////////////
		
		/*
		* Set a new text of the QR Code
		* @public
		* @param {string} sText - Text of the QR Code
		* @param {boolean} bSkipDraw - skip the redraw
		*/
		setText: function(sText) {
			this.setProperty("text", sText, false);
			return this;
		},
		
		/*
		* Set the width of the QR Code
		* @public
		* @param {int} iWidth - Width of the QR Code
		*/
		setWidth: function(iWidth) {
			this.setProperty("width", iWidth, false);
			return this;
		},
		
		/*
		* Set the height of the QR Code
		* @public
		* @param {int} iHeight - Height of the QR Code
		*/
		setHeight: function(iHeight) {
			this.setProperty("height", iHeight, false);
			return this;
		},
		
		/*
		* Set the RGB dark color of the QR Code
		* @public
		* @param {string} sColorDark - RGB dark color of the QR Code
		*/
		setColorDark: function(sColorDark) {
			this.setProperty("colorDark", sColorDark, false);
			return this;
		},
		
		/*
		* Set the RGB light color of the QR Code
		* @public
		* @param {string} sColorLight - RGB light color of the QR Code
		* @param {boolean} bSkipDraw - skip the redraw
		*/
		setColorLight: function(sColorLight) {
			this.setProperty("colorLight", sColorLight, false);
			return this;
		},
		
		/*
		* Set the Error Correction Level of the QR Code
		* @public
		* @param {int} iCorrectLevel - RGB light color of the QR Code
		*/
		setCorrectLevel: function(iCorrectLevel) {
			if( isNaN(iCorrectLevel) ) {
				throw new Error("Value " + iCorrectLevel + " is not a valid integer for Error Correction Level");
			}
			
			var correctLevel = parseInt(iCorrectLevel, 10);
			if( iCorrectLevel < 0 || iCorrectLevel > 3 ) {
				throw new Error("Value " + correctLevel + " is not a valid value for Error Correction Level (min 0, max 3)");
			}
			
			this.setProperty("correctLevel", correctLevel, false);
			return this;
		},
		
		//////////////////////////////////////////////
		// QRCODE METHODS
		//////////////////////////////////////////////
		
		/*
		* Clear the QR Code
		*/
		clearQRCode: function() {
			if( this.__qrcode ) {
				this.__qrcode.clear();
			}
			return this;
		},
		
		/*
		* Destroy the QR Code
		*/
		destroyQRCode: function() {
			this.clearQRCode();
			this.__qrcode = undefined;
			return this;
		}
		
	});


	/*
	* Override the exit method to free local resources and destroy 
	* @public
	*/	
	QRCodeControl.prototype.exit = function() {
		this.destroyQRCode();
	};
	
	return QRCodeControl;

}, /* bExport= */ true);