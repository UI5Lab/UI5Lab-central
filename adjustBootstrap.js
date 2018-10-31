'use strict';

const optionDefinitions = [
	{ name: 'deploy', alias: 'd', type: Boolean } // determines deploy step to gh-pages without ui5 build tools
];

const commandLineArgs = require('command-line-args');
const fs = require('fs-extra');
const replace = require('replace-in-file');

// config parameters
const oOptions = commandLineArgs(optionDefinitions);

var oLibraries = JSON.parse(fs.readFileSync('libraries.json', 'utf8'));
var sPath;
var filesWithResources = 0;
var filesWithoutResources = 0;

if (oOptions.deploy) {
	sPath = "./deploy/browser/";
} else {
	sPath = "./webapp/";
}

// this script adjusts the samples for each libraries to CDN bootstrap
// it find all entry points on library root level or one level below
// and injects CDN bootstrap and a path to the local library resources
for (let library in oLibraries.libraries) {
	var sLibraryNamespace = oLibraries.libraries[library];
	var aLibraryEntryPoints = [];
	var aEntryPointsWithExistingResourceRoots;

	console.log("Processing bootstrap options for library: " + sLibraryNamespace);

	aLibraryEntryPoints.push(sPath + "test-resources/" + sLibraryNamespace.replace(/\./g, '/') + "/*.html");
	aLibraryEntryPoints.push(sPath + "test-resources/" + sLibraryNamespace.replace(/\./g, '/') + "/**/*.html");

	console.log("Library Entry Points " + aLibraryEntryPoints);
	// replace local with CDN bootstrap
	const oReplaceBootstrapOptions = {
		allowEmptyPaths: true,
		//Glob(s)
		files: aLibraryEntryPoints,
		//Replacement to make (string or regex)
		from: /src="([^"]*sap-ui-core\.js)"/g,
		to: 'src="$1"'
	};

	// checks for resource roots without changing anything
	const oResourceRootExists = {
		allowEmptyPaths: true,
		dry: true,
		//Glob(s)
		files: aLibraryEntryPoints,
		//Replacement to make (string or regex)
		from: /data-sap-ui-resourceroots/g,
		to: ''
	};

	// collect all files with a predefined resource root
	try {
		const changesResourceRootExists = replace.sync(oResourceRootExists)
		aEntryPointsWithExistingResourceRoots = changesResourceRootExists;
	} catch (error) {
		console.error('Error occurred:', error);
	}

	try {
		// collect all files that are to be changed to CDN bootstrap
		let changesBootstrap = replace.sync(oReplaceBootstrapOptions);
		console.log("All entry points of this lib: " + changesBootstrap);
		// remove duplicates by converting to a set and back to array
		changesBootstrap = [...new Set(changesBootstrap)];
		for (var i = 0; i < Object.keys(changesBootstrap).length; i++) {
			console.log("Processing file: " + changesBootstrap[i]);
			// no resource roots: add it after CDN bootstrap in the same line
			if (!(aEntryPointsWithExistingResourceRoots.includes(changesBootstrap[i]))){
				filesWithoutResources++;
				try {
					const file = replace.sync({
						allowEmptyPaths: true,
						//Glob(s)
						files: changesBootstrap[i],
						//Replacement to make (string or regex)
						from: /src="([^"]*sap-ui-core\.js)"/g,
						to: 'src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js" data-sap-ui-resourceroots=\'{"' + sLibraryNamespace + '" : "./resources/' + sLibraryNamespace.replace(/\./g, '/') + '"}\''
					});
					console.log('Adding library resource roots of: ', file.join(', '));
				} catch (error) {
					console.error('Error occurred:', error);
				}
			} else {
				filesWithResources++;
				// replace local sap-ui-core with CDN
				try {
					const file = replace.sync({
						//allowEmptyPaths: true,
						//Glob(s)
						files: changesBootstrap[i],
						//Replacement to make (string or regex)
						from: /src="([^"]*sap-ui-core\.js)"/g,
						to: 'src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"'
					});
					console.log('Replace bootstrap source of: ', file.join(', '));
				} catch (error) {
					console.error('Error occurred:', error);
				}

				// resource roots exists: prepend generic library namespace (might be in separate line)
				try {
					const file = replace.sync({
						allowEmptyPaths: true,
						//Glob(s)
						files: changesBootstrap[i],
						//Replacement to make (string or regex)
						from: new RegExp('data-sap-ui-resourceroots=\'{(?!"' + sLibraryNamespace + '")'),
						to: 'data-sap-ui-resourceroots=\'{"' + sLibraryNamespace + '" : "./resources/' + sLibraryNamespace.replace(/\./g, '/') + '", '
					});
					console.log('Adding library resource roots of: ', file.join(', '));
				} catch (error) {
					console.error('Error occurred:', error);
				}
			}
		}
	} catch (error) {
		console.error('Error occurred:', error);
	}
};

console.log("--------------------------------------------");
console.log("FilesWithResources: " + filesWithResources);
console.log("FilesWithoutResources: " + filesWithoutResources);
console.log("--------------------------------------------");
