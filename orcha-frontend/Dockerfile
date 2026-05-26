# ─── Orcha Frontend — Dockerfile ──────────────────────────────────────────────
# Two-stage build:
#   Stage 1 — Node 20 builds the Vite/React app into /dist
#   Stage 2 — nginx Alpine serves the static build; proxies /api/ to backend
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_URL is optional — when set, axios uses it as the API base URL.
# For docker-compose deployments the nginx proxy handles /api/ routing,
# so this variable is not required unless deploying frontend and backend on
# separate hosts.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy production build from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template — BACKEND_URL is substituted at container start via envsubst
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# nginx Docker image auto-runs envsubst on /etc/nginx/templates/*.template
# and writes the result to /etc/nginx/conf.d/ before starting nginx.
CMD ["nginx", "-g", "daemon off;"]
