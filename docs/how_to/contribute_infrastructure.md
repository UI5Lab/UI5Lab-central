!> **TODO** work in progress

Here is a short description about tasks the members of the UI5Lab Core Team have to consider if a new library should be added to UI5lab. Some tasks are automated, some could be provided from the contributor of the new library.

* [@michadelic](https://github.com/Michadelic) has implemented a Travis job that gets automatically called whenever a pull request is merged into UI5lab-central
* The Travis job will rebuild the complete `UI5Lab-central/gh-pages`-branch. So **gh-pages should never be edited manually**.
* To edit the [ui5lab.io](https://ui5lab.io) website, modify the files in `UI5Lab-central/homepage`. These will become the root of `UI5Lab-central/gh-pages` once the Travis job is finished
* A pull request for a new library should include additions to `package.json`. If not, someone from the Core Team has to edit theses files.
* `UI5Lab-central/package.json` allows libraries from npmjs and github. For example
    1. `"openui5-qrcode": https://github.com/StErMi/openui5-qrcode`
    2. `"ui5-nabi-m": "^0.1.0"`
