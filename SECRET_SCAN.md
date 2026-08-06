# Secret Scan Report

## Scanned Scope
Entire repository, excluding `node_modules` and `.git`.

## Findings

1. **Leaked Database Credentials**
   - **File**: `made by other devlopre /parilink/parilink/.env`
   - **Content**: `DATABASE_URL=postgresql://parilink_admin:parilink2026@localhost:5432/parilink_db`
   - **Risk**: CRITICAL

2. **Hardcoded Test Passwords**
   - **Files**: Multiple Playwright E2E tests (`tests/auth.spec.ts`, `tests/final_audit.spec.ts`, etc.) and database seed (`apps/api/prisma/seed.ts`).
   - **Content**: `password123`
   - **Risk**: LOW (Test Data)

3. **Hardcoded Webhook Secret**
   - **File**: `apps/api/src/integration/webhook/webhook-platform.service.ts`
   - **Content**: `const secret = 'whsec_replay_secret';`
   - **Risk**: HIGH (Cryptographic key hardcoded in source)

4. **Example / Placeholder Secrets**
   - **Files**: `.env.example`, `.env` (in root)
   - **Content**: `JWT_SECRET`, `COOKIE_SECRET`, `MASTER_ENCRYPTION_KEY_V1`
   - **Risk**: LOW (Placeholders / Local dev, but ensure these aren't deployed to production).
