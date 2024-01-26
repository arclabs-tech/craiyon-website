FROM node:18-slim as base
WORKDIR /app

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM base AS release
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
ENTRYPOINT [ "node", "server.js" ]
