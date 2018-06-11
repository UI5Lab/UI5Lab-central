## Contribute a Custom Control Library to UI5lab {docsify-ignore}

To contribute your custom controls to UI5lab you need to transform it into a UI5Lab library.
A simple example set up according to our best practices can be found in project [UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-library-simple). 

Apart from this documentation, you can follow these hands-on tutorials to create your own UI5Lab library and add it to UI5Lab:
* Create a UI5 Library for UI5Lab: [https://blogs.sap.com/2018/03/02/create-your-own-ui5-library-for-ui5lab/](https://blogs.sap.com/2018/03/02/create-your-own-ui5-library-for-ui5lab/)
* Add your UI5 Library to UI5Lab: [https://blogs.sap.com/2018/03/02/add-your-ui5-library-to-ui5lab/](https://blogs.sap.com/2018/03/02/add-your-ui5-library-to-ui5lab/)

## Instructions

#### 1. Get Your Custom Control Ready

Custom controls need to follow a certain file and library structure to be integrated into UI5Lab.
This blog post describes all the steps in detail with a practical example:
[Custom Control 101 by @stermi](https://medium.com/@stermi/custom-control-101-sapui5-openui5-tipoftheday-customcontrol-fd51a85bbed3)

When you are done with your control implementation you can add metadata to integrate it with UI5Lab browser. Each Custom Control library has its own `index.json`. This is a small file with descriptions about the custom control library. 

#### 2. Edit Your index.json

```json
    {
        "the.library.namespace": {
            "icon": "a SAP-Icon e.g. sap-icon://database",
            "name": "the Library name",
            "description": "a short description",
            "source" : "a link to the source code on GitHub",
            "documentation": "a link to the documentation",
            "demo": "a link to the demonstration webpage",
            "license": "the license you chose for your Custom Control Library e.g. Apache 2.0",
            "version": 1.0,
            "content": {
                "Your First Custom Control": {
                    "id": "Custom Control ID",
                    "name": "Custom Control name",
                    "type": "control",
                    "version": 1.0,
                    "description": "a short description",
                    "samples": [
                        {
                            "id": "ID of first sample",
                            "name": "sample name 1",
                            "description": "a short sample description"
                        },
                        {
                            "id": "ID of second sample",
                            "name": "sample name 2",
                            "description": "a short sample description"
                        }
                    ]
                }
            }
        }
    }
```

`content` is a substructure describing 1 or more custom controls included in the library.
Good examples are the `index.json` of published UI5lab libraries like [UI5Lab-library-simple](https://github.com/UI5Lab/UI5Lab-library-simple/blob/master/test/ui5lab/geometry/index.json) or [openui5-qrcode](https://github.com/StErMi/openui5-qrcode/blob/master/test/index.json).

#### 3. Generate a Pull Request

Once you are ready to publish your custom control library, simply fork [UI5Lab-central](https://github.com/UI5Lab/UI5Lab-central) and edit the `libraries.json`, `package.json` and `combineProjects.js` file. After that, create a pull request. And when this pull request is merged into the repository, a Travis job will automatically generate an updated version of UI5lab where your Library is now listed among all the others.
The `combineProjects.js` file will do a copy from the `node_modules` folder to the resources folder of this project. Test your library, provide a sample and create a pull request with a meaningful description to list your proejct.

