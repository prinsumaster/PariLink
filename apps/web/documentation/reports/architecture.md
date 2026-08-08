# Story 2.10 — Reports, Dashboards & Business Intelligence

## Architecture Overview

The Reports & BI module provides high-level executive summaries of PariLink's logistics network, aggregating data across Fleet Management, Finance, and Operations.

### Key Technologies

- **Charting Engine:** `recharts` is used to build responsive, interactive SVGs (AreaChart for Revenue, Stacked BarChart for Fleet Utilization). It provides rich tooltips and legend capabilities out-of-the-box.
- **State Management:** `@tanstack/react-query` handles the dashboard metrics fetching. A global `timeframe` filter (e.g., 7d, 30d, YTD) invalidates the query and refetches the aggregated dataset.

### Core Components

1. **`ReportsPage`**: The master container. It hosts the global timeframe dropdown and handles the mock PDF/CSV export functionality.
2. **`ReportsDashboard`**: The layout grid orchestrator. It fetches `getDashboardMetrics` once and distributes the data to its child visualizations.
3. **`KPICards`**: A dynamic top-row component that iterates over an array of metrics, formatting currency and percentages, and rendering trend arrows (green up, red down) based on percentage change.
4. **`RevenueChart` & `FleetUtilizationChart`**: Pure presentational components wrapping `recharts`. They handle their own skeleton/pulse loading states if `isLoading` is true.

### RBAC Enforcement

`<RoleGuard>` isolates BI data:
- **Access (`/reports`):** Granted to `SUPER_ADMIN`, `ORG_ADMIN`, `FINANCE`, `OPERATIONS`, and `SALES`. 
- **Restricted:** Standard Drivers and Viewers do not have access to aggregate revenue data or platform-wide KPI dashboards.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend consumes a unified `/reports/dashboard` endpoint to populate all visuals simultaneously.
