![UI5Lab Logo](https://raw.githubusercontent.com/UI5Lab/UI5Lab-central/master/docs/media/UI5LabLogoPhoenix.png)

# What is it

UI5Lab is a community driven repository for UI5 Custom Control Libraries. It's purpose is to make it easy for everyone to share, retrieve and use UI5 Custom Controls. Explore them in the [UI5Lab browser](https://ui5lab.io/browser). Contributions welcome!

# UI5Lab-central
This repository contains essential project information and hosts central infrastructure that links together all contributed libraries. Have a look at our [documentation](http://ui5lab.io/docs/) for more details. 

### Setup

Run the following commands to test or develop this project:

1. Clone this repository to your local developer workspace
```bash
git clone https://github.com/UI5Lab/UI5Lab-central
cd UI5Lab-central
```

2. Load npm dependencies without running their individual scripts
```bash
npm install --ignore-scripts
```

3. Copy all files to the correct places and adjust bootstrap to CDN
```bash
npm run postinstall
```

> *Note:* to test the deployment that is triggered via Travis call `npm run deploy`. All resources for deployment will be put in a subfolder `deploy`.
 

4. Run a local server for testing 
```bash
npm start
```

5. Go to [http://localhost:8080/index.html](http://localhost:8080/index.html) to display all available UI5Lab libraries

> **Note:** This project joins all individual code repositories (libraries and tools like the [UI5Lab browser](https://github.com/UI5Lab/UI5Lab-browser)) so that they can be viewed together. All required modules will be loaded to your local workspace automatically. You can easily modify the assets and test the changes immediately. The same environment manages the homepage of UI5Lab where all libraries are publicly listed. For more instructions check the documentation.

# Directions

* [Homepage](https://ui5lab.io) - the single point of entry for UI5Lab
* [Documentation](https://ui5lab.io/docs) - project overview and tutorials
* [Browser](https://ui5lab.io/browser) - all UI5Lab libraries and examples
* [Demo](https://ui5lab.github.io/UI5Lab-app-simple/index.html) - an example app consuming simple UI5Lab controls

# Troubleshooting

Issues can be created either in this repository or in any of the contributor repositories depending on where the error came from.
Be sure to include enough details and context to reproduce the issue and follow up with you. 

# Contact

We organize this project in [Slack Channel #UI5Lab](https://openui5.slack.com/messages/UI5lab).
If you are interested in what we do and discuss, join with this [invitation link](https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com/) or visit the homepage [https://ui5lab.io](https://ui5lab.io).

*The UI5Lab Community*
