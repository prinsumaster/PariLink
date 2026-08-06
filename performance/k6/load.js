import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "5s", target: 5 }, // Ramp up to 50 users
    { duration: "5s", target: 5 }, // Stay at 50 users
    { duration: "5s", target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';
const COMPANY_ID = __ENV.COMPANY_ID || '12345678-1234-1234-1234-123456789012';

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@parilink.com',
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('access_token');

  if (token) {
    const params = { headers: { Authorization: `Bearer ${token}` } };
    
    // Simulate typical user flow: Dashboards -> Loads -> Trips
    const endpoints = [
      '/loads',
      '/trips',
      '/vehicles',
      '/drivers',
    ];

    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const listRes = http.get(`${BASE_URL}${randomEndpoint}?limit=50`, params);
    
    check(listRes, {
      'list loaded successfully': (r) => r.status === 200,
    });
  }

  sleep(Math.random() * 3 + 1); // Random think time between 1 and 4 seconds
}
