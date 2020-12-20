#!/bin/bash

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
APP_VERSION=$(node -p -e "require('./package.json').version")
DATE=$(date +"%F %T")

docker build --label "version=${APP_VERSION}" --label "build_date=${DATE}"  --label "maintaner=${MAINTAINER}" -t "ottenwbe/go-cook-ui:${GO_COOK_UI_ARCH}-${APP_VERSION}" -f Dockerfile .