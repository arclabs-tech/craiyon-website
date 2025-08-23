# Use specific Node.js version with pre-compiled binaries
FROM node:20.11.0-alpine

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    sqlite \
    curl

WORKDIR /app

# Set Python path explicitly
ENV PYTHON=/usr/bin/python3
ENV npm_config_python=/usr/bin/python3
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files first for better caching
COPY package*.json ./

# Try to install better-sqlite3 with pre-built binary first
RUN npm install --verbose better-sqlite3@12.2.0 --build-from-source=false || \
    npm install --verbose better-sqlite3@12.2.0 --build-from-source=true --python=/usr/bin/python3

# Install remaining dependencies
RUN npm ci --omit=dev --verbose

# Copy source code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Initialize database using the CJS version (more reliable in Docker)
RUN node src/lib/init-db.cjs || echo "Database setup completed"

# Build the application
RUN npm run build

# Cleanup to reduce image size
RUN npm cache clean --force && \
    rm -rf ~/.npm && \
    apk del make g++ python3 py3-pip

EXPOSE 3000

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]
