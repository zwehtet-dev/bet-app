# Deployment Guide - App Nuxt

## CI/CD Pipeline Overview

This project uses GitHub Actions for automated CI/CD with Docker registry (GitHub Container Registry).

### Workflows

1. **CI** (`ci.yml`) - Runs on PRs and pushes to main/develop
   - Installs dependencies
   - Runs tests
   - Builds the application

2. **Docker Build and Push** (`docker-build-push.yml`) - Runs on push to main
   - Builds Docker image
   - Pushes to GitHub Container Registry (ghcr.io)
   - Creates multi-platform images (amd64, arm64)
   - Tags: latest, branch name, commit SHA, semantic versions

3. **Deploy** (`deploy.yml`) - Runs after successful Docker build
   - Connects to production server via SSH
   - Pulls latest Docker image
   - Restarts the application

## Setup Instructions

### 1. GitHub Repository Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

```
DEPLOY_HOST          # Production server IP or hostname
DEPLOY_USER          # SSH username
DEPLOY_SSH_KEY       # SSH private key
DEPLOY_PORT          # SSH port (default: 22)
DEPLOY_PATH          # Path to project on server (e.g., /var/www/app-nuxt)
```

### 2. Enable GitHub Container Registry

1. Go to repository Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

### 3. Server Setup

On your production server:

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Create project directory
mkdir -p /var/www/app-nuxt
cd /var/www/app-nuxt

# Copy docker-compose.prod.yml and .env.production
# Set up environment variables
cp .env.production.example .env.production
nano .env.production
```

### 4. First Deployment

```bash
# On your server
cd /var/www/app-nuxt

# Login to GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull and start
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Manual Deployment

### Build and Push Manually

```bash
# Build image
docker build -t ghcr.io/YOUR_USERNAME/YOUR_REPO/app-nuxt:latest ./app-nuxt

# Login to registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Push image
docker push ghcr.io/YOUR_USERNAME/YOUR_REPO/app-nuxt:latest
```

### Deploy on Server

```bash
# Pull latest image
docker-compose -f docker-compose.prod.yml pull

# Restart services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app-nuxt
```

## Monitoring

```bash
# Check container status
docker ps

# View logs
docker logs app-nuxt-prod -f

# Check health
docker inspect app-nuxt-prod | grep -A 10 Health
```

## Rollback

```bash
# List available images
docker images | grep app-nuxt

# Pull specific version
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO/app-nuxt:COMMIT_SHA

# Update docker-compose.prod.yml to use specific tag
# Then restart
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container won't start
```bash
docker logs app-nuxt-prod
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

### Permission denied on registry
```bash
# Ensure GITHUB_TOKEN has packages:write permission
# Re-login to registry
docker logout ghcr.io
echo NEW_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### Out of disk space
```bash
# Clean up old images
docker image prune -a -f

# Clean up volumes
docker volume prune -f
```
