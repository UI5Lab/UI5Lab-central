var fs = require('fs-extra');

/**************************
 * UI5 and browser:
 * Copy the browser project and all needed UI5 libraries from npm_modules and bower_components to a local folder
 *************************/

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist/test-resources/ui5lab/browser', './test/ui5lab/browser');

// ui5
fs.copySync('./bower_components/openui5-sap.f/resources', './resources');
fs.copySync('./bower_components/openui5-sap.m/resources', './resources');
fs.copySync('./bower_components/openui5-sap.ui.layout/resources', './resources');
fs.copySync('./bower_components/openui5-sap.ui.core/resources', './resources');
fs.copySync('./bower_components/openui5-sap.ui.unified/resources', './resources');
fs.copySync('./bower_components/openui5-themelib_sap_belize/resources', './resources');

/**************************
 * UI5Lab projects:
 * Copy all loaded projects to the appropriate places (resources and test-resources)
 **************************/

// TODO: detect projects dynamically and copy them based on metadata in libraries.json file

// ui5lab.geometry
try {
	fs.copySync('./node_modules/ui5lab-library-simple/dist/resources/', './resources');
	fs.copySync('./node_modules/ui5lab-library-simple/dist/test-resources/', './test');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.geometry library: " + e.message);
}

// ui5lab.striptoastr
try {
	fs.copySync('./node_modules/striptoastr/dist/', './resources');
	fs.copySync('./node_modules/striptoastr/test/', './test');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.striptoastr library: " + e.message);
}

// it.designfuture.qrcode
try {
	fs.copySync('./node_modules/openui5-qrcode/dist/', './resources');
	fs.copySync('./node_modules/openui5-qrcode/src/', './src');
	fs.copySync('./node_modules/openui5-qrcode/test/demo/', './test/it/designfuture/qrcode');
	fs.copySync('./node_modules/openui5-qrcode/test/index.json', './test/it/designfuture/qrcode/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.qrcode library: " + e.message);
}

// nabi.m
try {
	fs.copySync('./node_modules/ui5-nabi-m/dist/resources/', './resources');
	fs.copySync('./node_modules/ui5-nabi-m/dist/test-resources/', './test');
} catch (e) {
	console.log("an error occured post-processing the nabi.m library: " + e.message);
}

// openui5.googlemaps
try {
	fs.copySync('./node_modules/openui5-googlemaps/dist/', './resources');
	fs.copySync('./node_modules/openui5-googlemaps/test/', './test');
} catch (e) {
	console.log("an error occured post-processing the openui5.googlemaps library: " + e.message)
}

// copy central library.json that lists all UI5Lab projects
fs.copySync('./libraries.json', './test/libraries.json');

/**************************
 * Deploy preparations:
 * Copy everything to be deployed in deploy folder
 **************************/

// copy preview page by @nitishmeta to root folder
fs.copySync('./preview', './deploy');
// copy browser to subfolder browser for the moment
fs.copySync('./resources', './deploy/browser/resources');
fs.copySync('./test', './deploy/browser/test');
fs.copySync('./index.html', './deploy/browser/index.html');