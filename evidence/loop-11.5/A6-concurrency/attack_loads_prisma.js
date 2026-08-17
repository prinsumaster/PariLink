const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const axios = require('axios');
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

  const trip1Res = await client.post(`${API_URL}/trips`, {
    tripNumber: `TRP-T1-${Date.now()}`,
    status: 'PLANNED',
    startDate: new Date().toISOString()
  });
  const trip2Res = await client.post(`${API_URL}/trips`, {
    tripNumber: `TRP-T2-${Date.now()}`,
    status: 'PLANNED',
    startDate: new Date().toISOString()
  });
  const trip1Id = trip1Res.data.id;
  const trip2Id = trip2Res.data.id;

  // Insert load directly via Prisma
  const load = await prisma.load.create({
    data: {
      companyId: companyAId,
      referenceNumber: `LOD-RACE-${Date.now()}`,
      customerId: compA.entities.customerId,
      origin: 'New York',
      destination: 'Boston',
      weight: 1000,
      volume: 50,
      pickupDate: new Date(),
      deliveryDate: new Date(),
      status: 'PENDING'
    }
  });
  const loadId = load.id;
  
  console.log(`=== ATTACK A6: Double Load Assignment ===`);
  console.log(`Trip 1 ID: ${trip1Id}`);
  console.log(`Trip 2 ID: ${trip2Id}`);
  console.log(`Load ID: ${loadId}`);

  // 3. Concurrently assign the load to BOTH trips
  const p1 = client.post(`${API_URL}/trips/${trip1Id}/loads`, { loadIds: [loadId] });
  const p2 = client.post(`${API_URL}/trips/${trip2Id}/loads`, { loadIds: [loadId] });

  const [res1, res2] = await Promise.all([p1, p2]);
  
  console.log(`Req 1 Status: ${res1.status}`);
  if (res1.status !== 201) console.log(JSON.stringify(res1.data));
  console.log(`Req 2 Status: ${res2.status}`);
  if (res2.status !== 201) console.log(JSON.stringify(res2.data));

  const loadCheck = await prisma.load.findUnique({ where: { id: loadId } });
  console.log(`Load is assigned to Trip: ${loadCheck.tripId}`);
  
  const trip1Check = await prisma.trip.findUnique({ where: { id: trip1Id }, include: { loads: true } });
  const trip2Check = await prisma.trip.findUnique({ where: { id: trip2Id }, include: { loads: true } });
  
  console.log(`Trip 1 loads count: ${trip1Check.loads.length}`);
  console.log(`Trip 2 loads count: ${trip2Check.loads.length}`);
  
  if (res1.status === 201 && res2.status === 201) {
    console.log('VULNERABLE: Both requests returned 201!');
  } else {
    console.log('SECURE: Double assignment prevented!');
  }
}

main().finally(() => prisma.$disconnect());
