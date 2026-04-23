#!/usr/bin/env tsx
/**
 * System Check — Post-deploy lightweight monitoring
 *
 * Verifies:
 *   1. API health endpoint responds 200
 *   2. Turso DB is reachable (SELECT 1)
 *   3. Homepage loads (HTTP 200)
 *   4. Blog page loads (HTTP 200)
 *
 * Usage:
 *   npx tsx scripts/system-check.ts
 *   SITE_URL=https://onlineautoabmelden.com npx tsx scripts/system-check.ts
 */

const SITE = process.env.SITE_URL || 'https://onlineautoabmelden.com';
const HTTP_ATTEMPTS = Number(process.env.SYSTEM_CHECK_ATTEMPTS || '4');
const HTTP_TIMEOUT_MS = Number(process.env.SYSTEM_CHECK_TIMEOUT_MS || '15000');
const RETRY_DELAY_MS = Number(process.env.SYSTEM_CHECK_RETRY_DELAY_MS || '3000');

interface CheckResult {
  name: string;
  status: 'ok' | 'fail';
  detail?: string;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function httpCheck(name: string, url: string): Promise<CheckResult> {
  let lastDetail = 'Unknown error';

  for (let attempt = 1; attempt <= HTTP_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(HTTP_TIMEOUT_MS) });
      if (res.ok) {
        return {
          name,
          status: 'ok',
          detail: attempt > 1 ? `OK after ${attempt} attempts` : undefined,
        };
      }
      lastDetail = `HTTP ${res.status}`;
    } catch (e) {
      lastDetail = e instanceof Error ? e.message : String(e);
    }

    if (attempt < HTTP_ATTEMPTS) {
      await wait(RETRY_DELAY_MS);
    }
  }

  return { name, status: 'fail', detail: lastDetail };
}

async function dbCheck(): Promise<CheckResult> {
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) {
    return { name: 'DB', status: 'fail', detail: 'Missing TURSO env vars' };
  }
  try {
    const { createClient } = await import('@libsql/client');
    const db = createClient({ url, authToken: token });
    await db.execute('SELECT 1');
    db.close();
    return { name: 'DB', status: 'ok' };
  } catch (e) {
    return { name: 'DB', status: 'fail', detail: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  console.log('🔍 Running system checks...\n');

  const results = await Promise.all([
    httpCheck('API', `${SITE}/api/health`),
    dbCheck(),
    httpCheck('Homepage', `${SITE}/`),
    httpCheck('Blog', `${SITE}/insiderwissen`),
  ]);

  console.log('═══════════════════════════════════════════');
  console.log('  SYSTEM CHECK');
  console.log(`  ${new Date().toISOString()}`);
  console.log(`  Target: ${SITE}`);
  console.log(`  HTTP attempts: ${HTTP_ATTEMPTS} | timeout: ${HTTP_TIMEOUT_MS}ms`);
  console.log('═══════════════════════════════════════════');
  console.log('');

  let allOk = true;
  for (const r of results) {
    const icon = r.status === 'ok' ? '✅' : '❌';
    const extra = r.detail ? ` (${r.detail})` : '';
    console.log(`  ${r.name}: ${icon}${extra}`);
    if (r.status === 'fail') allOk = false;
  }

  console.log('');
  console.log('═══════════════════════════════════════════');
  if (allOk) {
    console.log('  RESULT: ✅ OK — all systems operational');
  } else {
    console.log('  RESULT: ❌ FAIL — some checks failed');
  }
  console.log('═══════════════════════════════════════════');

  if (!allOk) process.exit(1);
}

main();
