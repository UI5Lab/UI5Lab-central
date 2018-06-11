## Quick Start {docsify-ignore}

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

3. Load bower dependencies and copy all files to the correct places 
```bash
npm run postinstall
``` 

4. Run a local server for testing 
```bash
grunt serve
```

4. Go to [http://localhost:8080/test-resources/ui5lab/browser/](http://localhost:8080/test-resources/ui5lab/browser/) to display all available UI5Lab libraries

> **Note:** This project joins all individual code repositories (libraries and tools like the [UI5Lab browser](https://github.com/UI5Lab/UI5Lab-browser)) so that they can be viewed together. All required modules will be loaded to your local workspace automatically. You can easily modify the assets and test the changes immediately. The same environment manages the homepage of UI5Lab where all libraries are publicly listed. For more instructions check the documentation.

!> TODO: Add dev-ready docker container 🖖
