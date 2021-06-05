# recipes-manager-UI

[![Build](https://github.com/ottenwbe/recipes-manager-ui/actions/workflows/node.js.yml/badge.svg)](https://github.com/ottenwbe/recipes-manager-ui/actions/workflows/node.js.yml)

User Interface to manage recipes with [recipes-manager](https://github.com/ottenwbe/recipes-manager).

# Deployment and Configuration

## .env file

Environment variables are used to configure the application.

### Text Configuration

    REACT_APP_APP_NAME=<Appears as Name in the Menu Bar>
    REACT_APP_PAGE_HEADER_SUB=<Subtitle Shown on Each Page>    
    REACT_APP_PAGE_FOOTER_TEXT=That's all folks ...
    REACT_APP_WELCOME_TEXT=<Welcome Text on Home Screen>
    REACT_APP_WELCOME_SUB_TEXT=<Sub Welcome Text on Home Screen>

# Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Start  

    `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Test 

    `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Build

### Build App 

    `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Build Docker Container

    RECIPES_MANAGER_UI_ARCH=<arch> sh make_docker.sh

Builds the docker container, labels it, and tags it.

The default tag is the version grabbed from ```package.json``` (e.g., 0.1.0).
By providing the environment variable ```RECIPES_MANAGER_UI_ARCH``` the tag is extended to add the given data (e.g., 0.1.0-amd64).

### Build Docker Container

    RECIPES_MANAGER_UI_ARCH=<arch> sh push_docker.sh <docker user> <docker pw>

### Update Process (WIP)

    semver $(node -p -e "require('./package.json').version") -i minor