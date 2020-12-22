#!/bin/bash

APP_VERSION=$(node -p -e "require('./package.json').version")

echo $2 | docker login -u $1 --password-stdin
docker push "ottenwbe/go-cook-ui:${APP_VERSION}${GO_COOK_UI_ARCH}"