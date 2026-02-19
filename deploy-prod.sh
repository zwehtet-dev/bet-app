#!/bin/bash

# Production Deployment Script for app-nuxt

set -e

echo "🚀 Starting production deployment..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Pull latest image
echo "📦 Pulling latest Docker image..."
docker compose -f docker-compose.prod.yml pull

# Stop and remove old containers
echo "🛑 Stopping old containers..."
docker compose -f docker-compose.prod.yml down

# Start new containers
echo "▶️  Starting new containers..."
docker compose -f docker-compose.prod.yml up -d

# Show logs
echo "📋 Container logs:"
docker compose -f docker-compose.prod.yml logs --tail=50

echo "✅ Deployment complete!"
echo "🔍 Check status: docker compose -f docker-compose.prod.yml ps"
echo "📋 View logs: docker compose -f docker-compose.prod.yml logs -f"
