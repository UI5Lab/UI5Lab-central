This page collects best practice conventions for creating UI5Lab projects

## Tooling

UI5Lab projects are published on public registries like npm or bower to be easily consumed in app projects

## Naming

A UI5Lab project should have a unique namespace separated with "." for the UI5 namespace and "-" for the npm package
 * e.g. ui5 namespace "ui5lab.browser" and npm package "ui5lab-browser"

Prefixes should match the following pattern
  * *ui5lab*: example projects, boilerplate templates, technology explorations, documentation, or anything related to the UI5Lab project should start with the prefix "ui5lab"
  * *ui5/openui5*: controls, control libraries, UI5 helper classes or modules, or technology crossover should start with the prefix "ui5" or "openui5" to be easily recognizable as packages related to ui5 technology
  * *custom*: a custom namespace like "johndoe.videoplayer" may be used to distinguish the project from other implementations or to have a personal namespace, nevertheless consider adding "ui5" or "openui5" to the npm package name to be easily discoverable

>TODO: document additional naming conventions, discussions pending

## Project Structure

A starting point for UI5Lab projects can be the OpenUI5 recommendation for library projects: https://github.com/SAP/openui5/blob/master/docs/controllibraries.md

Additional metadata and configuration files are needed to lookup and consume the project via the UI5Lab homepage and npm

>TODO: document metadata once finalized
