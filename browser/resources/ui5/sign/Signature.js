sap.ui.define(["sap/ui/core/Control", "./library"], function(Control, library) {
  "use strict";

  /**
   * Constructor for Signature control (based on http://bl.ocks.org/elidupuis/11325438)
   * @param {string} [sId] ID for the new control, generated automatically if no ID is given
   * @param {object} [mSettings] Initial settings for the new control
   * @extends sap.ui.core.Control
   * @author Srikanth KV
   * @version 1.0.0
   * @constructor
   * @public
   */
  var oSignature = Control.extend("ui5.sign.Signature", {
    metadata: {
      library: "ui5.sign",
      properties: {
        /**
         * Defines height of the control
         */
        height: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
        /**
         * Defines width of the control
         */
        width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
        /**
         * Defines background color of the control
         */
        backgroundColor: {
          type: "sap.ui.core.CSSColor",
          defaultValue: "rgb(221, 221, 221)"
        },
        /**
         * Defines color of pen/mouse/pointer for the control
         */
        penColor: { type: "sap.ui.core.CSSColor", defaultValue: "black" },
        /**
         * Defines size/width of pen
         */
        penSize: { type: "int", defaultValue: 2 },

        /**
         * Defines if the control is editable or not
         */
        editable: { type: "boolean", defaultValue: true }
      },
      aggregations: {},
      associations: {},
      events: {}
    },

    init: function() {},

    onBeforeRendering: function() {},

    onAfterRendering: function() {
      if (this.getEditable()) {
        this._attachEvents();
      }
    },

    exit: function() {
      this._cleanUp();
    },

    /**
     * Attach mouse and touch events for the control
     * @private
     */
    _attachEvents: function() {
      // bind mousemove event
      var oSVG = this._getD3SVG();

      // mouse events
      oSVG.on("mousedown", _onStartDrawing.bind(this)); // bind control to event handler this
      oSVG.on("mouseup", _onStopDrawing);
      oSVG.on("mouseleave", _onStopDrawing);
      oSVG.on("mousemove", _onMove);

      // touch events
      oSVG.on("touchstart", _onStartDrawing.bind(this)); // bind control to event handler this
      oSVG.on("touchcancel", _onStopDrawing);
      oSVG.on("touchend", _onStopDrawing);
      oSVG.on("touchmove", _onMove);
    },

    setPenColor: function(sColor) {
      this.setProperty("penColor", sColor, true); // true - avoid rerender
      return this;
    },

    setPenSize: function(nValue) {
      if (nValue < 1) {
        jQuery.sap.log.error("Property 'penSize' cannot be less than 1");
      }
      this.setProperty("penSize", nValue, true); // true - avoid rerender
      return this;
    },

    /**
     * Helper method to access SVG element via d3 (internal)
     *
     * @returns {object} Returns d3 selector for svg
     */
    _getD3SVG: function() {
      return d3.select("#" + this.getId()).select("svg");
    },

    /**
     * Unbind browser events and variables to avoid memory leaks (internal)
     */
    _cleanUp: function() {
      // unbind browser events
      this._getD3SVG().on("mousedown", null);
      this._getD3SVG().on("mousemove", null);
      this._getD3SVG().on("mouseup", null);
      this._getD3SVG().on("mouseleave", null);

      this._getD3SVG().on("touchstart", null);
      this._getD3SVG().on("touchcancel", null);
      this._getD3SVG().on("touchend", null);
      this._getD3SVG().on("touchmove", null);
    },

    /**
     * @returns {string} returns svg as string
     */
    getSVGString: function() {
      return d3.select("#" + this.getId()).html();
    },

    /**
     * Provided SVG string input is rendered onto the screen.
     * Also set's property 'editable' to false which makes the control
     *    not editable for input
     * @param {string} sSvg - SVG as string
     * @returns {this} Current control reference
     */
    setSVGString: function(sSvg) {
      d3.select("#" + this.getId()).node().innerHTML = sSvg;
      this.setEditable(false);
      return this;
    },

    /**
     * Enables or disables control for input based on input parameter
     * @param {boolean} bFlag boolean falg to enable/disable
     * @returns {this} Current control reference
     */
    setEditable: function(bFlag) {
      // remove event handlers...so that control becomes non-editable
      this.setProperty("editable", bFlag, true); // true - avoid rerender
      if (bFlag) {
        this._attachEvents();
      } else {
        this._cleanUp();
      }
      return this;
    },

    /**
     * clears svg content
     * @returns {this} Current control reference
     */
    clear: function() {
      this.rerender();
      return this;
    }
  });

  /********************************************************
   * PRIVATE METHODS
   *******************************************************/

  // store x,y co-ordinates of path
  var _aPointData = [];

  // svg path
  var _sPath;

  // flag to indicate when to start and stop drawing
  var _bStartDrawing = false;

  // d3's line generator
  var _createLine = d3.svg
    .line()
    .interpolate("bundle")
    .tension(1)
    .x(function(d) {
      return d.x;
    })
    .y(function(d) {
      return d.y;
    });

  /**
   * @private
   * Event handler method to start drawing
   * Note: 'this' is bound to UI control
   */
  function _onStartDrawing() {
    _bStartDrawing = true;

    // create new path for every mouse down
    _aPointData = []; // clear point data before starting new path
    var oSvg = d3.select(d3.event.target);
    _sPath = oSvg
      .append("path")
      .data([_aPointData])
      .attr("fill", "none")
      .attr("stroke-linejoin", "round")
      .attr("stroke", this.getPenColor())
      .attr("stroke-width", this.getPenSize())
      .attr("d", _createLine);
  }

  /**
   * @private
   * Event handler to stop drawing
   */
  function _onStopDrawing() {
    // stop drawing
    _bStartDrawing = false;
  }

  /**
   * @private
   * Event handler that creates line data when mouse/pointer is moved
   */
  function _onMove() {
    if (_bStartDrawing) {
      var oMousePointer = d3.mouse(this);
      _aPointData.push({ x: oMousePointer[0], y: oMousePointer[1] });

      _sPath.attr("d", function(d) {
        return _createLine(d);
      });
    }
  }

  return oSignature;
});
