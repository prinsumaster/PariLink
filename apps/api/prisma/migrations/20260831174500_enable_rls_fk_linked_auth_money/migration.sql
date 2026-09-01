-- RLS for the 7 highest-risk FK-linked tables: they hold tenant data but have
-- no companyId column of their own, so they were left out of every previous
-- RLS migration. Six hold authentication material (refresh tokens, MFA backup
-- codes, WebAuthn credentials, trusted devices, SSO sessions, OAuth tokens)
-- and one holds money (invoice line items).
--
-- Approach: EXISTS against the parent rather than denormalising a companyId
-- column onto 7 tables. No schema change, no backfill of existing rows.
--
-- How this behaves in each context:
--   runAsSystem  -> app.bypass_rls='on', first disjunct is true, the EXISTS
--                   never evaluates. Auth-time lookups (which happen BEFORE
--                   the tenant is known) keep working.
--   runAsTenant  -> app.current_company_id is set; the EXISTS resolves against
--                   the parent, which is itself RLS-filtered to the same
--                   tenant. Correct and self-reinforcing.
--   neither set  -> both disjuncts false, zero rows. Fails closed.
--
-- Verified before writing: every access to these 7 tables goes through
-- runAsSystem or runAsTenant (0 bare prisma calls), and the refresh-token
-- lookup in auth.service.ts (the one path that must work with no tenant
-- context) is inside runAsSystem. This migration does not break login.
--
-- Performance: each EXISTS is a primary-key lookup on the parent
-- (User.id, IdentityProvider.id, OAuthClient.id, Invoice.id), all indexed by
-- definition as PKs. No new index required. RefreshToken, the hottest of
-- these, is read by unique token hash, so the policy costs one PK lookup on
-- the single matched row.
--
-- The other 30 FK-linked tables with no RLS are deliberately deferred.

-- RLS for RefreshToken (via User)
ALTER TABLE "RefreshToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RefreshToken" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "RefreshToken";
CREATE POLICY "tenant_isolation_policy" ON "RefreshToken"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "RefreshToken"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "RefreshToken"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for BackupCode (via User)
ALTER TABLE "BackupCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BackupCode" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "BackupCode";
CREATE POLICY "tenant_isolation_policy" ON "BackupCode"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "BackupCode"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "BackupCode"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for WebAuthnCredential (via User)
ALTER TABLE "WebAuthnCredential" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebAuthnCredential" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "WebAuthnCredential";
CREATE POLICY "tenant_isolation_policy" ON "WebAuthnCredential"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "WebAuthnCredential"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "WebAuthnCredential"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for TrustedDevice (via User)
ALTER TABLE "TrustedDevice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrustedDevice" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "TrustedDevice";
CREATE POLICY "tenant_isolation_policy" ON "TrustedDevice"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "TrustedDevice"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "User" p
    WHERE p."id" = "TrustedDevice"."userId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for SsoSession (via IdentityProvider)
ALTER TABLE "SsoSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SsoSession" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "SsoSession";
CREATE POLICY "tenant_isolation_policy" ON "SsoSession"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IdentityProvider" p
    WHERE p."id" = "SsoSession"."identityProviderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "IdentityProvider" p
    WHERE p."id" = "SsoSession"."identityProviderId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for OAuthToken (via OAuthClient)
ALTER TABLE "OAuthToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OAuthToken" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "OAuthToken";
CREATE POLICY "tenant_isolation_policy" ON "OAuthToken"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "OAuthClient" p
    WHERE p."id" = "OAuthToken"."clientId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "OAuthClient" p
    WHERE p."id" = "OAuthToken"."clientId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);

-- RLS for InvoiceLineItem (via Invoice)
ALTER TABLE "InvoiceLineItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InvoiceLineItem" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "InvoiceLineItem";
CREATE POLICY "tenant_isolation_policy" ON "InvoiceLineItem"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Invoice" p
    WHERE p."id" = "InvoiceLineItem"."invoiceId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR EXISTS (
    SELECT 1 FROM "Invoice" p
    WHERE p."id" = "InvoiceLineItem"."invoiceId"
      AND p."companyId" = current_setting('app.current_company_id', true)
  )
);
