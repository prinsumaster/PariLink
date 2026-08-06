# PariLink Enterprise 1.0.0 — Release Notes

**Release Date:** 2026-07-30
**Target Environments:** Production, Sandbox
**Docker Tags:** `parilink-api:1.0.0`, `parilink-web:1.0.0`

## Executive Summary
PariLink Enterprise v1.0.0 marks the official commercial release of the logistics and fleet management platform. This platform has been certified via an independent Production Readiness Review and a multi-phase Red Team/Chaos Engineering validation sprint. 

## Key Capabilities Released
1. **Multi-Tenant Foundation**
   - Cryptographically isolated tenant data logic enforced at the database (RLS emulation) and API (JWT-Tenant bridging).
2. **Autonomous Dispatching**
   - AI-driven assignment algorithms to optimize Driver/Vehicle pairing based on Hours of Service, Odometer metrics, and Load profitability.
3. **Enterprise Connectivity**
   - Turnkey REST API integrations, Webhook outbound routing with automatic jitter-retry, and Developer Portal access keys.
4. **Resilient Architecture**
   - Decoupled, worker-driven architecture relying on Redis and BullMQ for durable asynchronous operations (invoicing, document generation, telemetry sync).

## Security & Reliability Updates
- All routes secured with JWT Passport strategies and Role-Based Access Guards.
- Advanced global idempotency filters deployed across all endpoints to prevent replay/cache poisoning.
- Background health schedulers run continuously, executing a deep `Health Pulse` every 60 seconds with self-healing observability.

## Upgrade Instructions
This is a fresh installation for the 1.0.0 baseline. Customers deploying the on-premise package should follow the `MIGRATION_GUIDE.md` for bootstrapping PostgreSQL schema instances. Ensure `MASTER_ENCRYPTION_KEY_V1` is securely generated and injected into the vault before startup.
