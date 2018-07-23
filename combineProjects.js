'use strict';

var fs = require('fs-extra');

/**************************
 * UI5 and browser:
 * Copy the browser project and all needed UI5 libraries from npm_modules to a local folder
 *************************/

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist/test-resources/ui5lab/browser', './test/ui5lab/browser');

// ui5
fs.copySync('./node_modules/@openui5/sap.f/src', './resources');
fs.copySync('./node_modules/@openui5/sap.m/src', './resources');
fs.copySync('./node_modules/@openui5/sap.ui.layout/src', './resources');
fs.copySync('./node_modules/@openui5/sap.ui.core/src', './resources');
fs.copySync('./node_modules/@openui5/sap.ui.unified/src', './resources');
fs.copySync('./node_modules/@openui5/themelib_sap_belize/src', './resources');

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

// it.designfuture.toastr
try {
	fs.copySync('./node_modules/openui5-swissknife/dist/', './resources');
	fs.copySync('./node_modules/openui5-swissknife/src/', './src');
	fs.copySync('./node_modules/openui5-swissknife/test/demo-1-49/', './test/it/designfuture/swissknife');
	fs.copySync('./node_modules/openui5-swissknife/test/index.json', './test/it/designfuture/swissknife/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.swissknife library: " + e.message);
}

// ui5lab.wl.pdf
try {
	fs.copySync('./node_modules/ui5lab-wl-pdf/dist/resources', './resources');
	fs.copySync('./node_modules/ui5lab-wl-pdf/dist/test-resources', './test');
	//fs.copySync('./node_modules/ui5lab-wl-pdf/test/ui5lab/wl/pdf/index.json', './test/ui5lab/wl/pdf/index.json');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.pdf library: " + e.message);
}

// openui5-camera
try {
	fs.copySync('./node_modules/openui5-camera/dist/', './resources');
	fs.copySync('./node_modules/openui5-camera/test/openui5/camera/index.json', './test/openui5/camera/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-camera library: " + e.message);
}


// ui5lab.wl.img
try {
	fs.copySync('./node_modules/ui5lab-wl-img/dist/resources', './resources');
	fs.copySync('./node_modules/ui5lab-wl-img/dist/test-resources', './test');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.img library: " + e.message);
}

// ui5lab.wl.space
try {
	fs.copySync('./node_modules/ui5lab-wl-space/dist/resources/', './resources');
	fs.copySync('./node_modules/ui5lab-wl-space/dist/test-resources/', './test');
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.space library: " + e.message);
}

// openui5-tour
try {
	fs.copySync('./node_modules/openui5-tour/dist/', './resources');
	fs.copySync('./node_modules/openui5-tour/src/', './src');
	fs.copySync('./node_modules/openui5-tour/demo/', './test/openui5/tour');
	fs.copySync('./node_modules/openui5-tour/test/openui5/tour/index.json', './test/openui5/tour/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-tour library: " + e.message);
}

// openui5-smart-mockserver
try {
	fs.copySync('./node_modules/openui5-smart-mockserver/dist/', './resources');
	fs.copySync('./node_modules/openui5-smart-mockserver/src/', './src');
	fs.copySync('./node_modules/openui5-smart-mockserver/demo/', './test/openui5/tour');
	fs.copySync('./node_modules/openui5-smart-mockserver/test/openui5/smartmockserver/index.json', './test/openui5/smartmockserver/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-smart-mockserver library: " + e.message);
}


// copy central library.json that lists all UI5Lab projects
fs.copySync('./libraries.json', './test/libraries.json');

/**************************
 * Deploy preparations:
 * Copy everything to be deployed in deploy folder
 **************************/

// copy preview page by @nitishmeta to root folder
fs.copySync('./homepage', './deploy');
// copy docsify pages by @nlsltz to docs folder
fs.copySync('./docs', './deploy/docs');
// copy browser to subfolder browser for the moment
fs.copySync('./resources', './deploy/browser/resources');
fs.copySync('./test', './deploy/browser/test');
fs.copySync('./index.html', './deploy/browser/index.html');
