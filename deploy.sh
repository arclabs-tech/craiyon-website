#!/bin/bash

# Quick production deployment script
echo "🚀 Deploying Craiyon Website for Production..."

# Set environment variables
export NODE_ENV=production
export NEBIUS_API_KEYS=${NEBIUS_API_KEYS:-"your-api-keys-here"}

# Build and run with Docker Compose
echo "📦 Building Docker containers..."
docker-compose down
docker-compose build --no-cache

echo "🗄️ Initializing database..."
docker-compose up init-db

echo "🌐 Starting application..."
docker-compose up -d app

echo "✅ Deployment complete!"
echo "🌍 Your app is running at: http://localhost:3000"
echo "📊 Check status with: docker-compose ps"
echo "📝 View logs with: docker-compose logs -f app"