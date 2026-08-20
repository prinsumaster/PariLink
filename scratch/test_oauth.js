fetch('http://localhost:8080/api/v1/iam/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: 'test_client',
    client_secret: 'admin_secret'
  })
}).then(r => r.json()).then(console.log).catch(console.error);
