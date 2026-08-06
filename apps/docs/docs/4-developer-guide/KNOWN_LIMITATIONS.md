# Known Limitations & Acceptable Risks

While PariLink has been heavily fortified for enterprise production, the following architectural and operational limitations remain by design:

## 1. WebSockets & Real-Time Syncing
Currently, real-time GPS tracking relies on client-side polling or manual queue flushing (e.g. `processOfflineQueue`). The system does not utilize WebSockets or Server-Sent Events (SSE) natively yet. This is an acceptable risk as polling is easily horizontally scaled, whereas WebSockets require complex state management (e.g. Redis Pub/Sub adapter).

## 2. Event Sourcing / Kafka
PariLink is a Modular Monolith backed by PostgreSQL. It relies on immediate synchronous consistency (e.g. double-entry ledger postings during invoice approval). At massive scale (>1,000 tx/sec), synchronous DB transactions will lock. Moving to Kafka/Event-Driven architecture will be required for next-stage scale.

## 3. Stripe Factoring "Mock"
The `FactoringService` contains a mock redirect to Stripe. Full OAuth connect flows and Webhook parsing are required before true monetary transactions can occur.

## 4. OCR Document Parsing
`DocumentsService` currently accepts uploads. Extracting BOL text automatically via AWS Textract or GCP Document AI is pending.

## 5. PostgreSQL Max Connections
Node.js scales via processes. 20 Pods * 10 connections = 200 DB connections. Using PgBouncer is required to avoid connection starvation on the database.
