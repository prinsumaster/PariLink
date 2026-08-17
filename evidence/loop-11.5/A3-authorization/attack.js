const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
  const compA = fixtures.companies[companyAId];
  
  // Login as Company A DRIVER (lowest privilege)
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: compA.users.DRIVER.email,
    password: 'password123'
  });
  
  const token = loginRes.data.access_token;
  const client = axios.create({
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });
  
  console.log("=== ATTACK A3: RBAC Bypass ===");
  const res = await client.get(`${API_URL}/invoices`);
  console.log(`GET /invoices -> Status: ${res.status}`);
  console.log(JSON.stringify(res.data, null, 2));
}

main().catch(console.error);
