# PariLink 2.0 — Go-Live Checklist

**Target Launch:** Before Janmashtami  
**Status:** PENDING DEPLOYMENT

---

## 1. Infrastructure Preparation (DevOps/SRE)
- [ ] Provision Production Database (PostgreSQL 15+)
- [ ] Provision Production Redis Cluster
- [ ] Configure Object Storage (S3/MinIO) buckets
- [ ] Set up CDN for static assets
- [ ] Configure Domain Names & SSL Certificates
- [ ] Set up Load Balancers & WAF

## 2. Application Deployment
- [ ] Deploy Backend API (NestJS)
- [ ] Run Database Migrations (`npx prisma migrate deploy`)
- [ ] Seed base data (Super Admin account, Subscription Plans, Roles)
- [ ] Deploy Frontend Web App (Next.js)
- [ ] Verify API connectivity from Web App

## 3. Security & Access
- [ ] Rotate all production secrets and API keys
- [ ] Restrict database access to application servers only
- [ ] Verify Super Admin access works
- [ ] Enable WAF rules and Rate Limiting at the edge

## 4. Third-Party Integrations
- [ ] Verify Stripe production webhooks
- [ ] Verify SMS gateway (Twilio/Msg91) production keys
- [ ] Verify Email (SendGrid/AWS SES) production keys
- [ ] Verify GPS Provider (Intangles/LocoNav) production webhooks
- [ ] Verify FASTag API production keys

## 5. Observability
- [ ] Verify logs are flowing to centralized logging (ELK/Datadog)
- [ ] Verify error tracking (Sentry) is active
- [ ] Set up PagerDuty/OpsGenie alerts for critical failures
- [ ] Configure uptime monitoring (Pingdom/UptimeRobot)

## 6. Final Smoke Test (in Production)
- [ ] Register a test tenant
- [ ] Complete 10-step onboarding flow
- [ ] Create 1 vehicle, 1 driver, 1 trip
- [ ] Verify email delivery
- [ ] Suspend test tenant

## 7. Launch
- [ ] Flip DNS switch
- [ ] Notify Sales & Customer Success
- [ ] Monitor logs closely for first 24 hours
