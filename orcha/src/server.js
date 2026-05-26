// ─── Entry Point ──────────────────────────────────────────────────────────────
// This file starts the HTTP server. It imports the Express app (configured in
// app.js) and binds it to a port. It also handles graceful shutdown so that
// in-flight requests finish before the process exits — important in production
// (e.g. Railway restarts the container with SIGTERM before deploying a new build).
// ──────────────────────────────────────────────────────────────────────────────

const app = require('./app');
const { port, nodeEnv } = require('./config/env');

// Start listening for HTTP requests on the configured port
const server = app.listen(port, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    Orcha — AI Agent Management API  v2.0     ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(`  Environment : ${nodeEnv}`);
  console.log(`  Server      : http://localhost:${port}`);
  console.log(`  Health      : http://localhost:${port}/health\n`);
});

// Graceful shutdown: stop accepting new connections, wait for existing ones to
// finish, then exit cleanly. The 10-second timeout forces exit if a connection
// hangs and never closes (e.g. a long-polling client).
const shutdown = (signal) => {
  console.log(`\n[server] ${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log('[server] HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => { console.error('[server] Forced shutdown after timeout'); process.exit(1); }, 10_000);
};

// SIGTERM is sent by Docker/Railway when deploying a new version
process.on('SIGTERM', () => shutdown('SIGTERM'));
// SIGINT is sent when the developer presses Ctrl+C in the terminal
process.on('SIGINT',  () => shutdown('SIGINT'));

// Catch any programming error that was not caught by a try/catch block
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  shutdown('uncaughtException');
});

// Catch any unhandled Promise rejection (e.g. missing .catch() on async calls)
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});
