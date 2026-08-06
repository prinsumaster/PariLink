# Runtime Validation

## Components Start Status
- **Backend (API):** ✅ Started locally on port 3000 after Docker build isolation issues were bypassed.
- **Frontend (Web):** ✅ Started locally on port 3001 (`next dev`).
- **PostgreSQL:** ✅ Started via Docker Compose (Port 5433).
- **Redis:** ✅ Started via Docker Compose (Port 6379).
- **Swagger:** ✅ Reachable at `http://localhost:3000/api/docs`.

## Database Schema & Integrity
- Prisma migrations were reset and forcibly synced with the current schema (`npx prisma db push --accept-data-loss`).
- The database was fully seeded with the official demo data (`npx prisma db seed`).

## Blockers Resolved
- **Docker Daemon Offline:** Resolved by activating Docker Desktop on macOS.
- **Monorepo NPM Dependency Crash:** The Dockerized API crashed because `npm ci` failed in isolated context. Resolved by starting the API directly on the host using the existing `node_modules` and overriding the connection strings for Docker integration.
