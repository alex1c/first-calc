#!/bin/bash
# Auto-deploy script for first-calc
# Run this on the server: /opt/first-calc/auto-deploy.sh
# Or add to crontab: */5 * * * * /opt/first-calc/auto-deploy.sh >> /var/log/first-calc-deploy.log 2>&1

set -e

PROJECT_DIR="/var/www/first-calc"
LOG_FILE="/var/log/first-calc-deploy.log"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment check..."

cd "$PROJECT_DIR" || exit 1

# Fetch latest changes
git fetch origin main > /dev/null 2>&1

# Check if there are new commits
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "No new changes (local: $LOCAL, remote: $REMOTE)"
    exit 0
fi

log "New changes detected! Local: $LOCAL, Remote: $REMOTE"
log "Starting deployment..."

# Pull latest changes
git pull origin main

# Stop existing container
log "Stopping existing container..."
docker-compose down || true

# Build new container
log "Building new container..."
docker-compose build --no-cache

# Start container
log "Starting container..."
docker-compose up -d

# Clean up old images
log "Cleaning up old Docker images..."
docker image prune -f

# Wait for container to be ready
sleep 15

# Check if container is running
if docker ps | grep -q first-calc; then
    log "✓ Deployment successful!"
    docker ps | grep first-calc
else
    log "✗ Deployment failed - container is not running"
    docker-compose logs
    exit 1
fi

log "Deployment completed successfully"

