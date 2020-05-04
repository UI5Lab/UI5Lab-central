/*!
 * ${copyright}
 */
sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){e.write("<div");e.writeControlData(t);e.addClass("ui5labSquare");e.addClass("ui5labCircle");e.writeClasses();e.addStyle("width",t.getSize()+"px");e.addStyle("height",t.getSize()+"px");e.addStyle("line-height",t.getSize()-32+"px");e.writeStyles();e.write(">");e.writeEscaped(t.getText());e.write("</div>")};return e},true);