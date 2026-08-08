# Story 2.12 — Communication & Notifications

## Architecture Overview

The Notifications module provides a unified inbox and preferences engine for users to manage system alerts, operational warnings, and financial updates.

### Key Technologies

- **Polling Engine:** `@tanstack/react-query` is configured with `refetchInterval: 60000` to automatically poll for new notifications in the background, keeping the user's inbox synchronized across tabs.
- **Form State:** `react-hook-form` is integrated with standard `shadcn/ui` Switch components via the `<Controller />` wrapper to ensure fluid, accessible toggle controls for user preferences.

### Core Components

1. **`NotificationCenter`**: The primary inbox list. It groups incoming alerts, parses their `channels` (rendering appropriate icons for Email, SMS, WhatsApp), and maps `severity` (Critical, Warning, Success, Info) to strict visual color codes. Users can mark individual items as read, or bulk clear the inbox.
2. **`NotificationPreferences`**: A form dividing configuration into two vectors:
   - **Delivery Channels:** Boolean toggles authorizing Email, SMS, Push, or WhatsApp delivery.
   - **Notification Events:** Granular subscription toggles (e.g., opting into Billing alerts but opting out of Shipment Delays).

### RBAC Enforcement

`<RoleGuard>` provides universal access:
- **Access (`/notifications`, `/notifications/preferences`):** Available to all authenticated tenant users (Admins, Operations, Finance, Sales, Dispatchers, Viewers). The backend API determines which specific notifications are delivered based on their role and organization ID.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the existing endpoints to fetch paginated notification feeds and update user preferences.
