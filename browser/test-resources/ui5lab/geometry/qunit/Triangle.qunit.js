sap.ui.require([
	"ui5lab/geometry/Triangle"
], function(Triangle) {
	"use strict";

	QUnit.test("Should instantiate the control with defaults", function (assert) {
		var oTriangle = new Triangle();
		assert.strictEqual(oTriangle.getSize(), 300);
		assert.strictEqual(oTriangle.getText(), "");
		assert.strictEqual(oTriangle.getRotation(), 0);
	});
});
