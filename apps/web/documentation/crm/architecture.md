# Story 2.7 — Customer Relationship Management (CRM)

## Architecture Overview

The CRM module manages the B2B customer accounts of the PariLink platform. It tracks financial health (credit limits, arrears), digital presence, and authorized contacts for each shipper/customer.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` is utilized to present a dense matrix of active accounts, rendering both financial health (outstanding balances vs terms) and lifetime value metrics.
- **Forms:** `react-hook-form` coupled with `zod` handles complex nested schemas, such as `billing` terms (Tax ID, Currency, Payment Terms) and dynamic arrays for `contacts`.
- **State Management:** `@tanstack/react-query` ensures that when financial terms or addresses are updated, the global cache invalidates, keeping the CRM list fresh.

### Core Components

1. **`CustomerTable` & `CustomerFilters`**: Displays paginated B2B accounts. Filters are specialized to isolate accounts by `Account Status` (Active, Inactive, Churned) and `Account Type` (Corporate, SME, etc.).
2. **`CustomerForm`**: A comprehensive wizard divided into Account Profile, Billing Address, Financial Terms, and Contact Persons. It leverages `useFieldArray` to allow unlimited authorized contacts.
3. **`CustomerDetailView`**: A split-pane dashboard that aggregates the digital footprint, a grid of authorized contacts, and a high-level summary of financial arrears and lifetime revenue metrics.

### RBAC Enforcement

`<RoleGuard>` provides strict constraints on the commercial data:
- **Creation & Editing (`/customers/new`, `/customers/[id]/edit`):** Highly restricted to `SUPER_ADMIN`, `ORG_ADMIN`, `SALES`, and `FINANCE`.
- **Viewing (`/customers`):** Available to Operations and Dispatchers who need to verify customer addresses or basic contact details, but they cannot alter credit limits or terms.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
