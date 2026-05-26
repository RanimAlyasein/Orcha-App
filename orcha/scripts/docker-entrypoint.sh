#!/bin/sh
# Orcha backend container entrypoint.
# Applies pending Prisma migrations then starts the API server.

set -e

echo "──────────────────────────────────────────"
echo "  Orcha API — Starting up"
echo "──────────────────────────────────────────"

echo "› Pushing database schema..."
npx prisma db push --skip-generate

echo "› Database schema is ready."

echo "› Seeding demo data (skipped if already present)..."
node prisma/seed.js || echo "› Seed skipped or already seeded."

echo "› Starting API server..."
exec node src/server.js
