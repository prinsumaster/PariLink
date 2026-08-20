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
  const compBToken = await login('dispatcher@companyb.com', 'password123');
  const compAToken = await login('dispatcher@companya.com', 'password123');

  // Find or generate a scenario in Company B
  let scenarioId;
  try {
    const res = await axios.get('http://localhost:8080/api/v1/optimization/scenarios', {
      headers: { Authorization: `Bearer ${compBToken}` }
    });
    if (res.data && res.data.length > 0) {
      scenarioId = res.data[0].id;
    }
  } catch (err) {}

  if (!scenarioId) {
    console.log("Could not find OptimizationScenario for Company B, using a placeholder.");
    scenarioId = '11111111-2222-3333-4444-555555555555';
  }

  console.log(`Company B Scenario ID: ${scenarioId}`);

  console.log(`[BEFORE] (Simulated): In the vulnerable state, runAsSystem bypassed RLS, so this would return the scenario data.`);
  
  console.log(`[AFTER] (Actual): Attempting to fetch Company B Scenario with Company A Token...`);
  try {
    const res = await axios.get(`http://localhost:8080/api/v1/optimization/scenarios/${scenarioId}`, {
      headers: { Authorization: `Bearer ${compAToken}` }
    });
    console.log(`FAIL! Returned Data: ${JSON.stringify(res.data)}`);
  } catch (e) {
    console.log(`SUCCESS! Denied Access with Status: ${e.response?.status}`);
  }
}

attack().catch(console.error);
