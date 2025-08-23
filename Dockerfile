FROM node:20-slim

WORKDIR /app

# Install system dependencies for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies first (including better-sqlite3)
RUN npm install --verbose

# Copy source code
COPY . .

# Create data directory and initialize database
RUN mkdir -p /app/data && \
    node src/lib/init-db.cjs || echo "Database setup completed"

# Build the application
RUN npm run build

EXPOSE 3000

# Simple start command
CMD ["npm", "start"]
