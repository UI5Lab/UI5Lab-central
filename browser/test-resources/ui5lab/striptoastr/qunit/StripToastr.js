 sap.ui.require([
     "ui5lab/striptoastr/StripToastr",
     "sap/ui/thirdparty/sinon",
     "sap/ui/thirdparty/sinon-qunit"
 ], function(StripToastr) {
     "use strict";
     sinon.config.useFakeTimers = false;
     var oCore = sap.ui.getCore();

     module("StripToastr basics", {
         teardown: function() {
             StripToastr.clear();
             oCore.applyChanges();
         }
     });

     test("should be rendered and have alert role", function() {
         // Arrange
         var oToast = StripToastr.notify({ text: "test1" });

         oCore.applyChanges();

         // Assert
         ok(oToast, "created");
         equal(oToast.$().attr("role"), "alert", "The alert role is set");
     });

     test("should show the newest message first", function() {
         // Arrange
         StripToastr._oSettings.newestFirst = true;

         // Act
         var aTexts = ["test1", "test2", "test3"]

         aTexts.forEach(function(sText) {
             StripToastr.notify({ text: sText });
         });

         oCore.applyChanges();

         // Assert
         var oContent = StripToastr.getContainer().getContent();
         var iLast = oContent.length - 1;
         var iFirst = 0;
         equal(oContent[iFirst].getText(), aTexts[iLast], "first message equals last text");
         equal(oContent[iLast].getText(), aTexts[iFirst], "last message equals first text");
         StripToastr._oSettings.newestFirst = false;
     });

     test("should trigger callback on close", function(assert) {
         // Arrange
         var done = assert.async();
         var delay = 1000;
         var fnCloseCallBackSpy = this.spy();

         var oControl = StripToastr.notify({
             text: "test1",
             close: fnCloseCallBackSpy
         });

         // Act
         oControl.close();

         // Assert
         setTimeout(function() {
             equal(fnCloseCallBackSpy.callCount, 1, "Close Callback reached");
             done();
         }, delay);
     });

     module("StripToast clear messages feature", {
         teardown: function() {
             StripToastr.clear();
             oCore.applyChanges();
         }
     });

     test("should destroy container if nothing to clear", function(assert) {
         // Arrange
         var delay = 500;
         var done = assert.async();
         var oContainer = StripToastr.getContainer({
             position: "left bottom",
             anchor: document
         });
         oCore.applyChanges();
         ok(oContainer.$(), "Container rendered");
         equal(oContainer.getContent().length, 0, "Container empty");

         // Act
         StripToastr.clear();
         // Assert
         setTimeout(function() {
             equal(oContainer.$().length, 0, "Container DOM was destroyed");
             done();
         }, delay);
     });

     test("should clear all shown messages and then destroy container", function(assert) {
         // Arrange
         var delay = 1000;
         var done = assert.async();
         ["test1", "test2", "test3"].map(function(sText) {
             return StripToastr.notify({ text: sText });
         })

         oCore.applyChanges();
         // Act
         StripToastr.clear();
         // Assert
         setTimeout(function() {
             var oContainer = StripToastr.getContainer();
             equal(oContainer, undefined, "Container was destroyed also");
             done();
         }, delay);

     });

     test("should show 3 messags and clear 2nd message only", function(assert) {
         // Arrange
         var delay = 1000;
         var done = assert.async();

         var aTexts = ["test1", "test2", "test3"];

         var aMessages = aTexts.map(function(sText) {
             return StripToastr.notify({ text: sText });
         });

         oCore.applyChanges();
         //Act
         StripToastr.clear(aMessages[1]); //clear second message
         // Assert
         setTimeout(function() {
             var aContent = StripToastr.getContainer().getContent();
             var aResults = aContent.map(function(oContent) { return oContent.getText() });
             var aExpected = aTexts.filter(function(_, i) { return i !== 1 });
             equal(aContent.length, 2, "Container has 2 controls");
             deepEqual(aResults, aExpected, "Container is missing second message");
             done();
         }, delay);

     });

     // Positioning started failing as the calculations get adjusted by Qunit runner
     module("StripToastr positioning", {
         teardown: function() {
             StripToastr.destroyContainer();
             oCore.applyChanges();
         }
     });

     QUnit.skip("should show message in Top right", function(assert) {
         // Arrange
         StripToastr.notify({
             text: "test1",
             position: "right top"
         });

         oCore.applyChanges();

         //Act
         var oContainer = StripToastr.getContainer();
         var oDomRef = oContainer.$();

         // Assert
         equal(oDomRef.css("right"), "0px", "Right 0px");
         equal(oDomRef.css("top"), "0px", "Top 0px");
     });

     QUnit.skip("should show message in Top left", function(assert) {
         // Arrange
         StripToastr.notify({
             text: "test1",
             position: "left top"
         });

         oCore.applyChanges();

         //Act
         var oContainer = StripToastr.getContainer();
         var oDomRef = oContainer.$();

         // Assert
         equal(oDomRef.css("left"), "0px", "Left 0px");
         equal(oDomRef.css("top"), "0px", "Top 0px");
     });

     QUnit.skip("should show message in Bottom right", function(assert) {
         // Arrange
         StripToastr.notify({
             text: "test1",
             position: "right bottom"
         });

         oCore.applyChanges();

         //Act
         var oContainer = StripToastr.getContainer();
         var oDomRef = oContainer.$();

         // Assert
         var iTop = jQuery(window).height() - oDomRef.height();
         equal(oDomRef.css("right"), "0px", "Right 0px");
         equal(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
     });

     QUnit.skip("should show message in Bottom left", function(assert) {
         // Arrange
         StripToastr.notify({
             text: "test1",
             position: "left bottom"
         });

         oCore.applyChanges();

         //Act
         var oContainer = StripToastr.getContainer();
         var oDomRef = oContainer.$();

         // Assert
         var iTop = jQuery(window).height() - oDomRef.height();
         equal(oDomRef.css("left"), "0px", "Left 0px");
         equal(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
     });

     QUnit.skip("should show message in Center center", function(assert) {
         // Arrange
         StripToastr.notify({
             text: "test1",
             position: "center center"
         });

         oCore.applyChanges();

         //Act
         var oContainer = StripToastr.getContainer();
         var oDomRef = oContainer.$();

         // Assert
         var iLeft = (jQuery(window).width() - oDomRef.width()) / 2;
         var iTop = (jQuery(window).height() - oDomRef.height()) / 2;
         equal(parseFloat(oDomRef.css("left")), iLeft, "Left " + iLeft + "px");
         equal(parseFloat(oDomRef.css("top")), iTop, "Top " + iTop + "px");
     });
 });