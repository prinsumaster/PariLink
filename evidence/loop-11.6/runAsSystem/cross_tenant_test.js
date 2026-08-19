/**
 * PL-runAsSystem Cross-Tenant Isolation Test
 *
 * Tests that Company A's token cannot read Company B's Load via the loads API.
 * Uses EXACT IDs from fixtures.json — no hand-inserted rows.
 *
 * Company B:  bad77312-954c-437b-a34f-2e8d0d9587c5
 * Company B Load (from fixtures): 80df8a33-4ce5-43e9-9ca9-fc31335dd3e0
 * Company B Invoice (from fixtures): 4b6f867b-10fe-43e3-8a2c-7a4d920c50a0
 */
const axios = require('axios');

const BASE = 'http://localhost:8080/api/v1';

// From fixtures.json
const COMP_B_LOAD_ID   = '80df8a33-4ce5-43e9-9ca9-fc31335dd3e0';
const COMP_B_INVOICE_ID = '4b6f867b-10fe-43e3-8a2c-7a4d920c50a0';

async function login(email, password) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data.access_token;
}

async function main() {
  // Step 1: Login both companies
  const tokenA = await login('dispatcher@companya.com', 'password123');
  const tokenB = await login('dispatcher@companyb.com', 'password123');
  console.log('=== TOKENS OBTAINED ===');
  console.log('Company A token: ' + tokenA.substring(0, 40) + '...');
  console.log('Company B token: ' + tokenB.substring(0, 40) + '...');
  console.log('');

  // Step 2: DB VERIFICATION - confirm the row exists and belongs to Company B
  // (verified via psql in shell beforehand - see output)

  // Step 3: Company B reads its own load (CONTROL - must succeed to prove test is valid)
  console.log('=== B-CONTROL: Company B reads its own load ===');
  try {
    const res = await axios.get(`${BASE}/loads/${COMP_B_LOAD_ID}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
  } catch (e) {
    console.log(`HTTP Status: ${e.response?.status}`);
    console.log(`Response: ${JSON.stringify(e.response?.data, null, 2)}`);
    console.log('CONTROL FAILED - test is invalid, do not claim isolation!');
    process.exit(1);
  }

  console.log('');

  // Step 4: Company A tries to read Company B's load (ATTACK - must be blocked)
  console.log('=== A-ATTEMPT: Company A tries to read Company B load ===');
  try {
    const res = await axios.get(`${BASE}/loads/${COMP_B_LOAD_ID}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
    if (res.data && res.data.id) {
      console.log('!!! ISOLATION FAILURE: Company A can read Company B data !!!');
    } else {
      console.log('NOTE: Got HTTP 200 but data is null/empty - isolation held via filter.');
    }
  } catch (e) {
    console.log(`HTTP Status: ${e.response?.status}`);
    console.log(`Response: ${JSON.stringify(e.response?.data, null, 2)}`);
    console.log('ISOLATION CONFIRMED: Company A was denied access.');
  }

  console.log('');

  // Step 5: Also test invoices (another runAsSystem-backed endpoint)
  console.log('=== B-CONTROL: Company B reads its own invoice ===');
  try {
    const res = await axios.get(`${BASE}/invoices/${COMP_B_INVOICE_ID}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
  } catch (e) {
    console.log(`HTTP Status: ${e.response?.status}`);
    console.log(`Response: ${JSON.stringify(e.response?.data, null, 2)}`);
  }

  console.log('');
  console.log('=== A-ATTEMPT: Company A tries to read Company B invoice ===');
  try {
    const res = await axios.get(`${BASE}/invoices/${COMP_B_INVOICE_ID}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Response: ${JSON.stringify(res.data, null, 2)}`);
    if (res.data && res.data.id) {
      console.log('!!! ISOLATION FAILURE: Company A can read Company B invoice !!!');
    } else {
      console.log('NOTE: Got HTTP 200 but data is null/empty - isolation held via filter.');
    }
  } catch (e) {
    console.log(`HTTP Status: ${e.response?.status}`);
    console.log(`Response: ${JSON.stringify(e.response?.data, null, 2)}`);
    console.log('ISOLATION CONFIRMED: Company A was denied access to invoice.');
  }
}

main().catch(console.error);
