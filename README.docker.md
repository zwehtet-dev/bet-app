# Docker Deployment Guide

## Quick Start

### Using Docker Compose (Recommended)

1. Create a `.env` file from the example:
```bash
cp .env.example .env
```

2. Edit `.env` and set your API and WebSocket URLs:
```
NUXT_PUBLIC_API_BASE_URL=http://your-api-server:8001
NUXT_PUBLIC_WS_URL=ws://your-websocket-server:8000/ws
```

Note: For production with SSL, use `wss://` instead of `ws://` for WebSocket URL.

3. Build and run:
```bash
docker-compose up -d
```

4. Access the app at `http://localhost:3000`

### Using Docker CLI

1. Build the image:
```bash
docker build -t 2d3d-app .
```

2. Run the container:
```bash
docker run -d \
  --name 2d3d-app \
  -p 3000:3000 \
  -e NUXT_PUBLIC_API_BASE_URL=http://your-api-server:8001 \
  -e NUXT_PUBLIC_WS_URL=ws://your-websocket-server:8000/ws \
  2d3d-app
```

## Management Commands

### View logs
```bash
docker-compose logs -f
```

### Stop the application
```bash
docker-compose down
```

### Restart the application
```bash
docker-compose restart
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

## Production Deployment on Linux Server

1. Install Docker and Docker Compose on your Linux server
2. Clone your repository
3. Configure environment variables in `.env`
4. Run `docker-compose up -d`
5. (Optional) Set up nginx as reverse proxy for SSL/domain

## Environment Variables

- `NUXT_PUBLIC_API_BASE_URL`: Backend API URL (default: http://localhost:8001)
- `NUXT_PUBLIC_WS_URL`: WebSocket server URL (default: ws://localhost:8000/ws)
  - Use `wss://` for secure WebSocket connections in production

## Port Configuration

The application runs on port 3000 by default. To change it, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:3000"
```
