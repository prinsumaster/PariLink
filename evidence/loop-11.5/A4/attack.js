const { compA, compB, usersA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  // Attack: Try to get Company B details
  const getReq = await fetch(`http://localhost:8080/api/v1/companies/${compB}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("GET COMPANY B:", await getReq.status, await getReq.text());
}
attack();
