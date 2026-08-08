# Story 2.6 — Orders & Shipment Management

## Architecture Overview

The Orders & Shipment Management module serves as the primary revenue and operational entry point for PariLink. It handles customer freight requests, cargo manifesting, and route planning.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` manages the complex list of orders, displaying high-level route summaries (Origin &rarr; Destination) and financial statuses.
- **Forms:** `react-hook-form` and `useFieldArray` combined with `zod` provide dynamic manifesting capabilities, allowing users to add/remove multiple freight items (`OrderItem`) dynamically.
- **State Management:** `@tanstack/react-query` ensures that when an order is updated (e.g. from PENDING to READY_FOR_PICKUP), the cache is invalidated and the list reflects the new state instantly.

### Core Components

1. **`OrderTable` & `OrderFilters`**: Displays the master list of all shipments. The filters component uses dual-selects for both `OrderStatus` and `PaymentStatus`, alongside a global text search.
2. **`OrderForm`**: A massive data-entry grid. It is divided into logical chunks: Customer Details, Pickup Origin, Delivery Destination, and a dynamic Freight Items array. It auto-calculates total weight and value prior to payload submission.
3. **`OrderDetailView`**: A 3-column layout that aggregates the route overview, the detailed item manifest (rendered as a native HTML table for performance), and customer/financial summaries.

### RBAC Enforcement

`<RoleGuard>` manages access:
- **Creation (`/orders/new`):** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, `DISPATCHER`, and `OPERATIONS`.
- **Editing (`/orders/[id]/edit`):** Restricted further to `SUPER_ADMIN`, `ORG_ADMIN`, and `DISPATCHER`.
- **Viewing (`/orders`):** Open to all internal roles.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
