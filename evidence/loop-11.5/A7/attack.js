const { compA, compB, usersA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  // Attack: Try to get drivers for Company B by parameter pollution
  const getReq = await fetch(`http://localhost:8080/api/v1/drivers?companyId=${compA}&companyId=${compB}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("PARAMETER POLLUTION:", await getReq.status, await getReq.text());
}
attack();
