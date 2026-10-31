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

1. _Configure the strings of the App_. A strings.json file is used to configure the texts displayed in the UI. Configuration happens at _build time_.

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
    npm run build
    npm run preview
    ```

    
1.   _Open_ [http://localhost:3000](http://localhost:3000) to view it in the browser. Note, the app assumes that recipes-manager runs already


# Development

This project uses [Vite](https://vitejs.dev/) for a fast development experience.

## Start

    `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://   localhost:3000) to view it in the browser.
The page will reload if you make edits<br>
You will also see any lint errors in the   console.

## Test 

NOTE: REQUIRES REWORK

    `npm test`

Launches the Jest runner.

## Build

### Build App 

    `npm run build`
Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### Build Docker Container

    docker build -t "recipes-manager-ui:SNAPSHOT" -f Dockerfile .

While building the docker container, all dependencies are installed and the app is built via `npm run build` as part of the image build.

### Build Scripts

All build scripts are found in scripts directory.

```
.
└── docker.sh
```

Unified Docker script with the following commands:

* `docker.sh build` - Build Docker image
  
  Options:
  - `--multi` - Use docker buildx for multi-platform build (arm64, amd64)
  - `--push` - Push image after build
  - `--tag TAG` - Image tag (default: version from package.json)
  - `--registry REG` - Docker registry (default: docker.io)
  - `--type TYPE` - Build type: dev, production (default: production)

  Examples:
  ```sh
  sh scripts/docker.sh build --type dev
  sh scripts/docker.sh build --multi --push --type production
  sh scripts/docker.sh build --type dev --push
  ```

* `docker.sh push` - Push Docker image
  
  Options:
  - `--tag TAG` - Image tag to push
  - `--registry REG` - Docker registry (default: docker.io)
  - `-u USER` - Docker username
  - `-p PASS` - Docker password

  Examples:
  ```sh
  sh scripts/docker.sh push --tag 1.0.0 -u user -p pass
  ```

Note: The build script uses version from package.json and standardized OpenContainers labels.

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

Some cleanup and maintenance has been done with the help of AI agents.
