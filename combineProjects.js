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
	fs.copySync('./node_modules/openui5-qrcode/src/', './resources');
	fs.copySync('./node_modules/openui5-qrcode/test/demo/', './test/it/designfuture/qrcode');
	fs.copySync('./node_modules/openui5-qrcode/test/index.json', './test/it/designfuture/qrcode/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.qrcode library: " + e.message);
}

// it.designfuture.flatpickr
try {
	fs.copySync('./node_modules/openui5-flatpickr/dist/', './resources');
	fs.copySync('./node_modules/openui5-flatpickr/src/', './src');
	fs.copySync('./node_modules/openui5-flatpickr/test/demo/', './test/it/designfuture/flatpickr');
	fs.copySync('./node_modules/openui5-flatpickr/test/index.json', './test/it/designfuture/flatpickr/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.flatpickr library: " + e.message);
}

// it.designfuture.multiinputdialog
try {
	fs.copySync('./node_modules/openui5-multiinputdialog/dist/', './resources');
	fs.copySync('./node_modules/openui5-multiinputdialog/src/', './src');
	fs.copySync('./node_modules/openui5-multiinputdialog/test/demo/', './test/it/designfuture/multiinputdialog');
	fs.copySync('./node_modules/openui5-multiinputdialog/test/index.json', './test/it/designfuture/multiinputdialog/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.multiinputdialog library: " + e.message);
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

// openui5.parallax
try {
	fs.copySync('./node_modules/openui5-parallax/dist/resources/', './resources');
	fs.copySync('./node_modules/openui5-parallax/dist/test-resources/', './test');
} catch (e) {
	console.log("an error occured post-processing the openui5.parallax library: " + e.message);
}

// it.designfuture.chartjs
try {
	fs.copySync('./node_modules/openui5-chartjs/dist/', './resources');
	fs.copySync('./node_modules/openui5-chartjs/src/', './src');
	fs.copySync('./node_modules/openui5-chartjs/test/demo/', './test/it/designfuture/chartjs');
	fs.copySync('./node_modules/openui5-chartjs/test/index.json', './test/it/designfuture/chartjs/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.chartjs library: " + e.message);
}

// it.designfuture.toastr
try {
	fs.copySync('./node_modules/openui5-toastr/dist/', './resources');
	fs.copySync('./node_modules/openui5-toastr/src/', './src');
	fs.copySync('./node_modules/openui5-toastr/test/demo/', './test/it/designfuture/toastr');
	fs.copySync('./node_modules/openui5-toastr/test/index.json', './test/it/designfuture/toastr/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.toastr library: " + e.message);
}

// ui5lab.wordcloud
try {
	fs.copySync('./node_modules/ui5lab-wordcloud/dist/resources', './resources');
	fs.copySync('./node_modules/ui5lab-wordcloud/dist/test-resources', './test');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wordcloud library: " + e.message);
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
