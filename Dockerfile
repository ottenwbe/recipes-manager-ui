# Get version from package.json (default to 'unknown' if not provided)
ARG APP_VERSION="unknown"

# Stage 1: Build the Vite application
FROM docker.io/node:26-alpine AS builder

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --quiet --no-audit --no-fund --legacy-peer-deps

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM docker.io/nginx:1.31-alpine

# Re-declare ARG for this stage
ARG APP_VERSION="unknown"

# Use the nginx user that already exists in the Alpine image
# Ensure directories exist with proper permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Remove default Nginx files before copying our assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Note: Nginx master process runs as root (required for port < 1024)
# Worker processes run as nginx user (configured in /etc/nginx/nginx.conf)

# Expose port 80 (Nginx's default HTTP port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
