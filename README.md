![UI5Lab Ecosystem](https://github.com/UI5Lab/UI5Lab-central/raw/master/docs/UI5LabLogoPhoenix.png)

# What is it

UI5Lab is a community driven repository for UI5 custom control libraries. Your contributions will drive our vision: A place where custom controls, templates, helper classes, and other code artifacts related to UI5 technology can be discovered and shared with the community. 

# Get started

#### Browse libraries and samples
Have a look at the [UI5Lab browser](https://ui5lab.io/browser), where all current UI5Lab libraries and controls can be viewed

#### Use a UI5Lab library in your app
Follow the instructions in [this guide](https://github.com/UI5Lab/UI5Lab-central/blob/master/docs/ConsumeLibrary.md) or take a look at the [UI5Lab-app-simple](https://github.com/UI5Lab/UI5Lab-app-simple) project 

#### Contribute to UI5Lab
Have a look at our [contributing guide]((https://github.com/UI5Lab/UI5Lab-central/blob/master/CONTRIBUTING.md) to help us with our mission

# UI5Lab-browser
This repository contains essential project information and hosts central infrastructure that links together all contributed libraries.

#### Setup

Run the following commands to test or develop this project:

1. Clone this repository to your local developer workspace
```sh
git clone https://github.com/UI5Lab/UI5Lab-central
cd UI5Lab-central
```
1. Load npm dependencies without running their individual scripts
```sh
npm install --ignore-scripts
```
2. Load bower dependencies and copy all files to the correct places 
```sh
npm run postinstall
``` 
3. Run a local server for testing 
```sh
grunt serve
```

4. Go to [http://localhost:8080/test-resources/ui5lab/browser/](http://localhost:8080/test-resources/ui5lab/browser/) to display all available UI5Lab libraries

> **Note:** This project joins all individual code repositories (libraries and tools like the [UI5Lab browser](https://github.com/UI5Lab/UI5Lab-browser)) so that they can be viewed together. All required modules will be loaded to your local workspace automatically. You can easily modify the assets and test the changes immediately. The same environment manages the homepage of UI5Lab where all libraries are publicly listed. For more instructions check the documentation.

# Directions 

* [Project Overview](https://github.com/UI5Lab/UI5Lab-central/blob/master/docs/Overview.md) - introduction to UI5Lab and information on all related repositories
* [Documentation](https://github.com/UI5Lab/UI5Lab-central/tree/master/docs) - detailed description on all UI5Lab topics and tutorials   
* [Homepage](https://ui5lab.io) - the single point of entry for UI5Lab
* [Browser](https://ui5lab.io/browser) - lists all libraries and examples in once central place
* [Demo](https://ui5lab.github.io/UI5Lab-app-simple/index.html) - an example app consuming simple UI5Lab controls

# Troubleshooting
Issues can be created either in this repository or in any of the contributor repositories depending on where the error came from.
Be sure to include enough details and context to reproduce the issue and follow up with you. 

# Contact
We organize this project in [Slack Channel #UI5Lab](https://openui5.slack.com/messages/UI5lab).
If you are interested in what we do and discuss, join with this [invitation link](http://slackui5invite.herokuapp.com/).


*The UI5Lab Community*

