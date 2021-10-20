#!/bin/bash

set -x

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
APP_VERSION=$(node -p -e "require('./package.json').version")
DATE=$(date +"%F %T")
APP_GIT_HASH=$(git rev-parse --short HEAD)
APP_REPO="github.com/ottenwbe/recipes-manager-ui"

SHOULD_PUSH=$1

if [ -z "${SHOULD_PUSH}" ] ; then
  echo "usage: ./docker_buildx.sh <should_push: true|false>"
  exit 1
fi

docker buildx build --output "type=image,push=${SHOULD_PUSH}" \
    --platform linux/arm/v7,linux/arm64/v8,linux/amd64 \
    --label "version=${APP_VERSION}" \
    --label "build_date=${DATE}"  \
    --label "maintaner=${MAINTAINER}" \
    --label "git-hash=${APP_GIT_HASH}" \
    --label "git-repo=${APP_REPO}" \
    -t "ottenwbe/recipes-manager-ui:${APP_VERSION}" \
    -f Dockerfile .
