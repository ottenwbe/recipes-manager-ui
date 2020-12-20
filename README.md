# Go-Cook-UI

[![Build Status](https://travis-ci.org/ottenwbe/go-cook-ui.svg?branch=master)](https://travis-ci.org/ottenwbe/go-cook-ui)

User Interface to manage recipes with [go-cook](https://github.com/ottenwbe/go-cook).

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

    sh make_docker.sh
