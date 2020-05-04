sap.ui.require([
	"nabi/m/PDFViewer"
], function(PDFViewer) {
	"use strict";

	QUnit.test("Should instantiate the control with defaults", function (assert) {
		var oPDFViewer = new PDFViewer();
		assert.strictEqual(oPDFViewer.getHeight(), "100%");
		assert.strictEqual(oPDFViewer.getWidth(), "100%");
	});
});
