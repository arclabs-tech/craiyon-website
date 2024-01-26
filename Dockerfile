FROM node:18-slim
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
