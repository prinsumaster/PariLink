# SaaS Operations Guide (GA)

## 1. Multi-Tenant Provisioning
- **New Tenants**: Created via the internal Admin portal (`/admin/tenants`). Each tenant is automatically assigned a unique UUID which isolates their data across all tables using PostgreSQL RLS constraints.
- **Tenant Deletion**: Deletions are strictly "soft deletes" by toggling an `isActive` flag. Hard deletes are deferred to a background cron job for compliance reasons.

## 2. Subscription Management
- **Tiers**: PariLink offers `Starter`, `Professional`, and `Enterprise` tiers.
- **Enforcement**: Middleware checks the tenant's `subscriptionTier` on every request. If an endpoint requires `Professional` access (e.g., advanced ledger reporting), the API returns a `403 Forbidden: Upgrade Required`.
- **Usage Limits**: Rate limits and maximum active user counts are tied to the subscription level in the tenant database record.

## 3. Feature Flags
- Feature flags are managed via an external provider (e.g., LaunchDarkly) or database toggles.
- Changes can be rolled out progressively (e.g., to 10% of users) or instantly reverted without requiring a new Kubernetes deployment.

## 4. Maintenance Mode
- If downtime is absolutely necessary (e.g., massive breaking schema migration), set `MAINTENANCE_MODE=true` in the `parilink-config` ConfigMap.
- The API Gateway will instantly start intercepting all traffic and returning a `503 Service Unavailable` with a user-friendly JSON payload.

## 5. API Versioning & Deprecation
- Endpoints are prefixed with `/api/v1`.
- When introducing breaking changes, create a `/api/v2` namespace. Maintain `/api/v1` for exactly 6 months. Include `Deprecation` warning headers on all v1 responses 3 months prior to sunsetting.
