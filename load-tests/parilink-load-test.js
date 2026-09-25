/**
 * load-tests/parilink-load-test.js
 *
 * TARGET: 1,00,000 req/hr = ~28 req/s sustained.
 *
 * THRESHOLDS (pre-committed before running):
 *   - Error rate:    < 1%      (http_req_failed rate < 0.01)
 *   - p95 latency:  < 500ms
 *   - p99 latency:  < 1500ms
 *
 * SCENARIO:
 *   Ramp from 0 → 15 VUs over 1 minute, sustain for 5 minutes, ramp down.
 *   At ~15 VUs each doing ~2 req/s (typical for mixed read/write), we get ~28-30 req/s.
 *
 * ENDPOINT MIX (realistic fleet-dashboard usage):
 *   40% GET /vehicles           (list — most common dashboard hit)
 *   20% GET /vehicles/:id/tco   (heavy, Redis-cached)
 *   15% GET /trips              (ops list)
 *   10% GET /billing/invoices   (finance)
 *   10% GET /fuel-logs          (fuel ops)
 *    5% POST /fuel-logs         (writes — minority of traffic)
 *
 * Usage:
 *   k6 run load-tests/parilink-load-test.js \
 *     -e BASE_URL=http://localhost:8080/api/v1 \
 *     -e ADMIN_EMAIL=admin@parilink.com \
 *     -e ADMIN_PASSWORD=password123 \
 *     -e VEHICLE_ID=<a_real_vehicle_id>
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// ── custom metrics ────────────────────────────────────────────────────────────
const tcoLatency      = new Trend('tco_latency_ms',      true);
const vehicleLatency  = new Trend('vehicle_list_ms',     true);
const tripLatency     = new Trend('trips_list_ms',       true);
const invoiceLatency  = new Trend('invoice_list_ms',     true);
const fuelReadLatency = new Trend('fuel_read_ms',        true);
const fuelWriteErrors = new Counter('fuel_write_errors');

// ── scenario config ───────────────────────────────────────────────────────────
export const options = {
  scenarios: {
    sustained_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 20 },   // ramp up
        { duration: '5m', target: 20 },   // sustain — target ~35 req/s
        { duration: '30s', target: 0 },   // ramp down
      ],
      gracefulRampDown: '30s',
    },
  },

  // PRE-COMMITTED THRESHOLDS — DO NOT CHANGE AFTER SEEING RESULTS
  thresholds: {
    http_req_failed:        ['rate<0.01'],        // <1% error rate
    http_req_duration:      ['p(95)<500', 'p(99)<1500'],
    tco_latency_ms:         ['p(95)<800'],        // TCO allowed higher (DB agg)
    vehicle_list_ms:        ['p(95)<300'],
    trips_list_ms:          ['p(95)<300'],
    invoice_list_ms:        ['p(95)<400'],
    fuel_read_ms:           ['p(95)<300'],
  },
};

// ── auth — runs once per VU ───────────────────────────────────────────────────
const BASE_URL       = __ENV.BASE_URL       || 'http://localhost:8080/api/v1';
const ADMIN_EMAIL    = __ENV.ADMIN_EMAIL    || 'admin@parilink.com';
const ADMIN_PASSWORD = __ENV.ADMIN_PASSWORD || 'password123';
const VEHICLE_ID     = __ENV.VEHICLE_ID     || '';

let token = null;
let vehicleId = VEHICLE_ID;
const today = new Date().toISOString().split('T')[0];
const threeMonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];

export function setup() {
  // Login once and share token + vehicleId to all VUs via returned data object
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  const loginOk = check(loginRes, {
    'setup: login 200': (r) => r.status === 200,
    'setup: got token': (r) => !!r.json('access_token'),
  });

  if (!loginOk) {
    console.error('LOGIN FAILED: ', loginRes.status, loginRes.body);
    return { token: null, vehicleId: null };
  }

  const tok = loginRes.json('access_token');

  // If no VEHICLE_ID env, fetch first vehicle
  let vid = VEHICLE_ID;
  if (!vid) {
    const vRes = http.get(`${BASE_URL}/vehicles?limit=1`, {
      headers: { Authorization: `Bearer ${tok}` },
    });
    if (vRes.status === 200) {
      const body = vRes.json();
      const vehicles = Array.isArray(body) ? body : (body.data || body.items || []);
      if (vehicles.length > 0) {
        vid = vehicles[0].id;
      }
    }
  }

  // Fetch a trip that has a driver (required for POST /fuel-logs)
  let tripId = null;
  let driverId = null;
  const tripsRes = http.get(`${BASE_URL}/trips?limit=50`, {
    headers: { Authorization: `Bearer ${tok}` },
  });
  if (tripsRes.status === 200) {
    const tbody = tripsRes.json();
    const allTrips = Array.isArray(tbody) ? tbody : (tbody.data || tbody.items || []);
    const tripsWithDriver = allTrips.filter((t) => t.driverId);
    if (tripsWithDriver.length > 0) {
      tripId = tripsWithDriver[0].id;
      driverId = tripsWithDriver[0].driverId;
    }
  }
  // Fallback: use known seeded values from DB
  if (!tripId) {
    tripId = '48f88f84-22a4-41d8-b594-1e0802f0d7ee';
    driverId = '3c2f1936-abbb-4f1e-a2cc-0befaf39327c';
  }

  console.log(`setup: token acquired, vehicleId=${vid}, tripId=${tripId}, driverId=${driverId}`);
  return { token: tok, vehicleId: vid, tripId, driverId, today, threeMonthsAgo };
}

// ── main VU function ──────────────────────────────────────────────────────────
export default function (data) {
  if (!data || !data.token) {
    sleep(1);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type':  'application/json',
  };
  const vid    = data.vehicleId;
  const from   = data.threeMonthsAgo;
  const to     = data.today;

  // Weighted random endpoint selection
  const roll = Math.random();

  if (roll < 0.40) {
    // ── 40% GET /vehicles ─────────────────────────────────────────────────
    const r = http.get(`${BASE_URL}/vehicles?limit=20`, { headers });
    vehicleLatency.add(r.timings.duration);
    check(r, { 'GET /vehicles: 200': (res) => res.status === 200 });

  } else if (roll < 0.60) {
    // ── 20% GET /vehicles/:id/tco (Redis-cached after first hit) ──────────
    if (vid) {
      const r = http.get(`${BASE_URL}/vehicles/${vid}/tco?fromDate=${from}&toDate=${to}`, { headers });
      tcoLatency.add(r.timings.duration);
      check(r, { 'GET TCO: 200': (res) => res.status === 200 });
    }

  } else if (roll < 0.75) {
    // ── 15% GET /trips ────────────────────────────────────────────────────
    const r = http.get(`${BASE_URL}/trips?limit=20`, { headers });
    tripLatency.add(r.timings.duration);
    check(r, { 'GET /trips: 200': (res) => res.status === 200 });

  } else if (roll < 0.85) {
    // ── 10% GET /billing/invoices ─────────────────────────────────────────
    const r = http.get(`${BASE_URL}/billing/invoices?limit=20`, { headers });
    invoiceLatency.add(r.timings.duration);
    check(r, { 'GET /invoices: 200': (res) => res.status === 200 });

  } else if (roll < 0.95) {
    // ── 10% GET /fuel-logs ────────────────────────────────────────────────
    const r = http.get(`${BASE_URL}/fuel-logs?limit=20`, { headers });
    fuelReadLatency.add(r.timings.duration);
    check(r, { 'GET /fuel-logs: 200': (res) => res.status === 200 });

  } else {
    // ── 5% POST /fuel-logs (write) ────────────────────────────────────────
    if (vid && data.tripId && data.driverId) {
      const amt = 14000 + Math.random() * 5000;
      const payload = JSON.stringify({
        vehicleId: vid,
        tripId:    data.tripId,
        driverId:  data.driverId,
        litres:    150 + Math.random() * 100,
        amount:    amt,
        pump:      'HP Petrol Bandra',
      });
      const r = http.post(`${BASE_URL}/fuel-logs`, payload, { headers });
      if (r.status !== 201 && r.status !== 200) {
        fuelWriteErrors.add(1);
      }
      check(r, { 'POST /fuel-logs: 201': (res) => res.status === 201 || res.status === 200 });
    }
  }

  // Realistic think time: 0.3–0.7s between requests per VU
  sleep(0.3 + Math.random() * 0.4);
}

export function teardown(data) {
  if (data && data.token) {
    console.log('teardown: load test complete');
  }
}
