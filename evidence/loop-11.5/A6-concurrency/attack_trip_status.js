const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:8080/api/v1';

async function main() {
  const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures.json'), 'utf8'));
  const companyAId = Object.keys(fixtures.companies).find(id => fixtures.companies[id].code === 'A');
  const compA = fixtures.companies[companyAId];
  
  const loginRes = await axios.post(`${API_URL}/auth/login`, {
    email: compA.users.ADMIN.email,
    password: 'password123'
  });
  
  const token = loginRes.data.access_token;
  const client = axios.create({
    headers: { Authorization: `Bearer ${token}` },
    validateStatus: () => true
  });

  const tripRes = await client.post(`${API_URL}/trips`, {
    tripNumber: `TRP-STATUS-${Date.now()}`,
    status: 'PLANNED',
    startDate: new Date().toISOString()
  });
  const tripId = tripRes.data.id;

  console.log(`=== ATTACK A6: Concurrent Trip Transitions ===`);
  console.log(`Trip ID: ${tripId}`);

  // Concurrently transition to CANCELLED and DISPATCHED
  const p1 = client.patch(`${API_URL}/trips/${tripId}`, { status: 'CANCELLED' });
  const p2 = client.patch(`${API_URL}/trips/${tripId}`, { status: 'DISPATCHED' });

  const [res1, res2] = await Promise.all([p1, p2]);
  
  console.log(`Req 1 Status: ${res1.status}`);
  if (res1.status !== 200) console.log(JSON.stringify(res1.data));
  console.log(`Req 2 Status: ${res2.status}`);
  if (res2.status !== 200) console.log(JSON.stringify(res2.data));

  const tripCheck = await client.get(`${API_URL}/trips/${tripId}`);
  console.log(`Final Trip Status: ${tripCheck.data.status}`);
}

main().catch(console.error);
