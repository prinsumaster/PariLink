const axios = require('axios');
async function run() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@parilink.com',
      password: 'password123'
    });
    const token = loginRes.data.access_token;
    
    // 2. Call generate-from-trips
    const res = await axios.post('http://localhost:8080/api/billing/invoices/generate-from-trips', {
      customerId: 'f6367d26-8974-480d-a9b5-b12ca2437849',
      tripIds: ['fb1ab85d-5113-4d49-b60b-fdc771063f78']
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("SUCCESS:", res.data.id);
  } catch(e) {
    console.error("ERROR:", e.response?.data || e.message);
  }
}
run();
