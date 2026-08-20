const axios = require('axios');
const { execSync } = require('child_process');
const fs = require('fs');

const BASE = 'http://localhost:8080/api/v1';
const COMP_B_ID = 'bad77312-954c-437b-a34f-2e8d0d9587c5';

const endpoints = [
  { name: 'Load', path: '/loads', id: 'fb4653f2-78f1-4d58-9b56-eb626cac3351', table: '"Load"' },
  { name: 'Customer', path: '/customers', id: '859c099e-04f4-4504-8084-40c45e528830', table: '"Customer"' },
  { name: 'Driver', path: '/fleet/drivers', id: '2b4b133f-2a9f-4d53-a134-b4aa6b657584', table: '"Driver"' },
  { name: 'Vehicle', path: '/fleet/vehicles', id: 'cb68c236-c3f8-4e69-a19f-ccdf81d7e381', table: '"Vehicle"' },
  { name: 'Trip', path: '/trips', id: '2e986ec1-72d3-40d1-a16e-9c9b5c0bdce5', table: '"Trip"' },
  { name: 'Invoice', path: '/invoices', id: '9b5f9acf-d16d-41cc-a4c9-1748dbcd3fc8', table: '"Invoice"' }
];

async function login(email, password) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data.access_token;
}

function getCompanyIdFromDB(table, id) {
  const sql = `SELECT "companyId" FROM ${table} WHERE id = '${id}';`;
  fs.writeFileSync('query.sql', sql);
  return execSync(`cat query.sql | docker exec -i parilink-postgres-1 psql -U parilink -d parilink_db -t`).toString().trim();
}

async function main() {
  console.log('=== A1#5 Record Migration Test ===\n');
  const token = await login('admin@companya.com', 'password123');
  
  for (const ep of endpoints) {
    const beforeDb = getCompanyIdFromDB(ep.table, ep.id);
    console.log(`\n--- Testing ${ep.name} ---`);
    console.log(`[Before] DB companyId: ${beforeDb}`);
    
    try {
      const res = await axios.patch(`${BASE}${ep.path}/${ep.id}`, {
        companyId: COMP_B_ID,
        name: "Test Update"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`PATCH Response: HTTP ${res.status}`);
    } catch (e) {
      console.log(`PATCH Response: HTTP ${e.response?.status} (${e.response?.data?.message || e.message})`);
    }
    
    const afterDb = getCompanyIdFromDB(ep.table, ep.id);
    console.log(`[After ] DB companyId: ${afterDb}`);
    
    if (afterDb === COMP_B_ID) {
      console.log(`🚨 FAIL: ${ep.name} companyId was changed to Company B!`);
    } else if (afterDb === beforeDb) {
      console.log(`✅ PASS: ${ep.name} companyId is unchanged.`);
    } else {
      console.log(`❓ UNKNOWN: companyId changed to ${afterDb}`);
    }
  }
}

main().catch(console.error);
