#!/bin/bash
# Deployment script for first-calc
# This script can be run manually on the server or via GitHub Actions

set -e

# Configuration
PROJECT_DIR="/opt/first-calc"
GIT_REPO="https://github.com/alex1c/first-calc.git"
CONTAINER_NAME="first-calc"
PORT="3003"

echo "Starting deployment of first-calc..."

# Navigate to project directory
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone or update repository
if [ -d ".git" ]; then
	echo "Updating repository..."
	git pull origin main
else
	echo "Cloning repository..."
	git clone $GIT_REPO .
fi

# Stop existing container if running
echo "Stopping existing container..."
docker-compose down || true

# Build and start new container
echo "Building new container..."
docker-compose build --no-cache

echo "Starting container..."
docker-compose up -d

# Clean up old images
echo "Cleaning up old Docker images..."
docker image prune -f

# Wait for container to be ready
echo "Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q $CONTAINER_NAME; then
	echo "✓ Deployment successful!"
	echo "Container is running on port $PORT"
	docker ps | grep $CONTAINER_NAME
else
	echo "✗ Deployment failed - container is not running"
	docker-compose logs
	exit 1
fi

