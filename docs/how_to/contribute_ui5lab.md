## Contributions Welcome! {docsify-ignore}

You can contribute in many different ways and in all areas of the project.
Read this essential information to find out what and where to contribute.

## What to Contribute?

![UI5Lab Ecosystem](../media/UI5LabOverview.png)

*High-level overview and current status of the UI5Lab ecosystem*

#### Contribute Controls to UI5Lab

Transform your controls into a UI5Lab library as described in [this guide](how_to/contribute_custom_control_library.md) and take a look at the [UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-library-simple) project
The custom code should be developed and maintained in individual GitHub repositories maintained by the owner of the code for maximum flexibility, you are welcome to suggest your code project as a pilot for UI5lab. We have created the following prototype examples under this organisation as a prototype:

  * An example library of custom controls (set up according to the best practices for OpenUI5 development) can be found here:
   [UI5Lab-library-simple](https://github.com/openui5/UI5Lab-library-simple)
  * If you are new to UI5 custom control development you might want to have a look at a very basic control example without any infrastructure files first:
   [UI5Lab-control-simple](https://github.com/openui5/UI5Lab-control-simple)
  * A very basic app (using the OpenUI5 CDN) with basic consumption of the `UI5Lab.geometry` library can be found here:
   [ui5lab-app-simple](https://github.com/openui5/UI5Lab-app-simple)
  * A more sophisticated demo app (with a node and grunt environment and OpenUI5 tooling) is available here:
   [openui5-sample-app](https://github.com/sap/openui5-sample-app)

#### Contribute to UI5Lab Infrastructure

In this repository we provide infrastructure for discovering and showcasing a compendium of all individual UI5Lab projects. The idea is to easily find documentation and samples for all the projects and to have them listed in a central place

  * A build infrastructure retrieves the content based on library metadata and lists it here in a central sample browser
  * The tools to load and display many different custom artifacts from individual code packages do not exist yet for this project. This is where we will take the next steps together.
  * A public homepage showcasing and featuring all projects that are made available for UI5Lab is work in progress, we have registered the domains ui5lab.io and ui5lab.com
  * Feel free to contribute to all of the example projects under this organization to make them more robust and flexible.
  * Templates to kick-start library and app development may be added as new repositories under this organization

#### Define Best Practices

An app that wants to consume UI5Lab artifacts needs guidelines, templates, and best practices to integrate the individual pieces of work into their existing codebase.
Make the creation and consumption of custom artifacts for UI5Lab easier by providing examples or documentation, either here in the documentation or in your own repository:

  * **Naming Conventions, Best Practices, Metadata:** help us to define a common standard for this project and to document it publicly.
  * **Guides and Documentation:** Make it easy for developers to use UI5Lab libraries by improving to our [documentation](https://github.com/UI5Lab/UI5Lab-central/blob/master/docs).
  * **Tools and Technologies:** Bring in your ideas for tools and supported technologies. This is an open project that should support common technologies like npm, webpack, ...
  * **Discuss:** Try out what we have so far and share your opinion as to what needs to be done next, we are curious about your ideas and your feedback.

## How to Contribute?

There are two boards on Trello to coordinate our common work and define tasks: the [prototype board](https://trello.com/b/gFQs9ARW/prototype) and the [orga board](https://trello.com/b/v8thvLem/orga). Everyone can create tasks in one of the boards and update them as progress takes place. To get write access, post a request on Slack to one of the admins, then join the board (button on the left panel in one of the boards).

For contributing technically on GitHub, this is how to proceed:

1. Share your idea on Slack chat.
2. Fork one of the UI5Lab repositories.  
3. Create a new "pull" request to get it merged.
