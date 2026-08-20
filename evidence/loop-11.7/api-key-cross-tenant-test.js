const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');
const crypto = require('crypto');

const BASE = 'http://localhost:8080/api/v1';

const COMP_A_ID = '030ebc04-acd0-4189-b6de-92264978a5fd';
const COMP_B_ID = 'bad77312-954c-437b-a34f-2e8d0d9587c5';

// Pre-existing fixture loads
const LOAD_A_ID = 'fb4653f2-78f1-4d58-9b56-eb626cac3351'; // Belongs to Company A
const LOAD_B_ID = '80df8a33-4ce5-43e9-9ca9-fc31335dd3e0'; // Belongs to Company B

function createApiKey(companyId) {
  const rawToken = 'pk_live_' + companyId.split('-')[0] + '_' + Date.now() + Math.random().toString(36).substring(7);
  const keyHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const sql = `
    INSERT INTO "ApiKey" (id, "companyId", name, "keyHash", scopes, "isActive", "updatedAt")
    VALUES (gen_random_uuid(), '${companyId}', 'Test Key', '${keyHash}', '["api:read"]', true, NOW());
  `;
  fs.writeFileSync('insert_cross.sql', sql);
  execSync(`cat insert_cross.sql | docker exec -i parilink-postgres-1 psql -U parilink -d parilink_db`);
  return rawToken;
}

async function tryReadLoad(token, loadId) {
  try {
    const res = await axios.get(`${BASE}/gateway/v1/loads/${loadId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { status: res.status, data: res.data };
  } catch (e) {
    return { status: e.response?.status, data: e.response?.data };
  }
}

async function main() {
  console.log('=== API Key Cross-Tenant Isolation Proof ===\n');

  const keyA = createApiKey(COMP_A_ID);
  console.log(`Created Company A Key: ${keyA}`);
  
  const keyB = createApiKey(COMP_B_ID);
  console.log(`Created Company B Key: ${keyB}\n`);

  // Test 1: Company A Key reading Company B Load
  console.log('--- Test 1: Company A Key -> Company B Load ---');
  const result1 = await tryReadLoad(keyA, LOAD_B_ID);
  console.log(`HTTP Status: ${result1.status}`);
  if (result1.status === 404 || result1.status === 403) {
    console.log(`✅ BLOCKED (Expected)`);
  } else {
    console.log(`🚨 LEAK (Unexpected): ${JSON.stringify(result1.data)}`);
  }

  // Test 2: Company B Key reading Company A Load
  console.log('\n--- Test 2: Company B Key -> Company A Load ---');
  const result2 = await tryReadLoad(keyB, LOAD_A_ID);
  console.log(`HTTP Status: ${result2.status}`);
  if (result2.status === 404 || result2.status === 403) {
    console.log(`✅ BLOCKED (Expected)`);
  } else {
    console.log(`🚨 LEAK (Unexpected): ${JSON.stringify(result2.data)}`);
  }
}

main().catch(console.error);
