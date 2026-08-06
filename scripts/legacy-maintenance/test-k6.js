import http from 'k6/http';
import { check } from 'k6';
import { expectedStatuses } from 'k6/http';

export const options = { vus: 1, duration: '1s', thresholds: { http_req_failed: ['rate<0.01'] } };

export default function () {
  const res = http.get('http://httpbin.org/status/200', {
    responseCallback: expectedStatuses(200, 404)
  });
  check(res, { 'status is 200': (r) => r.status === 200 });
}
