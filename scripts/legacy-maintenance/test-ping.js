async function test() {
  const login = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  const data = await login.json();
  const token = data.access_token;
  
  const ping = await fetch('http://localhost:3000/api/v1/mobile/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      tripId: '12345678-1234-1234-1234-123456789012',
      latitude: 34.0522,
      longitude: -118.2437,
      speed: 65,
    })
  });
  console.log('Ping status:', ping.status);
  console.log('Ping text:', await ping.text());
}
test();
