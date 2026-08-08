# Story 2.9 — Billing, Finance & Invoicing

## Architecture Overview

The Finance module handles accounts receivable, invoicing for logistics services, and payment collections for the PariLink platform.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` displays the invoice ledger, using custom cell renderers to flag overdue balances and format currency according to the invoice's locale.
- **Forms:** `react-hook-form` and `zod` manage invoice generation. It relies heavily on `useFieldArray` to allow users to build out dynamic line items, while `watch` automatically calculates subtotals, tax rates, and grand totals in real-time before submission.
- **State Management:** `@tanstack/react-query` ensures mutations (such as recording a payment to clear a balance) immediately invalidate the ledger cache, reflecting the updated status across the platform.

### Core Components

1. **`InvoiceTable` & `InvoiceFilters`**: Presents the financial overview. The table uses visual badges to denote payment statuses (Paid, Partial, Overdue, Issued).
2. **`InvoiceForm`**: Divided into Header Details, Line Items, and Financial Summary. It computes `subtotal`, `taxTotal`, and `grandTotal` on the fly to prevent mathematical errors in the UI before hitting the API.
3. **`InvoiceDetailView`**: A dense layout that renders a printable-style invoice manifest, while the sidebar tracks outstanding balances and provides a direct CTA for the Finance team to record incoming payments.

### RBAC Enforcement

`<RoleGuard>` isolates financial data:
- **Creation, Editing & Payments (`/finance/new`, `/finance/[id]/edit`):** Restricted strictly to `SUPER_ADMIN`, `ORG_ADMIN`, and `FINANCE`.
- **Viewing (`/finance`):** Read-only access is granted to `SALES` (to verify account standing) and `VIEWER`, but they cannot alter ledger entries or record payments.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
