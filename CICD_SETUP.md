# CI/CD Setup Instructions

## GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. `NUXT_PUBLIC_API_BASE_URL` - Your API base URL (e.g., `https://api.t2i.online`)
2. `NUXT_PUBLIC_WS_URL` - Your WebSocket URL (e.g., `wss://api.t2i.online/ws`)

## Server Environment Variables

Create a `.env` file on your production server with:

```bash
# GitHub Container Registry
GITHUB_REPOSITORY=your-username/your-repo

# App Configuration
APP_PORT=3000

# API Configuration (runtime)
NUXT_PUBLIC_API_BASE_URL=https://api.t2i.online
NUXT_PUBLIC_WS_URL=wss://api.t2i.online/ws
```

## Deployment Steps

1. Push to main branch or create a tag to trigger the CI/CD pipeline
2. The workflow will build the Docker image with environment variables baked in
3. Pull and run on your server:

```bash
cd app-nuxt
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## How It Works

- Build-time: Environment variables are passed as build args and baked into the Nuxt build
- Runtime: Same variables are available via docker-compose environment section
- The `.env.production` file is copied during Docker build for local builds
- GitHub Actions uses secrets for CI/CD builds
