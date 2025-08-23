#!/bin/sh

echo "🚀 Starting Craiyon Website..."

# Ensure data directory exists
mkdir -p /app/data

# Initialize database if it doesn't exist
if [ ! -f "/app/data/craiyon.db" ]; then
    echo "📊 Initializing database..."
    node src/lib/init-db.cjs || {
        echo "❌ Database initialization failed, but continuing..."
    }
else
    echo "✅ Database already exists"
fi

# Start the application
echo "🌐 Starting Next.js server..."
exec npm start
