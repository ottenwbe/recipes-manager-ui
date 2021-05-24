#!/bin/bash

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
APP_VERSION=$(node -p -e "require('./package.json').version")
DATE=$(date +"%F %T")

SHOULD_PUSH=$1

docker buildx build --output "type=image,push=${SHOULD_PUSH}" --platform linux/arm/v7,linux/arm64/v8,linux/amd64 --label "version=${APP_VERSION}" --label "build_date=${DATE}"  --label "maintaner=${MAINTAINER}" -t "ottenwbe/recipes-manager-ui:${APP_VERSION}" -f Dockerfile .
