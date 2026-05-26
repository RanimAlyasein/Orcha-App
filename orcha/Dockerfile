# ─── Orcha Backend — Dockerfile ───────────────────────────────────────────────
# Two-stage build:
#   Stage 1 — installs ALL deps, generates Prisma client, prunes devDependencies
#   Stage 2 — minimal runtime image with non-root user
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build & prune ──────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Swap in the PostgreSQL schema and generate the Prisma client
RUN cp prisma/schema.postgres.prisma prisma/schema.prisma && npx prisma generate

# Keep the Prisma CLI available in the runtime image for startup schema checks.

# ── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache openssl wget

WORKDIR /app

# Copy node_modules and app source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Entrypoint
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Run as non-root for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /app /docker-entrypoint.sh
USER nodejs

EXPOSE 3010

ENV NODE_ENV=production

ENTRYPOINT ["/docker-entrypoint.sh"]
