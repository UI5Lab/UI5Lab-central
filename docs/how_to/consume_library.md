## Consume UI5Lab Libraries in Your App {docsify-ignore}

This tutorial shows you how to consume the custom controls from UI5Lab (in our case the example library [geometry](https://github.com/UI5Lab/UI5Lab-library-simple)) in app projects.

1. Install node.js (get it from [nodejs.org](http://nodejs.org/)).

	> **Note:** If working behind a proxy, you need to configure it properly (`HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` environment variables)

2. Clone the example app repository and navigate into it.

```bash
git clone https://github.com/UI5Lab/UI5Lab-app-simple
cd UI5Lab-app-simple
```

3. Adapt the file `package.json` to retrieve the desired Custom Control library.
(In this demonstration `ui5lab-library-simple`)

```json
{
  "scripts": {
    "postinstall": "node postInstall.js"
  },
  "devDependencies": {
    "ui5lab-library-simple": "^0.1.0",
    "fs-extra": "^3.0.0"
  }
}
```

4. Adapt the file `postInstall.json` to copy the files of the Custom Control library from the `nodes_modules` directory to the application folder.
(In this demonstration to `./webapp/thirdparty`)

```javascript
var fs = require('fs-extra');

fs.copySync('./node_modules/ui5lab-library-simple/dist/resources/', './webapp/thirdparty');
```

5. Install all npm dependencies.

```bash
npm install
```

6. Adapt `index.html` to consume the Custom Control library.
(In this demonstration `ui5lab.geometry`)

```javascript
...
    data-sap-ui-resourceroots='{
        "ui5lab.app.SquareApp": "./",
        "ui5lab.geometry": "./thirdparty/ui5lab/geometry/"
    }'
...
```

7. Adapt `opaTest.unit.html` to consume the Custom Control library.
(In this demonstration `ui5lab.geometry`)

```javascript
...
    data-sap-ui-resourceroots='{
        "ui5lab.app.SquareApp": "../../",
        "ui5lab.geometry": "../../thirdparty/ui5lab/geometry/"
    }'
...
```

8. Adapt `App.view.xml` to consume the Custom Controls.
(In this demonstration `ui5lab.geometry.Square`, `ui5lab.geometry.Circle` and `ui5lab.geometry.Triangle`)

```xml
<mvc:View
    controllerName="ui5lab.app.SquareApp.controller.App"
    xmlns:mvc="sap.ui.core.mvc"
    xmlns:lab="ui5lab.geometry"
    xmlns="sap.m">
    <App>
        <pages>
            <Page title="{i18n>title}">
                <content>
                    <Slider value="{view>/size}" min="50" max="500"/>
                    <lab:Square text="A" size="100"/>
                    <lab:Square text="wonderful" size="{view>/size}"/>
                    <lab:Square text="pile" size="80"/>
                    <lab:Square text="of" size="140"/>
                    <lab:Square text="custom" size="90"/>
                    <lab:Square text="Squares" size="170"/>
                    <lab:Square text="!" size="50"/>
                    <lab:Circle text="Circle" size="{view>/size}"/>
                    <lab:Triangle text="Triangle" size="{view>/size}" rotation="{= ${view>/size} / 2 - 100}"/>
                </content>
            </Page>
        </pages>
    </App>
</mvc:View>
```

9. Deploy the application folder to your favorite webserver.

10. Choose one of the following entry points to open the app.

 * [App page](webapp/index.html) Path to the source code for the demo above
 * [Test page](webapp/test/integration/opaTests.qunit.html) A simple integration test written in OPA
