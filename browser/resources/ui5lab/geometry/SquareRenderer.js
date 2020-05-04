/*!
 * ${copyright}
 */
sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){var a=t.getShape();e.write("<div");e.writeControlData(t);e.addClass("ui5labSquare");if(a===ui5lab.geometry.ShapeType.RoundCorners){e.addClass("ui5labSquareRound")}else{e.addClass("ui5labSquareAngled")}e.writeClasses();e.addStyle("width",t.getSize()+"px");e.addStyle("height",t.getSize()+"px");e.writeStyles();e.write(">");e.writeEscaped(t.getText());e.write("</div>")};return e},true);