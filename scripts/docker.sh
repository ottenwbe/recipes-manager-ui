#!/usr/bin/env bash
# Unified Docker build and push script for recipes-manager-ui

set -euo pipefail
umask 027

# Configuration
MAINTAINER="Beate Ottenwaelder <ottenwbe.public@gmail.com>"
IMAGE_NAME="ottenwbe/recipes-manager-ui"
DOCKER_FILE="Dockerfile"
GIT_REPO="https://github.com/ottenwbe/recipes-manager-ui"

# --- Validation Functions ---

validate_tag() {
    local tag="$1"
    if [[ ! "$tag" =~ ^[a-zA-Z0-9][a-zA-Z0-9._-]*$ ]]; then
        echo "Error: Invalid tag format: '$tag'. Use alphanumeric, ., -, _ only." >&2
        exit 1
    fi
}

validate_registry() {
    local registry="$1"
    if [[ ! "$registry" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*(:[0-9]+)?$ ]]; then
        echo "Error: Invalid registry format: '$registry'." >&2
        exit 1
    fi
}

validate_type() {
    local type="$1"
    case "$type" in
        dev|production) ;;
        *) echo "Error: Invalid type '$type'. Use 'dev' or 'production'." >&2; exit 1 ;;
    esac
}

# --- Metadata Functions ---

# Get version from package.json
get_version() {
    awk -F'"' '/"version"/ {print $4; exit}' package.json 2>/dev/null || echo "unknown"
}

# Get git metadata
get_git_hash() {
    git rev-parse --short HEAD 2>/dev/null || echo "unknown"
}

get_git_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
}

# --- Usage ---

usage() {
    cat <<EOF
Usage: $0 <command> [options]

Commands:
  build       Build Docker image
  push        Push Docker image

Build options:
  --multi            Use docker buildx for multi-platform build (arm64, amd64)
  --push             Push image after build
  --tag TAG          Image tag (default: version from package.json)
  --registry REG     Docker registry (default: docker.io)
  --type TYPE        Build type: dev, production (default: production)

Push options:
  --tag TAG          Image tag to push
  --registry REG     Docker registry (default: docker.io)
  -u USER            Docker username
  -p PASS            Docker password (DEPRECATED - use DOCKER_PASSWORD env var instead)

Environment:
  DOCKER_USERNAME    Docker registry username
  DOCKER_PASSWORD    Docker registry password

Examples:
  $0 build --type dev
  $0 build --multi --push --type production
  $0 build --type dev --push
  $0 push --tag 1.0.0 -u user
EOF
    exit 1
}

# --- Docker Login ---

docker_login() {
    local username="$1"
    local password="$2"
    local registry="${3:-docker.io}"

    if [ -n "$username" ] && [ -n "$password" ]; then
        echo "$password" | docker login -u "$username" "$registry" --password-stdin
    elif [ -n "${DOCKER_USERNAME:-}" ] && [ -n "${DOCKER_PASSWORD:-}" ]; then
        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" "$registry" --password-stdin
    else
        echo "Warning: No Docker credentials provided for ${registry}. Trying without login."
    fi
}

# --- Build Command ---

cmd_build() {
    local multi=false
    local push_flag=false
    local tag=""
    local registry="docker.io"
    local build_type="production"

    while [ $# -gt 0 ]; do
        case "$1" in
            --multi) multi=true; shift ;;
            --push) push_flag=true; shift ;;
            --tag) tag="$2"; shift 2 ;;
            --registry) registry="$2"; shift 2 ;;
            --type) build_type="$2"; shift 2 ;;
            *) usage ;;
        esac
    done

    # Validate inputs
    validate_type "$build_type"
    [ "$registry" != "docker.io" ] && validate_registry "$registry"

    # Get metadata
    local date=$(date +"%F %T")
    local git_hash=$(get_git_hash)
    local git_branch=$(get_git_branch)
    local app_version=$(get_version)

    # Determine tag
    if [ -z "$tag" ]; then
        case "$build_type" in
            dev) tag="development" ;;
            production) tag="$app_version" ;;
        esac
    fi
    
    # Validate final tag (user-provided or default)
    validate_tag "$tag"

    local full_image="${registry:+${registry}/}${IMAGE_NAME}:${tag}"

    # Build command
    local build_args=(
        build
        --build-arg "APP_VERSION=${app_version}"
        --label "org.opencontainers.image.title=recipes-manager-ui"
        --label "org.opencontainers.image.description=Recipes Manager UI - React/Vite frontend"
        --label "org.opencontainers.image.version=${app_version}"
        --label "org.opencontainers.image.created=${date}"
        --label "org.opencontainers.image.revision=${git_hash}"
        --label "org.opencontainers.image.source=${GIT_REPO}"
        --label "maintainer=${MAINTAINER}"
        -t "${full_image}"
        -f "${DOCKER_FILE}"
        "."
    )

    if [ "$multi" = true ]; then
        build_args=("docker" "buildx" "${build_args[@]}")
        build_args+=("--platform" "linux/arm64/v8,linux/amd64")
        # With docker-container driver, need explicit output destination
        if [ "$push_flag" = true ]; then
            build_args+=("--output" "type=registry,push=true")
        else
            build_args+=("--output" "type=docker,dest=docker-daemon:")
        fi
    else
        build_args=("docker" "${build_args[@]}")
    fi

    echo "Building ${full_image}..."
    echo "  Version: ${app_version}"
    echo "  Type: ${build_type}"
    echo "  Date: ${date}"
    echo "  Git: ${git_branch}@${git_hash}"
    echo ""

    "${build_args[@]}"

    # For non-multi builds, push separately (multi builds handle push via buildx)
    if [ "$push_flag" = true ] && [ "$multi" = false ]; then
        echo ""
        cmd_push --tag "$tag" --registry "$registry"
    fi

    echo ""
    echo "Success: built ${full_image}"
}

# --- Push Command ---

cmd_push() {
    local tag=""
    local registry="docker.io"
    local username=""
    local password=""

    while [ $# -gt 0 ]; do
        case "$1" in
            --tag) tag="$2"; shift 2 ;;
            --registry) registry="$2"; shift 2 ;;
            -u) username="$2"; shift 2 ;;
            -p) 
                echo "Warning: -p/--password option is deprecated. Use DOCKER_PASSWORD environment variable instead." >&2
                shift 2
                ;;
            *) usage ;;
        esac
    done

    # Validate inputs
    [ "$registry" != "docker.io" ] && validate_registry "$registry"

    if [ -z "$tag" ]; then
        tag=$(get_version)
    fi
    
    # Validate final tag (user-provided or default)
    validate_tag "$tag"

    local full_image="${registry:+${registry}/}${IMAGE_NAME}:${tag}"

    # Login if needed
    docker_login "$username" "$password" "$registry"

    echo "Pushing ${full_image}..."
    docker push "${full_image}"
    echo "Success: pushed ${full_image}"
}

# --- Main ---

case "${1:-}" in
    build)
        shift
        cmd_build "$@"
        ;;
    push)
        shift
        cmd_push "$@"
        ;;
    *)
        usage
        ;;
esac
