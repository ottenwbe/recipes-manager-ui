#!/usr/bin/env bash
# Returns the current version of the application
# Source of truth: package.json

# Try to extract from package.json using Docker (avoids GLIBCXX issues)
VERSION=$(docker run --rm -v "$(pwd):/app" -w /app node:24-alpine sh -c "node -p \"require('./package.json').version\"" 2>/dev/null || cat VERSION 2>/dev/null || echo "unknown")

echo "${VERSION}"
