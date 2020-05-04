sap.ui.require.preload({
	"ui5lab/geometry/Circle.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","./library","ui5lab/geometry/Square"],function(e,i,t){"use strict";var r=t.extend("ui5lab.geometry.Circle",{metadata:{library:"ui5lab.geometry"},init:function(){this.setSize(300);this.setText("Circle")}});return r});
},
	"ui5lab/geometry/CircleRenderer.js":function(){/*!
 * ${copyright}
 */
sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){e.write("<div");e.writeControlData(t);e.addClass("ui5labSquare");e.addClass("ui5labCircle");e.writeClasses();e.addStyle("width",t.getSize()+"px");e.addStyle("height",t.getSize()+"px");e.addStyle("line-height",t.getSize()-32+"px");e.writeStyles();e.write(">");e.writeEscaped(t.getText());e.write("</div>")};return e},true);
},
	"ui5lab/geometry/Square.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control"],function(e,t,a){"use strict";var r=a.extend("ui5lab.geometry.Square",{metadata:{library:"ui5lab.geometry",properties:{size:{type:"int",defaultValue:50},text:{type:"string",defaultValue:""},shape:{type:"ui5lab.geometry.ShapeType",defaultValue:"AngledCorners"}}},init:function(){}});return r});
},
	"ui5lab/geometry/SquareRenderer.js":function(){/*!
 * ${copyright}
 */
sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){var a=t.getShape();e.write("<div");e.writeControlData(t);e.addClass("ui5labSquare");if(a===ui5lab.geometry.ShapeType.RoundCorners){e.addClass("ui5labSquareRound")}else{e.addClass("ui5labSquareAngled")}e.writeClasses();e.addStyle("width",t.getSize()+"px");e.addStyle("height",t.getSize()+"px");e.writeStyles();e.write(">");e.writeEscaped(t.getText());e.write("</div>")};return e},true);
},
	"ui5lab/geometry/Triangle.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control"],function(t,e,i){"use strict";var o=i.extend("ui5lab.geometry.Triangle",{metadata:{library:"ui5lab.geometry",properties:{size:{type:"int",defaultValue:300},rotation:{type:"int",defaultValue:0},text:{type:"string",defaultValue:""}},aggregations:{_rotationLabel:{type:"sap.m.Label"}},events:{press:{parameters:{rotation:{type:"int"}}}}},init:function(){},onAfterRendering:function(){this.$().bind("contextmenu",function(t){return false})},setRotation:function(t){try{t=t%360}catch(t){}this.setProperty("rotation",t,true);t=this.getProperty("rotation");this.$().css("transform","rotate("+t+"deg)");this.$("rotation").text(t+"°")},onmousedown:function(t){switch(t.which){case 2:this._bRotationModifier=2;break;case 3:this._bRotationModifier=-1;break;case 1:default:this._bRotationModifier=1;break}this._rotationInterval=setInterval(function(){this.setRotation(this.getRotation()+this._bRotationModifier)}.bind(this),10)},onmouseup:function(t){clearInterval(this._rotationInterval);this.firePress({rotation:this.getRotation()})},onsapincrease:function(){this.setRotation(this.getRotation()+15)},onsapdecrease:function(){this.setRotation(this.getRotation()-15)}});return o});
},
	"ui5lab/geometry/TriangleRenderer.js":function(){/*!
 * ${copyright}
 */
sap.ui.define([],function(){"use strict";var t={};t.render=function(t,e){t.write("<div");t.writeControlData(e);t.writeAttribute("tabindex","0");t.addClass("ui5labTriangle");t.writeClasses();t.addStyle("border-width","0 "+e.getSize()/2+"px "+e.getSize()*.86+"px "+e.getSize()/2+"px");t.addStyle("transform","rotate("+e.getRotation()+"deg)");t.writeStyles();t.write(">");t.write('<div class="ui5labTriangleText"');t.addStyle("top",e.getSize()/2.5+"px");t.addStyle("left","-"+e.getSize()/2+"px");t.addStyle("width",e.getSize()+"px");t.writeStyles();t.write(">");t.write('<div id="'+e.getId()+'-rotation" class="ui5labTriangleRotation">');t.writeEscaped(e.getRotation()+"°");t.write("</div>");t.writeEscaped(e.getText());t.write("</div>");t.write("</div>")};return t},true);
},
	"ui5lab/geometry/library.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library"],function(e,r){"use strict";sap.ui.getCore().initLibrary({name:"ui5lab.geometry",dependencies:["sap.ui.core"],types:["ui5lab.geometry.SquareType"],interfaces:[],controls:["ui5lab.geometry.Square","ui5lab.geometry.Circle","ui5lab.geometry.Triangle"],elements:[],noLibraryCSS:false,version:"1.0.0"});ui5lab.geometry.ShapeType={RoundCorners:"RoundCorners",AngledCorners:"AngledCorners"};return ui5lab.geometry});
},
	"ui5lab/geometry/manifest.json":'{"_version":"1.9.0","sap.app":{"id":"ui5lab.geometry","type":"library","embeds":[],"applicationVersion":{"version":"1.0.0"},"title":"UI5 library: ui5lab.geometry","description":"UI5 library: ui5lab.geometry","resources":"resources.json","offline":true},"sap.ui":{"technology":"UI5","supportedThemes":["base","sap_belize","sap_belize_plus","sap_hcb"]},"sap.ui5":{"dependencies":{"minUI5Version":"1.60","libs":{"sap.ui.core":{"minVersion":"1.60.0"}}},"library":{"i18n":false,"content":{"controls":["ui5lab.geometry.Square","ui5lab.geometry.Circle","ui5lab.geometry.Triangle"],"elements":[],"types":["ui5lab.geometry.SquareType"],"interfaces":[]}}}}'
});
