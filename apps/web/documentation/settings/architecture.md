# Story 2.15 — System Settings

## Architecture Overview

The System Settings module provides the configuration interface for PariLink's platform-wide defaults, security requirements, and third-party integrations.

### Key Technologies

- **Layout Structure:** Implements a nested layout pattern using `SettingsLayout` to render a persistent sidebar navigation across multiple settings routes (`/settings/organization`, `/settings/security`).
- **Forms:** `react-hook-form` is utilized to map deeply nested JSON configuration objects (e.g., `localization.currency`, `passwordPolicy.requireUppercase`) to intuitive UI controls like Select dropdowns and toggle Switches.
- **State Management:** `@tanstack/react-query` ensures mutations (like changing the distance unit) trigger query invalidations so changes ripple across the client state instantly.

### Core Components

1. **`SettingsLayout`**: A responsive sidebar wrapper. On mobile, it stacks vertically; on desktop, it sits alongside the configuration forms. It also cross-links to the previously built `NotificationPreferences` component.
2. **`OrganizationSettings`**: A form handling legal entity details, support contact info, and global localization formatting (timezones, weight/distance units, currency).
3. **`SecuritySettings`**: A form dictating authentication constraints. It features conditional rendering (e.g., exposing the `sso.provider` dropdown only if `sso.enabled` is toggled true).

### RBAC Enforcement

`<RoleGuard>` isolates platform configuration:
- **Strict Access (`/settings/*`):** Modifying system settings is restricted exclusively to `SUPER_ADMIN` and `ORG_ADMIN`. All other roles are completely barred from this module.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
