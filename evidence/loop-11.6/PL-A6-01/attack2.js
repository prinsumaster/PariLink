const axios = require('axios');
const helper = require('../../loop-11.5/helper.js');
const { execSync } = require('child_process');

async function login(email, password) {
  const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
    email,
    password
  });
  return res.data.access_token;
}

async function attack() {
  const dispatcherToken = await login('dispatcher@companya.com', 'password123');

  const tripId1 = '2e986ec1-72d3-40d1-a16e-9c9b5c0bdce5';
  const tripId2 = '302fa7bc-cd60-4604-8aac-b4952dbcdb62';
  const loadId = helper.entitiesA.loadId;

  console.log(`Using Trip 1: ${tripId1}`);
  console.log(`Using Trip 2: ${tripId2}`);
  console.log(`Using Load: ${loadId}`);

  let successes = 0;
  for (let i = 0; i < 20; i++) {
    // Reset load assignment by setting tripId to null directly in DB to bypass state machine limits for testing
    execSync(`docker exec parilink-postgres-1 psql -U parilink -d parilink_db -c "UPDATE \\"Load\\" SET \\"tripId\\" = NULL, status = 'PENDING' WHERE id = '${loadId}';"`);
    
    const promises = [];
    promises.push(
      axios.post(`http://localhost:8080/api/v1/trips/${tripId1}/loads`, { loadIds: [loadId] }, { headers: { Authorization: `Bearer ${dispatcherToken}` } })
      .then(() => { successes++; console.log(`Run ${i} Trip 1 SUCCESS`); })
      .catch((e) => { console.log(`Run ${i} Trip 1 FAIL: ${e.response?.status}`); })
    );
    promises.push(
      axios.post(`http://localhost:8080/api/v1/trips/${tripId2}/loads`, { loadIds: [loadId] }, { headers: { Authorization: `Bearer ${dispatcherToken}` } })
      .then(() => { successes++; console.log(`Run ${i} Trip 2 SUCCESS`); })
      .catch((e) => { console.log(`Run ${i} Trip 2 FAIL: ${e.response?.status}`); })
    );
    await Promise.all(promises);
  }

  console.log(`Total Successes (out of 40): ${successes}`);
  if (successes > 20) {
    console.log("RACE CONDITION CONFIRMED: More successes than iterations (Double Assignment).");
  } else {
    console.log("RACE CONDITION NOT REPRODUCED OR ALREADY FIXED.");
  }
}

attack().catch(console.error);
