#!/bin/bash

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
APP_VERSION=$(node -p -e "require('./package.json').version")
DATE=$(date +"%F %T")
GO_COOK_UI_ARCH="-$1"

echo $(DOCKER_PASSWORD) | docker login -u $(DOCKER_USERNAME) docker.io --password-stdin
docker build --label "version=${APP_VERSION}" --label "build_date=${DATE}"  --label "maintaner=${MAINTAINER}" -t "docker.io/ottenwbe/recipes-manager-ui:SNAPSHOT${GO_COOK_UI_ARCH}" -f Dockerfile .
docker push "docker.io/ottenwbe/recipes-manager-ui:SNAPSHOT${GO_COOK_UI_ARCH}"