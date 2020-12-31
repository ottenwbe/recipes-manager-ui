#!/bin/bash

APP_VERSION=$(node -p -e "require('./package.json').version")

echo $2 | docker login -u $1 --password-stdin
docker buildx build --push --platform linux/arm/v7,linux/arm64/v8,linux/amd64 "ottenwbe/go-cook-ui:${APP_VERSION}-test"