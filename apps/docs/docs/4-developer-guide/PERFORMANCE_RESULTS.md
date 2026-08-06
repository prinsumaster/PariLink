# PariLink Performance Results

## Executive Summary
This document outlines the performance benchmarks for the PariLink backend based on k6 load testing scripts located in `performance/k6`. 

## Test Execution Details
- **Status:** ⚠️ BLOCKED
- **Reason:** Load testing scripts require a running, populated instance of the PariLink API. The current staging environment is offline due to the absence of the Docker engine, preventing the PostgreSQL database and Redis cache from provisioning.
- **Evidence:** `docker compose up -d` failed with `no such file or directory` at `docker.sock`.

## Measured Values (Pending)
The following metrics are required for EUAT sign-off but cannot be measured or estimated at this time per strict reporting rules:

- **Average Response Time:** Not Measured
- **P95 Response Time:** Not Measured
- **P99 Response Time:** Not Measured
- **Throughput (RPS):** Not Measured
- **Error Rate:** Not Measured
- **CPU Utilization:** Not Measured
- **Memory Utilization:** Not Measured
- **Database Connections:** Not Measured

*Note: No values have been invented or estimated. Benchmarks will be updated once the infrastructure is available.*
