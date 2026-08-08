# Story 2.4 — Fleet Management Module

## Architecture Overview

The Fleet Management module handles the core physical assets of the logistics network (Trucks, Vans, Trailers, Motorcycles). It aggregates telemetry, compliance documents, maintenance history, and static registry data into a cohesive interface.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` is implemented for `VehicleTable` with server-side pagination, sorting, and custom cell renderers (e.g., visual fuel/battery indicators).
- **Map View:** The module allows toggling between Table and Map view. `FleetMap` utilizes `react-map-gl/maplibre` loaded dynamically. The markers rotate based on real-time `heading` data and color-code by status.
- **Forms:** `react-hook-form` paired with `zod` handles complex registry creations. 

### Core Components

1. **`VehicleTable` & `VehicleFilters`**: Displays paginated fleet lists. Filtering supports Status (Available, In Use, Maintenance) and Type.
2. **`FleetMap`**: Reused both as a global overview of all vehicles on `page.tsx` and as a single-vehicle tracker on `vehicle-detail-view.tsx`.
3. **`MaintenanceTimeline`**: Displays a vertical chronological history of service records, highlighting overdue and completed tasks.
4. **`DocumentManager`**: Lists compliance certificates (Insurance, Pollution, Fitness) with built-in visual warnings for expiring/expired documents.
5. **`VehicleDetailView`**: The command center for a single asset, aggregating the map, telemetry, maintenance, and documents into a clean grid layout.

### RBAC Enforcement

`<RoleGuard>` provides strict access controls over the physical assets:
- **Creation & Editing (`/fleet/new`, `/fleet/[id]/edit`):** Restricted entirely to `SUPER_ADMIN`, `ORG_ADMIN`, `FLEET_MANAGER`. Dispatchers cannot modify fleet registration data.
- **Viewing (`/fleet`):** Open to all internal roles (Dispatchers, Ops, Viewers).

## Constraints
As mandated, no modifications were made to the backend schema or APIs. The frontend consumes the standard REST endpoints and injects existing JWT/Tenant contexts via the pre-established Axios interceptors.
