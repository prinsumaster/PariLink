# Story 2.14 — Administration & User Management

## Architecture Overview

The Administration module serves as the Identity and Access Management (IAM) interface for managing users, organization boundaries, and RBAC rules within the PariLink ecosystem.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` with DropdownMenus integrated directly into the `Actions` column for contextual security actions (Lock Account, Reset Password, Edit Role).
- **Forms:** `react-hook-form` and `zod` enforce rigorous frontend validation for user invitations, strictly mapping selections to the predefined backend `UserRole` enum.
- **State Management:** `@tanstack/react-query` ensures mutations (like locking an account) immediately invalidate the user ledger cache.

### Core Components

1. **`UserTable` & `UserFilters`**: Presents the user directory. Highlights `LOCKED` accounts in red to instantly flag potential security issues. Uses contextual dropdowns rather than separate pages for quick security actions.
2. **`UserForm`**: A streamlined wizard for creating and editing profiles. Explicitly segregates "Identity" (Name, Email) from "Access & RBAC" (Role, Branch).
3. **API Security Stubs**: Functions for `lockUserAccount` and `resetUserPassword` are wired to the UI, expecting standard backend POST execution.

### RBAC Enforcement

`<RoleGuard>` isolates administration:
- **Strict Access (`/admin/users`):** Modifying IAM settings and accessing the user directory is restricted exclusively to `SUPER_ADMIN` and `ORG_ADMIN`. All other operational roles are barred from this module.
- **Role Enforcement:** The frontend strictly uses the existing roles (`SUPER_ADMIN`, `ORG_ADMIN`, `OPERATIONS`, `FINANCE`, `SALES`, `DISPATCHER`, `VIEWER`, `DRIVER`). No new roles were invented.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
