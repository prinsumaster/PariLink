import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: "5s", target: 10 }, // fast ramp-up to 100 users
    { duration: "5s", target: 10 },  // stay at 100 users
    { duration: "5s", target: 50 }, // sudden spike to 500 users
    { duration: "5s", target: 50 },  // stay at 500 users
    { duration: "5s", target: 10 }, // drop back down
    { duration: "5s", target: 10 },  // recovery phase
    { duration: "5s", target: 0 },   // ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(99)<3000'], // allow up to 3 seconds during spike
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
    
    // Simulate mobile drivers coming back online simultaneously and sending batched GPS ping
    http.post(`${BASE_URL}/tracking/location`, JSON.stringify({
      locations: [
        { tripId: 'trip-1', latitude: 34.0, longitude: -118.0, timestamp: new Date().toISOString() },
        { tripId: 'trip-1', latitude: 34.1, longitude: -118.1, timestamp: new Date().toISOString() }
      ]
    }), {
      headers: { ...params.headers, 'Content-Type': 'application/json' },
    });
  }

  sleep(1);
}
