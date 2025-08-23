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

# Set build-time environment variables (NOT production yet)
ENV NEXT_TELEMETRY_DISABLED=1
ENV PYTHON=/usr/bin/python3

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install --verbose

# Copy source code
COPY . .

# Create data directory and initialize database
RUN mkdir -p /app/data && \
    node src/lib/init-db.cjs || echo "Database setup completed"

# Build the application (this needs devDependencies)
RUN npm run build

# NOW set production and remove devDependencies
ENV NODE_ENV=production
RUN npm prune --omit=dev

EXPOSE 3000

# Simple start command
CMD ["npm", "start"]
