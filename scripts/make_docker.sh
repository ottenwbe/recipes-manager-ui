#!/bin/bash

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
APP_VERSION=$(node -p -e "require('./package.json').version")
DATE=$(date +"%F %T")

echo $2 | docker login -u $1 --password-stdin
docker build --label "version=${APP_VERSION}" --label "build_date=${DATE}"  --label "maintaner=${MAINTAINER}" -t "ottenwbe/go-cook-ui:${APP_VERSION}${GO_COOK_UI_ARCH}" -f Dockerfile .