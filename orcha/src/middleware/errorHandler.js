// ─── Global Error Handler ──────────────────────────────────────────────────────
// Express calls this 4-argument middleware whenever any route calls next(err).
// Centralising error handling here means individual controllers don't need to
// format error responses themselves — they just catch and forward.
//
// Responsibilities:
//   - Log 5xx server errors (with stack trace in development)
//   - Translate Prisma database error codes into friendly HTTP responses
//   - Never leak internal error details to the client in production
// ──────────────────────────────────────────────────────────────────────────────

const { sendError } = require('../utils/response');
const { nodeEnv } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isProd = nodeEnv === 'production';

  // Log server errors for debugging. Stack traces are shown only in development
  // so production logs stay clean and don't expose internal paths.
  if (status >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path} — ${err.message}`);
    if (!isProd) console.error(err.stack);
  }

  // P2002: Prisma unique-constraint violation (e.g. duplicate email on register)
  if (err.code === 'P2002') return sendError(res, 'A record with this value already exists.', 409, 'CONFLICT');

  // P2025: Prisma record-not-found (e.g. updating an agent that was deleted)
  if (err.code === 'P2025') return sendError(res, 'Record not found.', 404, 'NOT_FOUND');

  // For client errors (4xx) pass the message through — it's intentional and safe.
  // For server errors (5xx) return a generic message so no internal details leak.
  const message = status < 500 ? err.message : 'An unexpected error occurred.';
  return sendError(res, message, status, err.code || 'SERVER_ERROR');
};

module.exports = { errorHandler };
