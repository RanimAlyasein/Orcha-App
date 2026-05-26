// ─── Express Application ───────────────────────────────────────────────────────
// This file creates and configures the Express app: security headers, CORS,
// body parsing, request logging, Swagger docs, and all route modules.
// It is kept separate from server.js so that tests can import the app without
// actually starting an HTTP server.
// ──────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { corsOrigins } = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const swaggerSpec = require('./docs/swagger');

const app = express();

// helmet adds ~14 HTTP security headers automatically (e.g. X-Content-Type-Options,
// X-Frame-Options). CSP is disabled here because the API serves JSON only —
// CSP is only relevant for pages that render HTML.
app.use(helmet({ contentSecurityPolicy: false }));

// CORS tells browsers which frontend origins are allowed to call this API.
// The allowed origins come from the CORS_ORIGINS environment variable so they
// can be changed without touching the code.
app.use(cors({ origin: corsOrigins, credentials: true }));

// Parse incoming JSON request bodies so controllers can read req.body
app.use(express.json());

// Simple request logger: prints method + path for every request in non-test envs.
// Useful for debugging and for showing "live traffic" during a demo.
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Swagger UI — interactive API documentation available at /api-docs
// Useful for exploring and testing all endpoints without a frontend
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: 'Orcha API Docs' }));

// Health check endpoint — used by Railway/Docker to verify the container is alive.
// Returns basic metadata about the running service.
app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'orcha-api',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
);

// ── Route modules ─────────────────────────────────────────────────────────────
// Each feature is isolated in its own module (routes → controller → service).
// /admin is mounted BEFORE the catch-all /api/v1 (team routes) so that
// Express matches admin routes first and they are not intercepted by the
// team middleware (which calls resolveOrg).

app.use('/api/v1/auth',           require('./modules/auth/auth.routes'));           // Login, register, password reset
app.use('/api/v1/admin',          require('./modules/admin/admin.routes'));          // System-admin: manage all users & orgs
app.use('/api/v1/organizations',  require('./modules/organizations/organizations.routes')); // Org settings & status
app.use('/api/v1/agents',         require('./modules/agents/agents.routes'));        // AI agent CRUD & webhook token
app.use('/api/v1/tasks',          require('./modules/tasks/tasks.routes'));          // Task tracking per agent
app.use('/api/v1/customers',      require('./modules/customers/customers.routes'));  // Customer/contact records
app.use('/api/v1/activity-logs',  require('./modules/activityLogs/activityLogs.routes'));  // Audit trail of events
app.use('/api/v1/audit-logs',     require('./modules/auditLogs/auditLogs.routes'));  // System-level audit log
app.use('/api/v1/dashboard',      require('./modules/dashboard/dashboard.routes'));  // Aggregated stats for the dashboard
app.use('/api/v1',                require('./modules/team/team.routes'));            // Team members & invitations (catch-all at /api/v1)
app.use('/api/v1',                require('./modules/externalEvents/externalEvents.routes')); // Webhook endpoint for agent event ingestion
app.use('/api/v1/review-queue',   require('./modules/reviewQueue/reviewQueue.routes'));       // Human review of AI-generated outputs
app.use('/api/v1/integrations/vapi', require('./modules/integrations/vapi/vapi.routes'));    // Vapi.ai voice-agent integration

// 404 handler — catches any request that didn't match a route above
app.use((req, res) =>
  res.status(404).json({ success: false, error: { message: 'Route not found.', code: 'NOT_FOUND' } })
);

// Global error handler — any error passed to next(err) lands here.
// Defined last so it catches errors from all routes above.
app.use(errorHandler);

module.exports = app;
