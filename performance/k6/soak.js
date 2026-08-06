import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "5s", target: 5 },  // ramp up to 50 users
    { duration: "5s", target: 5 },  // stay at 50 users for 4 HOURS
    { duration: "5s", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1000'],
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
    
    // Typical slow background polling
    http.get(`${BASE_URL}/loads`, params);
    http.get(`${BASE_URL}/trips`, params);
  }

  sleep(5); // Soak test has long sleep to simulate sustained, steady traffic without overwhelming CPU instantly
}
