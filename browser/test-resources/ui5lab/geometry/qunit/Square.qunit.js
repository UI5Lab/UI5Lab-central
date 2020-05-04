sap.ui.require([
	"ui5lab/geometry/Square"
], function(Square) {
	"use strict";

	QUnit.test("Should instantiate the control with defaults", function (assert) {
		var oSquare = new Square();
		assert.strictEqual(oSquare.getSize(), 50);
		assert.strictEqual(oSquare.getText(), "");
		assert.strictEqual(oSquare.getShape(), "AngledCorners");
	});
});
