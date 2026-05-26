#!/usr/bin/env node
// Orcha Smoke Test — validates core API functionality after deployment.
// Usage: node scripts/smoke-test.js
//        API_URL=http://your-host:3010 node scripts/smoke-test.js

const BASE = process.env.API_URL || 'http://localhost:3010';
const LOGIN_EMAIL = process.env.SMOKE_EMAIL || 'manager@orcha.demo';
const LOGIN_PASS = process.env.SMOKE_PASS || 'password123';

let passed = 0;
let failed = 0;

async function test(label, fn) {
  try {
    await fn();
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (e) {
    console.error(`  ✗  ${label}`);
    console.error(`     ${e.message}`);
    failed++;
  }
}

async function json(url, opts = {}) {
  const res = await fetch(url, opts);
  const body = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${body?.error?.message || res.statusText}`);
  return body;
}

async function main() {
  console.log(`\n  Orcha Smoke Test`);
  console.log(`  Target: ${BASE}`);
  console.log(`  ─────────────────────────────────────\n`);

  // 1. Health check
  await test('GET /health → status ok', async () => {
    const body = await json(`${BASE}/health`);
    if (body.status !== 'ok') throw new Error(`Expected status "ok", got "${body.status}"`);
    if (!body.service) throw new Error('Missing "service" field in health response');
  });

  // 2. Auth — login
  let token;
  await test(`POST /api/v1/auth/login → returns JWT`, async () => {
    const body = await json(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASS }),
    });
    token = body.data?.token;
    if (!token) throw new Error('No token in response');
    if (!body.data?.user?.email) throw new Error('No user in response');
  });

  // 3. Dashboard summary (requires auth)
  await test('GET /api/v1/dashboard/summary → returns stats', async () => {
    const body = await json(`${BASE}/api/v1/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!body.success) throw new Error('Response not successful');
    const d = body.data;
    if (typeof d.connectedAgents === 'undefined') throw new Error('Missing connectedAgents');
    if (typeof d.eventsToday === 'undefined') throw new Error('Missing eventsToday');
    if (typeof d.pendingReviews === 'undefined') throw new Error('Missing pendingReviews');
  });

  // 4. Agents list (requires auth)
  await test('GET /api/v1/agents → returns paginated list', async () => {
    const body = await json(`${BASE}/api/v1/agents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!body.success) throw new Error('Response not successful');
    if (!Array.isArray(body.data)) throw new Error('data is not an array');
    if (typeof body.meta?.total === 'undefined') throw new Error('Missing meta.total');
  });

  // 5. Review queue (requires auth)
  await test('GET /api/v1/review-queue → returns review items', async () => {
    const body = await json(`${BASE}/api/v1/review-queue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!body.success) throw new Error('Response not successful');
    if (!Array.isArray(body.data)) throw new Error('data is not an array');
  });

  // 6. Reject bad credentials (security check)
  await test('POST /api/v1/auth/login with wrong password → 401', async () => {
    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: LOGIN_EMAIL, password: 'wrongpassword' }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // Summary
  const total = passed + failed;
  console.log(`\n  ─────────────────────────────────────`);
  if (failed === 0) {
    console.log(`  ✅  All ${total} tests passed.\n`);
  } else {
    console.log(`  ❌  ${failed} of ${total} tests failed.\n`);
    process.exit(1);
  }
}

main().catch(e => { console.error('\n  Fatal error:', e.message); process.exit(1); });
