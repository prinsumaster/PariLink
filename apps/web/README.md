# Story 2.1 — Next.js Application Shell & Authentication

## Architecture Overview

The PariLink frontend application shell is built on **Next.js 15 (App Router)** and **React 19**. It provides a robust, enterprise-grade foundation for all future modules (Dashboard, Dispatch, Live Map).

### Authentication Strategy

- **State Management:** Handled by `Zustand` with persistent storage (localStorage) for UI-level data (`user`, `tenant`, `roles`).
- **Security:** The actual JWT is stored in an `HttpOnly` cookie managed by the backend, ensuring immunity against XSS attacks. The middleware intercepts routes and validates the presence of the session cookie.
- **Refresh Flow:** Handled via an Axios response interceptor that detects `401 Unauthorized` and transparently calls `/auth/refresh`.
- **MFA:** Supported via `useMfa` hook integration. If the login endpoint returns `requires_mfa`, the UI transitions to an OTP input screen.
- **SSO:** SAML and OAuth hooks/buttons are integrated and redirect to backend API endpoints for federation.

### Multi-Tenancy

- Managed via the `WorkspaceSelector` in the sidebar.
- Tenant context is injected into API requests via the `X-Tenant-ID` header using an Axios request interceptor.

### RBAC (Role-Based Access Control)

- **Middleware Level:** Enforces basic authentication checks.
- **Component Level:** Enforced using the `<RoleGuard>` High-Order Component.
  - Allows declarative checking of `allowedRoles` (e.g. `['SUPER_ADMIN']`).
  - Allows declarative checking of `requiredPermissions` (e.g. `['write:dispatch']`).
  - Automatically falls back to a 403 Forbidden screen if requirements are not met.

### Error Handling

- **Next.js Boundaries:** Customized `not-found.tsx` (404) and `unauthorized.tsx` (401).
- **React Error Boundary:** `<GlobalErrorFallback>` wraps the entire application shell in `providers.tsx` to gracefully catch and display runtime rendering crashes.

## Development

```bash
cd apps/web
npm ci
npm run dev
```

## Testing

```bash
npm run typecheck
npm run lint
npm test
```
