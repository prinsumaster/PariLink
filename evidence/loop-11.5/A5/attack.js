const { compA, compB, usersA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.DRIVER.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  // Attack: Try to create a driver as a DRIVER
  const postReq = await fetch(`http://localhost:8080/api/v1/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      firstName: "Hacked2",
      lastName: "Driver2",
      email: "hacked2@companya.com",
      phone: "0987654321",
      licenseNumber: "HACKED456",
      licenseState: "NY"
    })
  });
  console.log("CREATE DRIVER AS DRIVER:", await postReq.status, await postReq.text());
}
attack();
