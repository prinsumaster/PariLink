# PariLink Deployment Checklist

## Pre-Deployment Verification

### Codebase Integrity
- [x] Frontend Build Passes (`next build`)
- [x] Backend Build Passes (`nest build`)
- [x] No TypeScript Errors (`tsc --noEmit`)

### Environment & Secrets
- [ ] Production Environment Variables Configured
- [ ] Database Connection Strings Secured
- [ ] JWT Secrets Configured
- [ ] Third-party API Keys Configured (Stripe, Mapbox, etc.)

### Infrastructure
- [ ] PostgreSQL Database Provisioned & Accessible
- [ ] Redis Cluster Provisioned & Accessible
- [ ] Docker Images Built and Pushed to Registry

### Runtime Configuration
- [ ] Prisma Migrations applied successfully to target DB
- [ ] Initial Roles/Permissions seeded
- [ ] SSL/TLS Certificates active

### Monitoring
- [ ] Health Check endpoint (`/health`) returning 200 OK
- [ ] APM / Metrics tracking active
- [ ] Error tracking (Sentry/Crashlytics) active
- [ ] Log aggregation active
