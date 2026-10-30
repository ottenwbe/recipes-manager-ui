#!/usr/bin/env bash
# Run tests in Docker to avoid GLIBCXX issues
docker run --rm -v "$(pwd):/app:z" -w /app node:26-alpine sh -c "npm test"
