# Story 2.5 — Driver Management Module

## Architecture Overview

The Driver Management module handles the personnel of the logistics network. It serves as an HR, Compliance, and Operations dashboard, linking physical drivers to their compliance documents and telemetry-derived safety scores.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` is implemented for `DriverTable`. It features server-side pagination and dynamic visual rendering of the Driver Safety Score.
- **Forms:** `react-hook-form` paired with `zod` handles complex personnel registration including nested structures (e.g., `emergencyContact`).
- **State Management:** `@tanstack/react-query` is utilized for caching driver profiles, ensuring updates in the form invalidate the cache and immediately reflect on the detail page.

### Core Components

1. **`DriverTable` & `DriverFilters`**: Displays paginated personnel lists. Filters allow for rapid status isolation (e.g. finding who is `AVAILABLE` or `ON_LEAVE`).
2. **`DriverSafetyAnalytics`**: A read-only component rendering ALIP/IoT telemetry (Harsh Braking, Speeding, Fatigue) to calculate and visualize a risk profile.
3. **`DriverCompliance`**: Lists critical driver credentials (CDL, Medical Certs) with clear UI badges for expiring and expired documents.
4. **`DriverDetailView`**: Aggregates personal information, current asset assignments (Trip/Vehicle), Safety Analytics, and Compliance into a single pane of glass.

### RBAC Enforcement

`<RoleGuard>` provides strict access controls over personnel data:
- **Creation & Editing (`/drivers/new`, `/drivers/[id]/edit`):** Restricted to `SUPER_ADMIN`, `ORG_ADMIN`, `HR`, and `FLEET_MANAGER`.
- **Viewing (`/drivers`):** Open to Operations and Dispatchers who need to assign drivers to trips, but cannot modify their core HR profiles.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The module simply interacts with existing REST endpoints to retrieve complex nested data structures (like `SafetyAnalytics`).
