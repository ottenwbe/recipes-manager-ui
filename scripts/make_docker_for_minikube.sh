#!/usr/bin/env bash
# This script is used only for testing purposes
# Builds a development Docker image for recipes-manager-ui

set -euo pipefail

# Configuration
MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
IMAGE_NAME="ottenwbe/recipes-manager-ui"
IMAGE_TAG="development"
DOCKER_FILE="Dockerfile"

# Source of truth for version: package.json
# Extract version using grep (simpler and more reliable than Docker-based approach)
APP_VERSION=$(grep '"version"' package.json | cut -d'"' -f4 2>/dev/null || echo "unknown")

# Also create/update VERSION file for other scripts to use
echo "${APP_VERSION}" > VERSION

# Build metadata
DATE=$(date +"%F %T")
GIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

# Docker registry (optional, can be overridden)
DOCKER_REGISTRY=${DOCKER_REGISTRY:-}
FULL_IMAGE="${DOCKER_REGISTRY:+${DOCKER_REGISTRY}/}${IMAGE_NAME}:${IMAGE_TAG}"

echo "Building ${FULL_IMAGE}..."
echo "  Version: ${APP_VERSION}"
echo "  Date: ${DATE}"
echo "  Git: ${GIT_BRANCH}@${GIT_HASH}"
echo ""

# Build the Docker image with build cache, labels, and version argument
docker build \
  --build-arg APP_VERSION="${APP_VERSION}" \
  --label "org.opencontainers.image.title=recipes-manager-ui" \
  --label "org.opencontainers.image.description=Recipes Manager UI - React/Vite frontend" \
  --label "org.opencontainers.image.version=${APP_VERSION}" \
  --label "org.opencontainers.image.created=${DATE}" \
  --label "org.opencontainers.image.revision=${GIT_HASH}" \
  --label "org.opencontainers.image.source=https://github.com/ottenwbe/recipes-manager-ui" \
  --label "maintainer=${MAINTAINER}" \
  -t "${FULL_IMAGE}" \
  -f "${DOCKER_FILE}" \
  .

echo ""
echo "✅ Successfully built: ${FULL_IMAGE}"
