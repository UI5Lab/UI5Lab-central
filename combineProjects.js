var fs = require('fs-extra');

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist/test-resources/ui5lab/browser', './test/ui5lab/browser');

// copy all loaded projects to the appropriate places (resources and test-resources)
// TODO: detect projects dynamically and copy them based on metadata in libraries.json file

// ui5
fs.copySync('./bower_components/openui5-sap.f/resources', './resources');
fs.copySync('./bower_components/openui5-sap.m/resources', './resources');
fs.copySync('./bower_components/openui5-sap.ui.layout/resources', './resources');
fs.copySync('./bower_components/openui5-sap.ui.core/resources', './resources');
fs.copySync('./bower_components/openui5-themelib_sap_belize/resources', './resources');

// ui5lab.geometry
fs.copySync('./node_modules/ui5lab-library-simple/dist/resources/', './resources');
fs.copySync('./node_modules/ui5lab-library-simple/dist/test-resources/', './test');

// ui5lab.striptoastr
fs.copySync('./node_modules/striptoastr/dist/', './resources');
fs.copySync('./node_modules/striptoastr/test/', './test');

// it.designfuture.qrcode
fs.copySync('./node_modules/openui5-qrcode/dist/', './resources');
fs.copySync('./node_modules/openui5-qrcode/src/', './src');
fs.copySync('./node_modules/openui5-qrcode/test/demo', './test/it/designfuture/qrcode');
fs.copySync('./node_modules/openui5-qrcode/test/index.json', './test/it/designfuture/qrcode/index.json');

// nabi.m
fs.copySync('./node_modules/ui5-nabi-m/dist/resources/', './resources');
fs.copySync('./node_modules/ui5-nabi-m/dist/test-resources/', './test');

// copy central library.json that lists all UI5Lab projects
fs.copySync('./libraries.json', './test/libraries.json');

// copy everything to be deployed in deploy folder
// copy preview page by @nitishmeta to root folder
fs.copySync('./preview', './deploy');
// copy browser to subfolder browser for the moment
fs.copySync('./resources', './deploy/browser/resources');
fs.copySync('./test', './deploy/browser/test');
fs.copySync('./index.html', './deploy/browser/index.html');

