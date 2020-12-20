#!/bin/bash

APP_VERSION=$(node -p -e "require('./package.json').version")

echo $(DOCKER_PASSWORD) | docker login -u $(DOCKER_USERNAME) --password-stdin
docker push "ottenwbe/go-cook-ui:${GO_COOK_UI_ARCH}-${APP_VERSION}"