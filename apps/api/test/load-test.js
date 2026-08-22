const autocannon = require('autocannon');

const URL = process.env.URL || 'http://localhost:3000';
const DURATION = 120; // 2 minutes
const CONNECTIONS = 50;

async function run() {
  console.log(`Starting load test on ${URL} with ${CONNECTIONS} concurrent users for ${DURATION}s...`);

  // Target 1: Login
  const loginTest = autocannon({
    url: `${URL}/auth/login`,
    connections: Math.floor(CONNECTIONS / 3),
    duration: DURATION,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });

  // Target 2: Dispatch Map (simulated GET)
  const dispatchTest = autocannon({
    url: `${URL}/operations/dispatch-map`,
    connections: Math.floor(CONNECTIONS / 3),
    duration: DURATION,
    method: 'GET',
    headers: { 'Authorization': 'Bearer fake-token' }
  });

  // Target 3: Loads List (simulated GET)
  const loadsTest = autocannon({
    url: `${URL}/loads`,
    connections: Math.floor(CONNECTIONS / 3) + (CONNECTIONS % 3),
    duration: DURATION,
    method: 'GET',
    headers: { 'Authorization': 'Bearer fake-token' }
  });

  const results = await Promise.all([
    new Promise((resolve) => loginTest.on('done', resolve)),
    new Promise((resolve) => dispatchTest.on('done', resolve)),
    new Promise((resolve) => loadsTest.on('done', resolve))
  ]);

  console.log('\n--- Load Test Results ---');
  results.forEach((res, index) => {
    const target = ['Login', 'Dispatch Map', 'Loads List'][index];
    console.log(`\nTarget: ${target} (${res.url})`);
    console.log(`Latency p50: ${res.latency.p50} ms`);
    console.log(`Latency p95: ${res.latency.p95} ms`);
    console.log(`Latency p99: ${res.latency.p99} ms`);
    console.log(`Total Requests: ${res.requests.total}`);
    console.log(`Errors (non-2xx/3xx): ${res.non2xx}`);
  });
}

run().catch(console.error);
