'use strict';

var fs = require('fs-extra');

/**************************
 * UI5 and browser:
 * Copy the browser project and all needed UI5 libraries from npm_modules to a local folder
 *************************/

var sSrcPath = './browser/resources'; // library preloads and the actual source code (if available)
var sTestPath = './browser/test-resources'; // samples, demos, tests

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist/', './browser');

// ui5
fs.copySync('./node_modules/@openui5/sap.f/src', sSrcPath);
fs.copySync('./node_modules/@openui5/sap.m/src', sSrcPath);
fs.copySync('./node_modules/@openui5/sap.ui.layout/src', sSrcPath);
fs.copySync('./node_modules/@openui5/sap.ui.core/src', sSrcPath);
fs.copySync('./node_modules/@openui5/sap.ui.unified/src', sSrcPath);
fs.copySync('./node_modules/@openui5/themelib_sap_belize/src', sSrcPath);

/**************************
 * UI5Lab projects:
 * Copy all loaded projects to the appropriate places (resources and test-resources)
 **************************/

// TODO: detect projects dynamically and copy them based on metadata in libraries.json file

// ui5lab.geometry
try {
	fs.copySync('./node_modules/ui5lab-library-simple/dist/resources/', sSrcPath);
	fs.copySync('./node_modules/ui5lab-library-simple/dist/test-resources/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.geometry library: " + e.message);
}

// ui5lab.striptoastr
try {
	fs.copySync('./node_modules/striptoastr/dist/', sSrcPath);
	fs.copySync('./node_modules/striptoastr/test/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.striptoastr library: " + e.message);
}

// it.designfuture.qrcode
try {
	fs.copySync('./node_modules/openui5-qrcode/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-qrcode/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-qrcode/test/demo/', sTestPath + '/it/designfuture/qrcode');
	fs.copySync('./node_modules/openui5-qrcode/test/index.json', sTestPath + '/it/designfuture/qrcode/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.qrcode library: " + e.message);
}

// it.designfuture.flatpickr
try {
	fs.copySync('./node_modules/openui5-flatpickr/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-flatpickr/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-flatpickr/test/demo/', sTestPath + '/it/designfuture/flatpickr');
	fs.copySync('./node_modules/openui5-flatpickr/test/index.json', sTestPath + '/it/designfuture/flatpickr/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.flatpickr library: " + e.message);
}

// it.designfuture.multiinputdialog
try {
	fs.copySync('./node_modules/openui5-multiinputdialog/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-multiinputdialog/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-multiinputdialog/test/demo/', sTestPath + '/it/designfuture/multiinputdialog');
	fs.copySync('./node_modules/openui5-multiinputdialog/test/index.json', sTestPath + '/it/designfuture/multiinputdialog/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.multiinputdialog library: " + e.message);
}

// nabi.m
try {
	fs.copySync('./node_modules/ui5-nabi-m/dist/resources/', sSrcPath);
	fs.copySync('./node_modules/ui5-nabi-m/dist/test-resources/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the nabi.m library: " + e.message);
}

// openui5.googlemaps
try {
	fs.copySync('./node_modules/openui5-googlemaps/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-googlemaps/test/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the openui5.googlemaps library: " + e.message)
}

// openui5.parallax
try {
	fs.copySync('./node_modules/openui5-parallax/dist/resources/', sSrcPath);
	fs.copySync('./node_modules/openui5-parallax/dist/test-resources/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the openui5.parallax library: " + e.message);
}

// it.designfuture.chartjs
try {
	fs.copySync('./node_modules/openui5-chartjs/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-chartjs/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-chartjs/test/demo/', './test/it/designfuture/chartjs');
	fs.copySync('./node_modules/openui5-chartjs/test/index.json', './test/it/designfuture/chartjs/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.chartjs library: " + e.message);
}

// it.designfuture.toastr
try {
	fs.copySync('./node_modules/openui5-toastr/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-toastr/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-toastr/test/demo/', sTestPath + '/it/designfuture/toastr');
	fs.copySync('./node_modules/openui5-toastr/test/index.json', sTestPath + '/it/designfuture/toastr/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.toastr library: " + e.message);
}

// ui5lab.wordcloud
try {
	fs.copySync('./node_modules/ui5lab-wordcloud/dist/resources', sSrcPath);
	fs.copySync('./node_modules/ui5lab-wordcloud/dist/test-resources', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wordcloud library: " + e.message);
}

// it.designfuture.toastr
try {
	fs.copySync('./node_modules/openui5-swissknife/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-swissknife/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-swissknife/test/demo-1-49/', sTestPath + '/it/designfuture/swissknife');
	fs.copySync('./node_modules/openui5-swissknife/test/index.json', sTestPath + '/it/designfuture/swissknife/index.json');
} catch (e) {
	console.log("an error occured post-processing the it.designfuture.swissknife library: " + e.message);
}

// ui5lab.wl.pdf
try {
	fs.copySync('./node_modules/ui5lab-wl-pdf/dist/resources', sSrcPath);
	fs.copySync('./node_modules/ui5lab-wl-pdf/dist/test-resources', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.pdf library: " + e.message);
}

// openui5-camera
try {
	fs.copySync('./node_modules/openui5-camera/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-camera/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-camera/test/openui5/camera/index.json', sTestPath + '/openui5/camera/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-camera library: " + e.message);
}


// ui5lab.wl.img
try {
	fs.copySync('./node_modules/ui5lab-wl-img/dist/resources', sSrcPath);
	fs.copySync('./node_modules/ui5lab-wl-img/dist/test-resources', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.img library: " + e.message);
}

// ui5lab.wl.space
try {
	fs.copySync('./node_modules/ui5lab-wl-space/dist/resources/', sSrcPath);
	fs.copySync('./node_modules/ui5lab-wl-space/dist/test-resources/', sTestPath);
} catch (e) {
	console.log("an error occured post-processing the ui5lab.wl.space library: " + e.message);
}

// openui5-tour
try {
	fs.copySync('./node_modules/openui5-tour/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-tour/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-tour/demo/', sTestPath + '/openui5/tour');
	fs.copySync('./node_modules/openui5-tour/test/openui5/tour/index.json', sTestPath + '/openui5/tour/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-tour library: " + e.message);
}

// openui5-smart-mockserver
try {
	fs.copySync('./node_modules/openui5-smart-mockserver/dist/', sSrcPath);
	fs.copySync('./node_modules/openui5-smart-mockserver/src/', sSrcPath);
	fs.copySync('./node_modules/openui5-smart-mockserver/demo/', sTestPath + '/openui5/tour');
	fs.copySync('./node_modules/openui5-smart-mockserver/test/openui5/smartmockserver/index.json', sTestPath + '/openui5/smartmockserver/index.json');
} catch (e) {
	console.log("an error occured post-processing the openui5-smart-mockserver library: " + e.message);
}

// copy central library.json that lists all UI5Lab projects
fs.copySync('./libraries.json', './browser/libraries.json');

/**************************
 * Deploy preparations:
 * Copy everything to be deployed in deploy folder
 **************************/

// copy preview page by @nitishmeta to root folder
fs.copySync('./homepage', './deploy');
// copy docsify pages by @nlsltz to docs folder
fs.copySync('./docs', './deploy/docs');
// copy browser to subfolder browser for the moment
fs.copySync('./browser', './deploy/browser');
// update index.html to use CDN instead of local resources
fs.copySync('./index.html', './deploy/browser/index.html');
