# recipes-manager-UI

[![Build](https://github.com/ottenwbe/recipes-manager-ui/actions/workflows/node.js.yml/badge.svg)](https://github.com/ottenwbe/recipes-manager-ui/actions/workflows/node.js.yml)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ottenwbe/recipes-manager-ui/blob/master/LICENSE)
[![Known Vulnerabilities](https://snyk.io/test/github/ottenwbe/recipes-manager-ui/badge.svg)](https://snyk.io/test/github/ottenwbe/recipes-manager-ui)

User Interface to manage recipes with [recipes-manager](https://github.com/ottenwbe/recipes-manager).
How to use the UI in k8s together with all related components, is explained here: [Deployment](https://github.com/ottenwbe/recipes-manager-deployment).

# Getting Started - Basic Deployment and Configuration

Before you start, ensure that npm is installed.

1. _Get the Code_

    ```
    git clone https://github.com/ottenwbe/recipes-manager-ui.git
    ```

1. _Configure the strings of the App_. A strings.json file is used to configure the texts diplayed in the UI. Configuration happens at _build time_.

    ```json
    {
        "appName": "theAppName",
        "pageHeader" : {"sub" : "theSubHeader"},
        "footer" : {"text": "theFooter"},
        "welcome" : "theWelcomeText",
        "welcomesSub" : "theWelcomeSub"
    }
    ```

1. _Start the app with npm_

    ```sh
    npm i
    npm start
    ```

    
1.   _Open_ [http://localhost:3000](http://    localhost:3000) to view it in the browser. Note, the app assumes that recipes-manager runs on the same h


# Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Start

   `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://   localhost:3000) to view it in the browser.
The page will reload if you make edits<br>
You will also see any lint errors inthe    console.

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

### Build Docker Container

    docker build -t "recipes-manager-ui:SNAPSHOT" -f Dockerfile .

While building the docker container, all dpendencies are installed. The app, however, is built when starting the container to reflect changes to the environment variables.

### Build Scripts

All build scripts are found in scripts directory.

```
.
├── docker_buildx.sh 
├── make_docker_for_minikube.sh
├── make_snapshot.sh
└── push_docker.sh
```

* docker_buildx.sh <should_push>

    Opinionated way to build the docker image for arm and amd64. This multi-arch build it relies on buildx. The version is determined by a git tag and written to ```package.json``` (e.g., 0.1.0) as well as tagged to the docker image (e.g., v0.1.0). It is tailored for the CI/CD pipelines.

* make_docker_for_minikube.sh

    Builds a container with a development tag and pushes it to a local minikube registry.

### Release Process

Read the current version:

```sh
node -p -e "require('./package.json').version"
```

Fix the version in the repository, i.e., with semver.

```sh
semver $(node -p -e "require('./package.json').version") -i minor
```

Then simply tag the git repository with the next version. This triggers the release pipeline.

```sh
git tag v1.2.3
git push origin v1.2.3
```

## Disclaimer

I created this project for the purpose of educating myself and personal use. If you are interested in the outcome, feel free to contribute; this work is published under the MIT license.
