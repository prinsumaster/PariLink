const crypto = require('crypto');
const { execSync } = require('child_process');
const axios = require('axios');
const fs = require('fs');

const BASE = 'http://localhost:8080/api/v1';
const COMP_A_ID = '030ebc04-acd0-4189-b6de-92264978a5fd';

const rawToken = 'pk_live_comp_a_' + Date.now();
const keyHash = crypto.createHash('sha256').update(rawToken).digest('hex');

async function main() {
  console.log('=== API KEY ISOLATION TEST ===');
  
  // 1. Insert API key for Company A
  const sql = `
    INSERT INTO "ApiKey" (id, "companyId", name, "keyHash", scopes, "isActive", "updatedAt")
    VALUES (gen_random_uuid(), '${COMP_A_ID}', 'Test Key A', '${keyHash}', '["api:read"]', true, NOW());
  `;
  
  fs.writeFileSync('insert_key.sql', sql);
  
  execSync(`cat insert_key.sql | docker exec -i parilink-postgres-1 psql -U parilink -d parilink_db`);
  console.log(`\nCreated API key for Company A: ${rawToken}`);

  // 2. Query loads using API key
  try {
    const res = await axios.get(`${BASE}/gateway/v1/loads`, {
      headers: { Authorization: `Bearer ${rawToken}` }
    });
    console.log('\n--- Company A Gateway Load Read ---');
    console.log(`HTTP Status: ${res.status}`);
    const data = res.data.data || res.data;
    
    let onlyCompanyA = true;
    for (const item of data) {
      if (item.companyId !== COMP_A_ID) {
        onlyCompanyA = false;
        console.log(`🚨 Found record belonging to Company B! ID: ${item.id}, Company: ${item.companyId}`);
      }
    }
    
    if (onlyCompanyA) {
      console.log('✅ Success: Returned ONLY Company A data.');
    }
    
    console.log(`Response snippet: ${JSON.stringify(data).slice(0, 300)}...`);
    
  } catch (e) {
    console.log('\nError:', e.response?.status, e.response?.data);
  }
}

main();
