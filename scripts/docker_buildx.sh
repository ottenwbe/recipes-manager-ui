#!/bin/bash

set -x

SHOULD_PUSH=$1

if [ -z "${SHOULD_PUSH}" ] ; then
  echo "usage: ./docker_buildx.sh <should_push: true|false>"
  exit 1
fi

MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
DATE=$(date +"%F %T")
APP_GIT_HASH=$(git rev-parse --short HEAD)
APP_REPO="github.com/ottenwbe/recipes-manager-ui"

APP_VERSION=$(git describe --tags --always --match=v* 2> /dev/null || echo v0.0.0)
APP_VERSION_ABBR=$(echo ${APP_VERSION} | awk '{ print substr( $0, 2 ) }' )
# set current version to package.json
node -e "let pkg=require('./package.json'); pkg.version='${APP_VERSION_ABBR}'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

docker buildx build --output "type=image,push=${SHOULD_PUSH}" \
    --platform linux/arm/v7,linux/arm64/v8,linux/amd64 \
    --label "version=${APP_VERSION}" \
    --label "build_date=${DATE}"  \
    --label "maintaner=${MAINTAINER}" \
    --label "git-hash=${APP_GIT_HASH}" \
    --label "git-repo=${APP_REPO}" \
    -t "ottenwbe/recipes-manager-ui:${APP_VERSION}" \
    -f Dockerfile .
