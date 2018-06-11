## Introduction

UI5Lab is a community-driven project providing a repository for UI5 custom control libraries. It's purpose is to make it easy for everyone to share, retrieve and use UI5 custom controls. Contributions welcome!
It consists of several example and infrastructure repositories described in more detail below and control libraries provided by contributors.

![UI5Lab Ecosystem](../../media/UI5LabOverview.png)

*High-level overview and current status of the UI5Lab ecosystem*

## What's in it for me?

#### Use a UI5Lab library in your app

UI5Lab libraries are created and published by the community to be used in your app projects. Browse the available libraries and samples to find suitable controls that you want to use in your app.
Follow the instructions in [this guide](https://ui5lab.github.io/UI5Lab-central/#/how_to/consume_library.md) or take a look at the [UI5Lab-app-simple](https://github.com/UI5Lab/UI5Lab-app-simple) project.

#### Provide a UI5Lab library for the community

You have created a custom control and would like to share it with the community? Great! Follow [this guide](https://ui5lab.github.io/UI5Lab-central/#/how_to/contribute_custom_control_library.md) to publish it on UI5Lab. 

#### Contribute to UI5Lab and help us grow

You like the idea of having a community-driven repository for UI5 custom control libraries? Help us define new best practices and improve the project.
Have a look at the repository description below and our [contributing guide](https://ui5lab.github.io/UI5Lab-central/#/how_to/contribute_ui5lab.md) to see where you can engage.

## Repositories

### UI5Lab-app-simple

A simple app that consumes custom controls from the UI5Lab geometry example library.
You can use this project as a reference for using UI5Lab controls in your app.

Source: [https://github.com/UI5Lab/UI5Lab-app-simple](https://github.com/UI5Lab/UI5Lab-app-simple)

Demo: [App with UI5Lab controls](https://ui5lab.github.io/UI5Lab-app-simple/index.html) 

Used in: -

### UI5Lab-control-simple

Contains a simple square control that can be used for testing custom controls.
If you are new to developing controls, this is the place to experiment and try out things.

Source: [https://github.com/UI5Lab/UI5Lab-control-simple](https://github.com/UI5Lab/UI5Lab-control-simple)

Used in: -

### UI5Lab-library-simple

A browser to display custom libraries and control examples on the UI5Lab homepage. 
The app implemented in UI5 can also be used for testing control samples and previewing libraries during development.

Source: [https://github.com/UI5Lab/UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-library-simple)

Demo: [geometry samples](https://ui5lab.io/browser)

Used in: [UI5Lab-central](https://github.com/UI5Lab/UI5Lab-central)

> **Note:** A pull request for a new library should include additions to `libraries.json`, `package.json` and `combineProjects.js`. Make sure that a library always contains a working sample so that users can see what the library is intended to do.

### UI5Lab-central

This repository contains essential project information and hosts central infrastructure that links together all contributed libraries.
The libraries and controls provided by the individual owners can be retrieved and consumed easily from the central browser.

Source: [https://github.com/UI5Lab/UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-library-simple)

Demo: [Homepage](https://ui5lab.io/) [Browser](https://ui5lab.io/browser)

Used in: -

A Travis build ensures that the UI5Lab browser and the homepage always list the latest contributions.
To edit the [ui5lab.io](https://ui5lab.io) website, modify the `index.html` file in `UI5Lab-central/preview`. These will become the root of `UI5Lab-central/gh-pages` once the Travis job is finished

!> TODO: adapt text to new docsify documentation workflow

If a new library should be added to UI5lab a pull request is raised by the contributor. Once merged
* a Travis job runs, which is called automatically whenever a pull request is merged into UI5lab-central.
* the Travis job will rebuild the complete `UI5Lab-central/gh-pages`-branch.  
So **gh-pages should never be edited manually**.

* `UI5Lab-central/package.json` allows libraries from npmjs and GitHub. For example:
    1. `"openui5-qrcode": https://github.com/StErMi/openui5-qrcode`
    2. `"ui5-nabi-m": "^0.1.0"`

### UI5Lab-browser

A browser to display custom libraries and control examples on the UI5Lab homepage. The app implemented in UI5 can also be used for testing control samples and previewing libraries during development.

Source: [https://github.com/UI5Lab/UI5Lab-browser](https://github.com/UI5Lab/UI5Lab-browser)

Demo: [Browser](https://ui5lab.io/browser)

Used in: [UI5Lab-central](https://github.com/UI5Lab/UI5Lab-central), [UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-central)

The browser is an app for displaying library information and control samples based on metadata that is located inside the library projects.
The application logic is similar for both use cases:
* Displaying a library during library development at design time
 * Developing samples and tests
 * High-level library and control documentation
 * Testing the appearance of the library and its content on the UI5Lab homepage
* Listing a library on the UI5Lab homepage so that it can be easily found by app developers at run time
  * Search and find community controls or artifacts at the UI5Lab homepage
  * Browse samples, high-level documentation, and test pages for all artifacts
  * Link the project repository to contribute or report issues
