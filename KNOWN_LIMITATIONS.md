# Known Limitations — v1.0.0

The following functional limitations exist in the PariLink Enterprise v1.0.0 platform. These are documented to set operational expectations and will be evaluated for future roadmaps.

## 1. Real-Time Telemetry Synchronization
The `useRealtimeEngine` SSE (Server-Sent Events) hook in the web client is currently staged but not functionally streaming high-frequency GPS coordinates from the backend telemetry workers. Real-time truck mapping falls back to standard REST polling at 30-second intervals until SSE streams are finalized.

## 2. Kubernetes Readiness Probes
The memory thresholds for the `HealthController` were explicitly increased from 150MB Heap / 300MB RSS to 500MB Heap / 800MB RSS. While stable for V1, enterprise deployments with extensive node clustering might observe higher baseline footprints. Node autoscaling memory limits must be set above 1GB per pod to prevent false-positive evictions.

## 3. Database Soft Deletion Cascade
Recursive soft deletion is implemented at the schema level using Prisma middleware, but extremely deep nested deletions (e.g., deleting a Company with 10,000+ Loads, Trips, Documents, and Webhooks) may experience timeout exceptions in the API Gateway if the operation exceeds 15 seconds. Manual background pruning is recommended for full tenant deletion.

## 4. Multi-Region Data Localization
V1.0.0 assumes a single global database instance (e.g., AWS RDS PostgreSQL in `us-east-1`). Strict data residency enforcement for EU/GDPR (where data cannot cross physical borders) is not supported natively via sharding in this release. 

## 5. Billing Auto-Reconciliation
Invoices and Payments are logged, but integration with external payment gateways (e.g., Stripe, ACH networks) requires manual API Webhook configuration on a per-tenant basis. Native OAuth connections to external financial institutions are scheduled for V1.1.0.
