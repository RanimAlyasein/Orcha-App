// ─── Prisma Client (Database) ──────────────────────────────────────────────────
// Prisma is the ORM (Object-Relational Mapper) used to talk to the database.
// It reads the schema from prisma/schema.prisma and generates type-safe methods
// for every table (e.g. prisma.user.findUnique, prisma.agent.create).
//
// A single shared instance is exported here so the database connection is
// reused across all modules rather than opening a new connection per request.
// ──────────────────────────────────────────────────────────────────────────────

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
