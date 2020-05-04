sap.ui.require([
	"ui5lab/geometry/Circle"
], function(Circle) {
	"use strict";

	QUnit.test("Should instantiate the control with defaults", function (assert) {
		var oCircle = new Circle();
		assert.strictEqual(oCircle.getSize(), 300);
		assert.strictEqual(oCircle.getText(), "Circle");
	});
});
