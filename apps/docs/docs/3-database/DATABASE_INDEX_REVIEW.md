# Database Index Review

## The 100M Row Challenge
Enterprise transportation systems heavily rely on chronological status queries and multi-tenant scoping. A missing `companyId` in any index degrades query performance into a sequential scan across millions of records.

## Indexes Added
During the Performance Audit, the following critical composite indexes were injected into `schema.prisma`:

### LocationHistory
- `@@index([companyId, driverId, timestamp])`: Powers the driver route playback feature without full table scans.
- `@@index([companyId, tripId, timestamp])`: Powers real-time trip tracking calculations.

### Load
- `@@index([companyId, tripId])`: Accelerates the `/trips/:id` endpoint which eagerly fetches all related loads.

### Document
- `@@index([companyId, loadId])`: Speeds up Proof of Delivery (POD) fetching per load.
- `@@index([companyId, uploadedById])`: Speeds up user audit trails.

### Payment & InvoiceLineItem
- `@@index([companyId, invoiceId])`: Accelerates payment reduction math.

### JournalLine
- `@@index([companyId, accountId])`: Critical for Trial Balance generation.
- `@@index([companyId, entryId])`: Prevents sequential scans on ledger queries.

## Future Recommendations
- If `LocationHistory` exceeds 1 Billion rows, consider migrating it to a specialized Time-Series database (e.g., TimescaleDB) or utilizing PostgreSQL native partitioning by `date` ranges.
