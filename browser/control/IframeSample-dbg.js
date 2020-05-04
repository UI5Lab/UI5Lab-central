sap.ui.define([
	'sap/ui/core/Control',
	'sap/ui/core/HTML'
],
function(Control, HTML) {
	"use strict";

	/**
	 * Constructor for a new Square control.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Squares are awesome geometrical shapes that are underepresented in today's modern UIs
	 * @extends sap.ui.core.Control
	 *
	 * @public
	 * @alias ui5lab.geometry.Square
	 */
	var oIframeSample = Control.extend("ui5lab.browser.control.IframeSample", {
		/**
		 * Control API
		 */
		metadata: {
			properties: {
				/**
				 * The target URI
				 */
				href : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
			},
			aggregations : {
				/**
				 * The internal HTML control that will be rendered
				 */
				_HTML : {type : "sap.ui.core.HTML", multiple : false, visibility : "hidden"}
			},
		},

		/**
		 * Lifecycle hook to initialize the control
		 */
		init: function () {
			this.setAggregation("_HTML", this._createIframe());
		},

		/**
		 * Setter for the href property
		 * @override
		 */
		setHref: function(sHref) {
			this.setProperty("href", sHref, true);
			this.$().find("iframe").attr("src", sHref);
		},

		_createIframe : function () {
			var oHtmlControl = new HTML({
				id : "sampleFrame",
				content : '<iframe src="' + this.getHref()+ '" width="100%" height="100%" id="sampleFrame" frameBorder="0"></iframe>'
			}).addEventDelegate({
				onAfterRendering : function () {
					oHtmlControl.$().on("load", function () {
						var oSampleFrame = oHtmlControl.$()[0].contentWindow;

						// sync theme and content density
						if (oSampleFrame.sap) {
							oSampleFrame.sap.ui.getCore().attachInit(function () {
								var oSampleFrame = oHtmlControl.$()[0].contentWindow;
								oSampleFrame.sap.ui.getCore().applyTheme(sap.ui.getCore().getConfiguration().getTheme());
								oSampleFrame.document.body.classList.toggle("sapUiSizeCompact", document.body.classList.contains("sapUiSizeCompact"));
								oSampleFrame.document.body.classList.toggle("sapUiSizeCozy", document.body.classList.contains("sapUiSizeCozy"));
							});
						}
					});
				}
			});

			return oHtmlControl;
		},

		/**
		 * Renders the HTML for the control, using the provided {@link sap.ui.core.RenderManager}.
		 *
		 * @param {sap.ui.core.RenderManager} oRm RenderManager object
		 * @param {sap.ui.core.Control} oControl An object representation of the control that will be rendered
		 */
		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);

			oRm.addClass("ui5labBrowserIframe");
			oRm.writeClasses();

			oRm.addStyle("width", "100%");
			oRm.addStyle("height", "100%");
			oRm.writeStyles();

			oRm.write(">");

			oRm.renderControl(oControl.getAggregation("_HTML"));

			oRm.write("</div>");
		}
	});

	return oIframeSample;

});
