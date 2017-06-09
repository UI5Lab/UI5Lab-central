var fs = require('fs-extra');

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist/test-resources/ui5lab/browser', './test/ui5lab/browser');

// copy all loaded projects to the appropriate places (resources and test-resources)
// TODO: detect projects dynamically and copy them based on metadata in libraries.json file
fs.copySync('./node_modules/ui5lab-library-simple/dist/resources/', './src');
fs.copySync('./node_modules/ui5lab-library-simple/dist/test-resources/', './test');
fs.copySync('./node_modules/striptoastr/dist/', './src');
fs.copySync('./node_modules/striptoastr/test/', './test');

// copy central library.json that lists all UI5Lab projects
fs.copySync('./libraries.json', './test/libraries.json');

