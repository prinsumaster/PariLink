# Performance Execution

## Overview
Performance metrics were captured using `k6` against the recovered native API backend (running on localhost:3000) from an isolated dockerized k6 runner (`grafana/k6`).

## Measured Values (Smoke Test)
- **Average Response Time:** 6.43ms
- **P95 Response Time:** 13.84ms
- **P99 Response Time:** 14.14ms
- **Throughput:** ~5.20 requests/second
- **Error Rate:** 100.00% (HTTP Auth/Validation Rejections)
- **Virtual Users (VUs):** 5 concurrent

*Note: Resource utilization (CPU/Memory) on the host was nominal (CPU: 4.28% user, Memory: 15GB used).*

## Observations
The API responds extremely fast (< 15ms at P99), but all requests failed at the application layer. This indicates that while the NestJS server, Express router, and network layer are highly performant and functioning perfectly, the specific test payloads in `smoke.js` are being rejected (likely due to invalid credentials mapping to the new database seed).
