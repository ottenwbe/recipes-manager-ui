#!/usr/bin/env bash
# Returns the current version of the application
# Source of truth: package.json

awk -F'"' '/"version"/ {print $4; exit}' package.json 2>/dev/null || echo "unknown"
