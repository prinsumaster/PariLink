# Story 2.3 — Trip Management Module

## Architecture Overview

The Trip Management module provides complete CRUD functionality and real-time visualization for logistics trips. 

### Key Technologies & Libraries

- **Data Grid:** `@tanstack/react-table` is used for the main Trips List. It is configured for **manual pagination** (server-side) to handle large datasets efficiently.
- **Forms:** `react-hook-form` paired with `zod` validation is used in the `TripForm` component. This handles both Trip Creation and Trip Editing via the `isEdit` boolean flag and `initialData` injection.
- **Maps:** The `TripMap` component uses `react-map-gl/maplibre` (dynamically imported with `ssr: false`). It draws a GeoJSON LineString (polyline) between the Origin and Destination markers.
- **Real-Time Data:** While the specific WebSocket hook is attached at the Dashboard level for overall fleet health, Trip updates trigger React Query cache invalidations (`queryClient.invalidateQueries`) after successful mutations (e.g. creating/editing a trip) ensuring the table data is instantly fresh.

### RBAC Enforcement

The `<RoleGuard>` component heavily protects this module:
- **Creation (`/trips/new`):** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, `DISPATCHER`, `OPERATIONS`.
- **Editing (`/trips/[id]/edit`):** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, `DISPATCHER`.
- **Viewing (`/trips` & `/trips/[id]`):** Available to all roles including `VIEWER`.

### Component Structure

1. **`TripTable`**: Renders the tabular data.
2. **`TripFilters`**: Manages the global state for the page, passing search terms and status arrays up to the parent page state, which triggers a refetch via React Query.
3. **`TripDetailView`**: A split-pane component. Left pane shows details and a map. Right pane shows SLAs and the chronological timeline.
4. **`TripForm`**: A comprehensive Zod-validated form with multi-section layout for Origin, Destination, and Scheduling details.

## Development Constraints Respected
- No backend API modifications were made. The service layer (`src/services/trips.ts`) assumes standard REST endpoints (`GET /trips`, `POST /trips`, `PUT /trips/:id`).
- All existing shell layouts (Sidebar, Header, Next.js Root Layout) remain perfectly intact.
