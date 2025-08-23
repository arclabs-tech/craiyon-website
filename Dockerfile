FROM node:20-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install Python and build tools needed for better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
