# Story 2.13 — Document Management System (DMS)

## Architecture Overview

The Document Management System provides a secure, centralized vault for storing PDFs, images, and Office documents related to vehicles, drivers, and contracts.

### Key Technologies

- **Data Grid:** `@tanstack/react-table` lists documents with custom cell rendering for file type icons (PDF, Image, Generic) and human-readable byte sizes.
- **Upload Modal:** A `FormData` POST request strategy is stubbed out within `documentService.uploadDocument` to handle multipart/form-data uploads. The modal features drag-and-drop styling and taxonomy assignment (Category, Tags, Entity Linking).
- **Inline Preview:** A `Dialog` component wraps an `<iframe>` (for PDFs) or an `next/image` tag (for images) to provide rapid inline previews of documents without forcing a local download.

### Core Components

1. **`DocumentLibrary`**: The central table. Uses dynamic status badging (Expired, Pending Review, Active) to alert operations teams to compliance issues.
2. **`DocumentFilters`**: Global search and category filtering that updates the parent state, triggering a React Query refetch for the new `page 1` data.
3. **`DocumentUploadModal`**: Uses `lucide-react` icons to guide the user in selecting files, attaching optional metadata like `entityId`, and dispatching the upload mutation.
4. **`DocumentViewer`**: Renders on top of the library when a file name or "Eye" icon is clicked. Exposes direct Download and Open in New Tab links alongside the preview.

### RBAC Enforcement

`<RoleGuard>` isolates document modification:
- **Access (`/documents`):** View access is available to `SUPER_ADMIN`, `ORG_ADMIN`, `FINANCE`, `OPERATIONS`, `SALES`, and `DISPATCHER`.
- **Upload Restrictions:** Drivers and pure Viewers cannot upload documents into the system; this is restricted to operational roles.
- **Delete Restrictions:** Deletion logic requires confirmation and should ideally be restricted via backend policies, but is currently accessible to those with upload access.

## Constraints
As mandated, no modifications were made to the backend APIs or Prisma Schema. The frontend is built strictly around the defined endpoints.
