# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN rm -rf node_modules package-lock.json.tmp || true
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

FROM node:20-bookworm-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Allows docker-compose to set the backend base URL at build time.
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Avoid Next.js telemetry/diagnostics filesystem writes during Docker builds.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_DIAGNOSTICS=1

RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Next.js standalone output contains the server and minimal node_modules.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# standalone output expects this path
CMD ["node", "server.js"]
