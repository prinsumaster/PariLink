# Story 2.11 — AI Operations Center (ALIP)

## Architecture Overview

The Advanced Logistics Intelligence Protocol (ALIP) Operations Center serves as the nerve center for PariLink's predictive routing and anomaly detection features. 

### Key Technologies

- **Real-Time Simulation:** While the module uses `@tanstack/react-query` to fetch from `/alip/dashboard`, the `refetchInterval: 30000` is utilized to create a near real-time polling mechanism for the dashboard, ensuring anomalies appear as they occur in the backend ALIP engine.
- **Styling:** Tailwind CSS is used extensively to create a "dark mode / command center" aesthetic for the ALIP header, differentiating it visually from standard CRUD modules.

### Core Components

1. **`ALIPDashboard`**: Orchestrates the four top-level system health metrics (Status, Latency, Active Streams, 24h Anomalies). 
2. **`AnomalyLog`**: A specialized list view rendering `ALIPAnomaly` entities. It uses custom badging and color-coding based on severity (CRITICAL, HIGH, MEDIUM, LOW) to prioritize dispatcher attention. It allows users to "Resolve" anomalies directly.
3. **`PredictiveInsights`**: Renders `PredictiveInsight` entities which represent proactive AI recommendations (e.g., "Reroute truck due to incoming storm"). Contains an "Auto-Resolve" CTA that fires an `applyRecommendation` mutation.

### RBAC Enforcement

`<RoleGuard>` isolates ALIP:
- **Access (`/alip`):** Granted to `SUPER_ADMIN`, `ORG_ADMIN`, `OPERATIONS`, and `DISPATCHER`. These are the operational roles that need to act upon ALIP's insights.
- **Restricted:** Sales, Finance, and standard Drivers do not have access to the raw ALIP dashboard.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
