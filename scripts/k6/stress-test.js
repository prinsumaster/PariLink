import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // fast ramp-up to a normal load
    { duration: '5m', target: 100 }, // hold steady
    { duration: '2m', target: 0 }, // scale down
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],
    http_req_failed: ['rate<0.01'], // less than 1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default () => {
  const res = http.get(`${BASE_URL}/api/v1/commercial/pricing`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
};
