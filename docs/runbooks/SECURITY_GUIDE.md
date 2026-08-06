# PariLink Enterprise 1.0.0 — Security & Compliance Guide

This document outlines the cryptographic key management and rotation procedures required to maintain a secure production posture.

## 1. Secret Rotation Procedures
PariLink relies on a layered secret architecture.

### A. JWT & Cookie Secrets
- **Rotation Frequency:** 90 Days or immediately following suspected compromise.
- **Impact:** Rotating `JWT_SECRET` instantly invalidates all active user sessions globally. Rotating `COOKIE_SECRET` forces all users to re-authenticate on their next request.
- **Procedure:** 
  1. Generate new 64-byte hex keys: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
  2. Update `k8s/secret.yaml` or AWS Secrets Manager.
  3. Execute `kubectl rollout restart deployment parilink-api` during a scheduled maintenance window.

### B. Master Encryption Key (`MASTER_ENCRYPTION_KEY_V1`)
- **Purpose:** Secures sensitive PII (Social Security Numbers, Payment Methods) at rest in PostgreSQL via AES-256-GCM.
- **Rotation Procedure:** This is a symmetric key. Currently, PariLink does not natively support live re-encryption of millions of rows. Key rotation requires standing up a secondary database, decrypting with `V1`, encrypting with `V2`, and failing over. This key must be held under the strictest physical and logical isolation.

## 2. API Key Rotation (Developer Platform)
Enterprise tenants issue Developer API Keys via the Integration Hub.
- **Algorithm:** Keys are hashed via `bcrypt(saltRounds=10)` before database storage. The raw key is shown to the user only once.
- **Rotation:** If a tenant compromises their API key, the tenant Administrator must use the UI to Revoke the key and generate a new one. The `Cache-Control` layer will purge the invalid key within 60 seconds.

## 3. Backup Encryption
- All automated backups triggered by `OperationsScheduler` are natively encrypted by the cloud provider (e.g., AWS EBS encryption, RDS KMS keys).
- Off-site cold storage exports MUST be PGPG encrypted using the Operations Public Key before leaving the VPC boundary.

## 4. Principle of Least Privilege
- **Kubernetes RBAC:** Pods execute under strict ServiceAccounts. The API pod cannot mutate Kubernetes resources.
- **Database Users:** The API connects to PostgreSQL using a scoped `parilink_api_role` that lacks `DROP TABLE` or `GRANT` privileges. Migrations are executed by a separate CI/CD runner using a high-privileged `parilink_admin_role`.
