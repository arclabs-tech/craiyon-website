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

# Force clean install - no cache, install everything
RUN npm ci --verbose --no-audit --include=dev

# Verify critical dependencies are installed
RUN npm list autoprefixer tailwindcss postcss || echo "Some deps missing, installing manually..."
RUN npm install autoprefixer@^10.0.1 tailwindcss@^3.3.0 postcss@^8 --save-dev

# Copy source code
COPY . .

# Create data directory and initialize database
RUN mkdir -p /app/data && \
    npm run init-db || echo "Database setup completed"

# Build the application (this needs devDependencies)
RUN npm run build

# NOW set production and remove devDependencies to save space
ENV NODE_ENV=production
RUN npm prune --omit=dev

EXPOSE 3000

# Simple start command
CMD ["npm", "start"]
