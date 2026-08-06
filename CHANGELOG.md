# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-30

### Added
- Multi-tenant enterprise architecture with strict data isolation.
- Authentication module with JWT SSO, Role-Based Access Control, and rate limiting.
- Fleet Management module for Vehicles, Drivers, and Maintenance intervals.
- Logistics module including advanced Load generation and cross-docking rules.
- Real-time Dispatch and Trip assignment.
- Automated API integrations (Developer Platform) and API key management.
- Webhooks dispatching system with idempotency and retry mechanics.
- AI Agent dispatch functionality to automate scheduling and assignment workflows.
- Analytics and Business Intelligence data warehouse export integrations.
- Comprehensive background workers for async processing (BullMQ/Redis).
- Live Operations health checks, system metrics monitoring, and alert engine.

### Changed
- Increased API gateway memory thresholds from `150MB` to `500MB` to handle hydration scaling without premature Kubernetes Readiness Probe failures.
- Transitioned internal caching layer from in-memory arrays to persistent Redis clusters.

### Fixed
- Fixed recursive soft-delete dependencies in Prisma cascading logic.
- Resolved cache-poisoning vulnerability by enforcing Idempotency Keys globally.
- Remedied deadlock within Warehouse Outbound Service `Promise.all` logic by using sequential transaction batches.
- Re-architected SSE notification retry loops to prevent storm reconnect cascades in frontend.
