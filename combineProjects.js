'use strict';

const optionDefinitions = [
	{ name: 'deploy', alias: 'd', type: Boolean } // determines deploy step to gh-pages without ui5 build tools
];

const commandLineArgs = require('command-line-args');
const glob = require('glob');
const fs = require('fs-extra');
const npmPackage = require('./package.json');
const sBrowserPath = './webapp';
const sResourcesPath = sBrowserPath + '/resources/';
const sTestResourcesPath = sBrowserPath + '/test-resources/';

// config parameters
const oOptions = commandLineArgs(optionDefinitions);

/**************************
 * UI5 and browser:
 * Copy the browser project and all needed UI5 libraries from npm_modules to a local folder
 *************************/

console.log("Copying browser and global libraries file to " + sBrowserPath);

// copy browser
fs.copySync('./node_modules/ui5lab-browser/dist', sBrowserPath); //new UI5Lab-browser with UI5 tooling


/**************************
 * UI5Lab projects:
 * Copy all loaded projects to the appropriate places (resources and test-resources)
 **************************/

console.log("Copying community libraries to webapp folder");

for (let library in npmPackage.dependencies) {
	//Does not process @openui5 namespace or ui5lab-browser
	if (library.indexOf('@openui5') < 0 && library !== 'ui5lab-browser') {
		copyLibraryToUI5LabBrowser(library);
	}
}

/**************************
 * Deploy preparations:
 * Copy everything to be deployed in deploy folder
 **************************/

if (oOptions.deploy) {
	console.log("Copying homepage, documentation, and browser with all community libraries to deploy folder");

	// copy preview page by @nitishmeta to root folder
	fs.copySync('./homepage', './deploy');
	// copy docsify pages by @nlsltz to docs folder
	fs.copySync('./docs', './deploy/docs');
	// copy browser to subfolder browser for the moment
	fs.copySync('./webapp', './deploy/browser');
	// override development index with productive CDN bootstrap index
	fs.copySync('./index.html', './deploy/browser/index.html');
}

/*** helper functions ***/

function copyLibraryToUI5LabBrowser(sLibraryPackage) {
	try {
		const sLibraryNodePath = './node_modules/' + sLibraryPackage;
		// does not copy libraries which have UI5 tooling during development (will be served by the UI5 tooling)
		// when in deploy mode always copy libraries as we do not have ui5 tools on gh-pages branch
		if (oOptions.deploy || !_hasUI5Tooling(sLibraryNodePath)) {
			console.log("Copying community library " + sLibraryPackage);
			_copyLibraryResources(sLibraryNodePath);
			_copyLibraryTestResources(sLibraryNodePath);
		}
		_addToBrowserLibrariesFile(sLibraryNodePath);
	} catch (err) {
		console.log("An error occured post-processing library: " + sLibraryPackage + err.message);
	}
}

function _copyLibraryResources(sLibraryNodePath) {
	const sLibraryNamespacePath = _getLibraryNamespace(sLibraryNodePath).replace(/\./g, '/');
	const sCopyFromPath = _getLibraryDistOrSrcPath(sLibraryNodePath) + sLibraryNamespacePath;
	const sCopyToPath = sResourcesPath + sLibraryNamespacePath;
	console.log("Copying resources from " + sCopyFromPath);
	fs.copySync(sCopyFromPath, sCopyToPath);
}

function _copyLibraryTestResources(sLibraryNodePath) {
	const sLibraryNamespacePath = _getLibraryNamespace(sLibraryNodePath).replace(/\./g, '/');
	const sCopyFromPath = _getLibraryTestPath(sLibraryNodePath) + sLibraryNamespacePath;
	const sCopyToPath = sTestResourcesPath + sLibraryNamespacePath;
	console.log("Copying test resources from " + sCopyFromPath);
	fs.copySync(sCopyFromPath, sCopyToPath);
}

function _getLibraryNamespace(sLibraryNodePath) {
	// new convention: property ui5lab.namespace in package.json
	// read library namespace from package.json
	var oPackage = require(sLibraryNodePath + '/package.json');
	if  (oPackage.ui5lab && oPackage.ui5lab.namespace) {
		// return namespace from package.json
		return oPackage.ui5lab.namespace;
	} else {
		// old convention: root key in index.json
		// find index.json file and extract namespace from root key
		var sLibraryIndexPath = glob.sync(sLibraryNodePath + '/**/index.json').pop();
		var oIndex = require(sLibraryIndexPath);
		return Object.keys(oIndex).pop();
	}
}

function _getLibraryDistOrSrcPath(sLibraryNodePath) {
	const sDistResourcesPath = sLibraryNodePath + '/dist/resources/';
	const sDistPath = sLibraryNodePath + '/dist/';
	const sSrcPath = sLibraryNodePath + '/src/';
	if (fs.existsSync(sDistResourcesPath)) {
		return sDistResourcesPath;
	} else if (fs.existsSync(sDistPath)) {
		return sDistPath;
	} else if (fs.existsSync(sSrcPath)) {
		return sSrcPath;
	}
}

function _getLibraryTestPath(sLibraryNodePath) {
	const sDistTestResourcesPath = sLibraryNodePath + '/dist/test-resources/';
	const sTestPath = sLibraryNodePath + '/test/';
	if (fs.existsSync(sDistTestResourcesPath)) {
		return sDistTestResourcesPath;
	} else if (fs.existsSync(sTestPath)) {
		return sTestPath;
	}
}

function _hasUI5Tooling(sLibraryNodePath) {
	return (fs.existsSync(sLibraryNodePath + '/ui5.yaml'));
}

function _addToBrowserLibrariesFile(sLibraryNodePath) {
	console.log("Adding library to browser libs file...");
	try {
		const browserLibraryFilePath = sBrowserPath + '/libraries.json';
		const metadata = _getLibraryMetadata(sLibraryNodePath);
		const librariesFile = require(browserLibraryFilePath);
		librariesFile.libraries.push(metadata);
		fs.writeFileSync(browserLibraryFilePath, JSON.stringify(librariesFile), 'utf8', (err) => (console.log));
	} catch (err) {
		console.error(err);
	}
}

function _getLibraryMetadata(libraryNodePath) {
	let libraryMetadata = {};
	const libPackage = require(libraryNodePath + '/package.json');
	if  (libPackage.ui5lab) {
		const metadata = {};
		let repositoryUrl = '';
		if (libPackage.repository) {
			repositoryUrl = libPackage.repository.url;
		}
		metadata.icon = libPackage.ui5lab.icon || '';
		metadata.name = libPackage.ui5lab.name || libPackage.name;
		metadata.description = libPackage.description || '';
		metadata.source = repositoryUrl || '';
		metadata.documentation = libPackage.homepage || '';
		metadata.demo = libPackage.ui5lab.demo || '';
		metadata.version = libPackage.version || '';
		metadata.license = libPackage.license || '';
		metadata.content = libPackage.ui5lab.content || {};
		metadata.keywords = libPackage.keywords || [];
		metadata.keywords = metadata.keywords.join();
		libraryMetadata[libPackage.ui5lab.namespace] = metadata;
	} else {
		const libraryIndexPath = glob.sync(libraryNodePath + '/**/index.json').pop();
		libraryMetadata = require(libraryIndexPath);
		const libName = Object.keys(libraryMetadata)[0];
		const libEntry = libraryMetadata[libName];
		libEntry.keywords = libEntry.keywords || [];
		libEntry.keywords = libEntry.keywords.join();
	}
	return libraryMetadata;
}
