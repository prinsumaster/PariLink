# Known Issues (RC1)

## Frontend (apps/web)
- **ESLint & TypeScript Warnings**: There are several components utilizing `any` types and unused variables. The `@typescript-eslint/no-explicit-any` warnings were intentionally left unfixed to avoid disrupting established component APIs prior to RC1, but are tracked for remediation in V2.
- **Cascading Renders**: A React hook warning (`react-hooks/set-state-in-effect`) exists in `layout.tsx`. Setting state inside `useEffect` during auth checks may cause minor performance degradations during the initial render loop.

## Backend (apps/api)
- **Rate Limiting vs CPU Exhaustion**: Because `bcrypt` hashing is extremely CPU intensive, sending >10 concurrent login requests to a single NestJS pod can temporarily exhaust the Node.js event loop, resulting in a spike in 500/Timeout errors due to Prisma connection exhaustion. The `ThrottlerGuard` protects against massive spikes, but burst mitigation strategies (like Redis-backed queues or horizontal auto-scaling) are recommended for production.

## Telemetry
- **Trace Contexts**: Not all microservice flows correctly forward distributed tracing contexts (W3C Traceparent headers). This limits observability on multi-hop E2E transactions in Datadog/Sentry.
