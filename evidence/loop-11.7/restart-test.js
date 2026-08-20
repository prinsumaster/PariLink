const axios = require('axios');

const BASE = 'http://localhost:8080/api/v1';

async function main() {
  console.log('=== Restart Resiliency Test ===\n');

  try {
    console.log('1. Attempting login as admin@companya.com...');
    const resLogin = await axios.post(`${BASE}/auth/login`, {
      email: 'admin@companya.com',
      password: 'password123'
    });
    
    if (resLogin.status === 200 && resLogin.data.access_token) {
      console.log('✅ Login successful. Token received.');
    } else {
      console.log(`🚨 Login failed: ${resLogin.status}`);
      return;
    }

    const token = resLogin.data.access_token;

    console.log('\n2. Attempting to fetch dashboard data...');
    const resDash = await axios.get(`${BASE}/reports/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (resDash.status === 200) {
      console.log(`✅ Dashboard data fetched successfully (HTTP 200).`);
      console.log(`Payload: ${JSON.stringify(resDash.data)}`);
    } else {
      console.log(`🚨 Dashboard fetch failed: ${resDash.status}`);
    }
  } catch (e) {
    console.log(`🚨 Error during test: HTTP ${e.response?.status} - ${JSON.stringify(e.response?.data || e.message)}`);
  }
}

main().catch(console.error);
