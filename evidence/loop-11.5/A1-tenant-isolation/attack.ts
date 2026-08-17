import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_URL = 'http://localhost:3000/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A')!;
  const companyBId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'B')!;
  
  const compB = fixtures.companies[companyBId];
  const compA = fixtures.companies[companyAId];
  
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: compB.users.ADMIN.email,
    password: 'password123'
  });
  
  const token = loginRes.data.accessToken;
  const client = axios.create({
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });
  
  console.log("=== ATTACK 1: Cross-Tenant GET Customer ===");
  const res1 = await client.get(`${API_URL}/customers/${compA.entities.customerId}`);
  console.log(`GET /customers/${compA.entities.customerId} -> Status: ${res1.status}`);
  console.log(JSON.stringify(res1.data, null, 2));

  console.log("\n=== ATTACK 2: Cross-Tenant UPDATE Customer ===");
  const res2 = await client.patch(`${API_URL}/customers/${compA.entities.customerId}`, {
    name: 'Hacked by Company B'
  });
  console.log(`PATCH /customers/${compA.entities.customerId} -> Status: ${res2.status}`);
  console.log(JSON.stringify(res2.data, null, 2));
  
  console.log("\n=== ATTACK 3: Cross-Tenant GET Load ===");
  const res3 = await client.get(`${API_URL}/loads/${compA.entities.loadId}`);
  console.log(`GET /loads/${compA.entities.loadId} -> Status: ${res3.status}`);
  console.log(JSON.stringify(res3.data, null, 2));
}

main().catch(console.error);
