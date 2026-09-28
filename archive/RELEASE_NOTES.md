# Release Notes - PariLink v1.0.0 (General Availability)

**Date**: 2026-07-29

We are proud to announce the general availability of PariLink v1.0.0, the comprehensive enterprise transportation management platform.

## Key Features
* **Web Admin Console**: Full suite for operations, dispatchers, fleet owners, and enterprise administrators.
* **Driver Mobile Application**: Offline-first mobile platform with integrated GPS tracking, OCR document scanning, and real-time trip management.
* **Intelligent Backend Engine**: High-performance NestJS backend with real-time WebSocket telematics, brute-force protection, and integration bridges (SAP, Oracle, Tally).
* **Enterprise Security**: Role-based access control, strict SSO constraints, zero-fallback JWT validation, and comprehensive audit logs.

## Migration Notes
* From RC2 to v1.0.0, the `JWT_SECRET` environment variable is now strictly enforced. Applications will fail to boot if this is missing.
* The `directUrl` is no longer supported in the Prisma configuration; ensure your environment uses a direct connection to the primary database via `DATABASE_URL`.

## Known Issues
* **Mobile TypeScript Checks**: The mobile application relies on React Native 0.75.4. A known compatibility issue with TypeScript 5.6.3 and React 18 types results in `TS2786` (`ReactNode` bigint incompatibility) during strict type-checks. This does not affect the compiled application or runtime behavior.
* **Redis Dependency Warning**: If `REDIS_URL` is omitted, the Brute Force Protection service will fall back to in-memory mode, which is not suitable for horizontally scaled multi-node clusters.

## Support Matrix
| Component | Supported Versions |
| --- | --- |
| Node.js | v20+ |
| React Native | 0.75.x |
| iOS | 15.0+ |
| Android | API 28+ |
| Database | PostgreSQL 16+ |
