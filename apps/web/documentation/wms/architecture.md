# Story 2.8 — Warehouse & Inventory Management (WMS)

## Architecture Overview

The WMS module governs the physical real estate and storage capacity of the PariLink logistics network. It tracks facilities (Distribution Centers, Cold Storage), their operating status, and fine-grained storage zones.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` displays the warehouse network, using custom cell renderers for visually tracking pallet utilization percentages via progress bars.
- **Forms:** `react-hook-form` and `zod` manage facility creation. A nested `capacity` object tracks square footage, while a dynamic `useFieldArray` is used to configure `zones` (e.g., Rack, Floor, Hazmat).
- **State Management:** `@tanstack/react-query` ensures mutations to capacity (e.g., adding a new zone) immediately recalculate utilization metrics on the master list.

### Core Components

1. **`WarehouseTable` & `WarehouseFilters`**: Presents the network overview. The table uses visual progress bars to instantly communicate if a facility is nearing capacity (green &rarr; orange &rarr; red).
2. **`WarehouseForm`**: Divided into Identity, Location, Management/Capacity, and Zones. It automatically initializes capacity constraints and calculates available pallets based on existing load versus new bounds.
3. **`WarehouseDetailView`**: A split dashboard that maps the facility's zones and renders circular and linear progress indicators for total footprint utilization.

### RBAC Enforcement

`<RoleGuard>` provides the necessary isolation:
- **Creation & Editing (`/wms/new`, `/wms/[id]/edit`):** Restricted strictly to `SUPER_ADMIN`, `ORG_ADMIN`, and `OPERATIONS`.
- **Viewing (`/wms`):** Available to Dispatchers and Viewers who must select origin/destination facilities for routing, but they cannot manipulate capacity limits.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
