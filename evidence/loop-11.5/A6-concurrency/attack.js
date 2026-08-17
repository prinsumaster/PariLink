const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
  const compA = fixtures.companies[companyAId];
  
  // Login as Company A ADMIN
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: compA.users.ADMIN.email,
    password: 'password123'
  });
  
  const token = loginRes.data.access_token;
  const client = axios.create({
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });
  
  const driverId = compA.entities.driverId;
  const vehicleId = compA.entities.vehicleId;
  
  console.log(`=== ATTACK A6: Double Dispatch ===`);
  console.log(`Driver ID: ${driverId}`);
  console.log(`Vehicle ID: ${vehicleId}`);

  // Create two trips concurrently using the same driver and vehicle
  const payload1 = {
    tripNumber: `TRP-RACE-1-${Date.now()}`,
    status: 'PLANNED',
    startDate: new Date().toISOString(),
    driverId: driverId,
    vehicleId: vehicleId
  };
  
  const payload2 = {
    tripNumber: `TRP-RACE-2-${Date.now()}`,
    status: 'PLANNED',
    startDate: new Date().toISOString(),
    driverId: driverId,
    vehicleId: vehicleId
  };

  const p1 = client.post(`${API_URL}/trips`, payload1);
  const p2 = client.post(`${API_URL}/trips`, payload2);

  const [res1, res2] = await Promise.all([p1, p2]);
  
  console.log(`Req 1 Status: ${res1.status}`);
  if (res1.status !== 201) console.log(JSON.stringify(res1.data));
  
  console.log(`Req 2 Status: ${res2.status}`);
  if (res2.status !== 201) console.log(JSON.stringify(res2.data));
}

main().catch(console.error);
