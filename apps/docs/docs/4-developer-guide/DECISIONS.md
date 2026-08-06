# Decisions Log (ADR)

## 2026-07-17: RLS Connection Pooling
**Context:** PEMS requires PostgreSQL RLS for multi-tenant isolation. Prisma connection pooling makes it dangerous to use `set_config` on connections without interactive transactions.
**Decision:** We will use Prisma Interactive Transactions (`$transaction`) wrapping `set_config('app.current_company_id')` for operations requiring RLS.
**Alternative:** Application-level `$extends` filtering. Rejected due to PEMS strict requirement for DB-level enforcement.

## 2026-07-17: Trailers as Vehicles
**Context:** Phase 2 specifies Trailers as a separate module, but the Domain Model maps them to `Vehicle` with `type=TRAILER`.
**Decision:** Scaffolded a separate REST API for Trailers (`/api/v1/trailers`) that proxies to the `Vehicle` table under the hood, ensuring separation of concerns on the API layer without redesigning the DB schema.

## 2026-07-17: Missing Vendor Model
**Context:** Phase 2 specifies Vendors, but no `Vendor` model existed in `schema.prisma`.
**Decision:** Added `Vendor` model to schema and scaffolded the module, maintaining the AEEM directive to continue building logically without blocking on minor omissions.
