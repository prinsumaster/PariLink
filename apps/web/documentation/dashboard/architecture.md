# Story 2.2 — Control Tower Dashboard

## Architecture Overview

The Control Tower Dashboard is the flagship frontend module for PariLink Enterprise, designed to provide dispatchers and executives with a high-performance, real-time overview of the logistics network.

### Key Technologies

- **Data Fetching & Caching:** `@tanstack/react-query` is used exclusively for HTTP data fetching. Query keys are aggressively categorized by the global `DashboardFilters` state to ensure data isolation per tenant and region.
- **Real-Time Data (WebSockets):** The `useWebSocket` hook establishes an authenticated persistent connection to the backend. Received payloads (e.g. `VEHICLE_LOCATION_UPDATE`) trigger *optimistic updates* directly into the React Query cache via `queryClient.setQueryData`, bypassing the need for aggressive HTTP polling.
- **Maps:** `react-map-gl/maplibre` is utilized for mapping. It is loaded via Next.js `next/dynamic` with `ssr: false` to prevent hydration mismatches and window undefined errors on the server.
- **Performance:** Complex tables (ShipmentPanel) and lists (AlertCenter) utilize virtualized rendering concepts or paginated caps (backend-enforced). React components use standard Tailwind CSS classes without complex JS-based style calculations.

### Components

1. **KPICards:** Top-level metrics. Displays skeletons while loading.
2. **DashboardFilters:** Propagates `regionId`, `fleetId`, and `dateRange` to all sibling queries.
3. **LiveMap:** Plots `LiveVehicle` arrays with dynamic colored indicators for status and heading rotation.
4. **AlertCenter:** Allows real-time acknowledgement of critical operational alerts via React Query Mutations.
5. **AIPanel:** Reads from the existing ALIP backend endpoints to display autonomous insights.
6. **ShipmentPanel:** Tabular view of active trips and SLA statuses.

## Testing Strategy

- Component-level logic (e.g. `getStatusIcon`) should be verified via unit tests.
- React Query integrations should be mocked at the Axios level for integration testing.
- Playwright E2E tests will run against the staging environment to verify WebSocket connectivity and map rendering.
