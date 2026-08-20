/**
 * A8 — Cross-Tenant Cache & Analytics Leak Test
 *
 * Protocol:
 *   1. Login both tenants
 *   2. Flush Redis to start clean
 *   3. Warm every analytics/dashboard/fleet endpoint as Company A
 *   4. Immediately read same endpoints as Company B
 *   5. Compare: if B sees A's non-zero numbers → LEAK
 *   6. Dump all Redis keys and verify tenant-scoping
 *
 * Fixtures (from evidence/loop-11.5/fixtures.json):
 *   Company A: 030ebc04-acd0-4189-b6de-92264978a5fd
 *   Company B: bad77312-954c-437b-a34f-2e8d0d9587c5
 */
const axios = require('axios');
const { execSync } = require('child_process');

const BASE = 'http://localhost:8080/api/v1';
const COMP_A_ID = '030ebc04-acd0-4189-b6de-92264978a5fd';
const COMP_B_ID = 'bad77312-954c-437b-a34f-2e8d0d9587c5';

async function login(email, password) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data.access_token;
}

function header(token) {
  return { Authorization: `Bearer ${token}` };
}

async function get(path, token) {
  try {
    const res = await axios.get(`${BASE}${path}`, { headers: header(token) });
    return { status: res.status, data: res.data };
  } catch (e) {
    return { status: e.response?.status, data: e.response?.data };
  }
}

function flattenNumbers(obj, prefix = '') {
  const result = {};
  if (!obj || typeof obj !== 'object') return result;
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'number') {
      result[fullKey] = v;
    } else if (Array.isArray(v)) {
      result[fullKey + '.length'] = v.length;
    } else if (typeof v === 'object' && v !== null) {
      Object.assign(result, flattenNumbers(v, fullKey));
    }
  }
  return result;
}

const ENDPOINTS = [
  { path: '/analytics/kpis',           name: 'Analytics KPIs' },
  { path: '/analytics/trends',         name: 'Analytics Trends' },
  { path: '/analytics/revenue',        name: 'Analytics Revenue' },
  { path: '/reports/dashboard',        name: 'Reports Dashboard' },
  { path: '/reports/customers',        name: 'Reports Customers' },
  { path: '/reports/drivers',          name: 'Reports Drivers' },
  { path: '/reports/vehicles',         name: 'Reports Vehicles' },
  { path: '/dispatch/live-map',        name: 'Dispatch Live Map' },
  { path: '/dispatch/control-tower',   name: 'Control Tower' },
  { path: '/invoices',                 name: 'Invoices List' },
  { path: '/payments',                 name: 'Payments List' },
  { path: '/loads',                    name: 'Loads List' },
  { path: '/trips',                    name: 'Trips List' },
  { path: '/fleet/vehicles',           name: 'Vehicles List' },
  { path: '/fleet/drivers',            name: 'Drivers List' },
];

async function main() {
  console.log('=== A8 Cross-Tenant Cache & Analytics Leak Test ===\n');

  const tokenA = await login('admin@companya.com', 'password123');
  const tokenB = await login('admin@companyb.com', 'password123');
  console.log('Tokens obtained.\n');

  // Flush Redis for clean start
  try {
    execSync('docker exec parilink-redis-1 redis-cli FLUSHALL', { stdio: 'pipe' });
    console.log('Redis FLUSHED — clean start.\n');
  } catch (e) {
    console.log('WARN: Could not flush Redis. Continuing.\n');
  }

  // Warm as Company A
  console.log('--- STEP 1: WARM as Company A ---');
  const aResults = {};
  for (const ep of ENDPOINTS) {
    const r = await get(ep.path, tokenA);
    aResults[ep.path] = r;
    console.log(`  A GET ${ep.path} → HTTP ${r.status}`);
  }

  // Read immediately as Company B (hits cache if key has no tenant)
  console.log('\n--- STEP 2: READ as Company B (should NOT hit A\'s cache) ---');
  const bResults = {};
  for (const ep of ENDPOINTS) {
    const r = await get(ep.path, tokenB);
    bResults[ep.path] = r;
    console.log(`  B GET ${ep.path} → HTTP ${r.status}`);
  }

  // Dump Redis keys
  console.log('\n--- STEP 3: REDIS KEY DUMP ---');
  let redisKeys = '';
  try {
    redisKeys = execSync('docker exec parilink-redis-1 redis-cli KEYS "*"', { encoding: 'utf8' }).trim();
    console.log(redisKeys || '(no keys)');
  } catch (e) {
    console.log('(Redis key dump failed)');
  }

  // Compare results
  console.log('\n--- STEP 4: COMPARISON ---');
  let anyLeak = false;

  for (const ep of ENDPOINTS) {
    const a = aResults[ep.path];
    const b = bResults[ep.path];

    if (!a || !b || (a.status >= 400 && b.status >= 400)) {
      console.log(`⬜  [SKIP] ${ep.name} — A=${a?.status} B=${b?.status} (endpoint not accessible)`);
      continue;
    }

    const aNumbers = flattenNumbers(a.data);
    const bNumbers = flattenNumbers(b.data);

    const nonZeroLeaks = [];
    for (const [key, val] of Object.entries(aNumbers)) {
      if (val > 0 && bNumbers[key] === val) {
        nonZeroLeaks.push({ key, value: val });
      }
    }

    if (nonZeroLeaks.length > 0) {
      anyLeak = true;
      console.log(`🚨 [LEAK] ${ep.name}`);
      console.log(`   B received same non-zero values as A: ${JSON.stringify(nonZeroLeaks)}`);
      console.log(`   A data: ${JSON.stringify(a.data).slice(0, 300)}`);
      console.log(`   B data: ${JSON.stringify(b.data).slice(0, 300)}`);
    } else {
      console.log(`✅ [ISOLATED] ${ep.name}`);
      console.log(`   A: ${JSON.stringify(a.data).slice(0, 120)}`);
      console.log(`   B: ${JSON.stringify(b.data).slice(0, 120)}`);
    }
  }

  // Check Redis key namespace
  console.log('\n--- STEP 5: KEY NAMESPACE ANALYSIS ---');
  const keyLines = redisKeys.split('\n').filter(Boolean);
  const infraPrefixes = ['bf:', 'nonce:', 'throttle:', 'bull:', '_health_check', 'idempotency:'];
  const datakeyLines = keyLines.filter(k => !infraPrefixes.some(p => k.startsWith(p)));

  const unscopedKeys = datakeyLines.filter(k =>
    !k.includes(COMP_A_ID) && !k.includes(COMP_B_ID)
  );

  console.log(`Total Redis keys after warm: ${keyLines.length}`);
  console.log(`Data keys (non-infra): ${datakeyLines.length}`);
  if (unscopedKeys.length > 0) {
    console.log(`\n⚠️  UNSCOPED DATA KEYS (no companyId in key):`);
    unscopedKeys.forEach(k => console.log(`   "${k}"`));
  } else {
    console.log(`✅ All data keys contain companyId — no unscoped tenant keys found.`);
  }

  console.log('\n=== FINAL VERDICT ===');
  if (anyLeak) {
    console.log('🚨 A8 GATE: FAIL — cross-tenant data leak detected. See above.');
  } else {
    console.log('✅ A8 GATE: PASS — no cross-tenant data leak on any tested endpoint.');
  }
}

main().catch(console.error);
