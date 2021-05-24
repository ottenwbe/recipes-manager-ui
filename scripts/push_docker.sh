#!/bin/bash

APP_VERSION=$(node -p -e "require('./package.json').version")

echo $2 | docker login -u $1 --password-stdin
docker push "ottenwbe/recipes-manager-ui:${APP_VERSION}${RECIPES_MANAGER_UI_ARCH}"