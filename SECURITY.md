# Security Policy

## Supported Versions

Only the current major release branch is supported with critical security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within PariLink, please send an e-mail to our dedicated Security Incident Response Team (SIRT) at `security@parilink.test`. 

All security vulnerabilities will be promptly addressed. Please **do not** open public GitHub issues or forum posts regarding the exploit. 

When reporting, please provide:
- A brief description of the vulnerability.
- Steps to reproduce.
- Any potential impact on cross-tenant isolation (IDOR).
- Proof of Concept (PoC) scripts if applicable.

We aim to acknowledge all vulnerability reports within 24 hours.

## Auditing and Compliance
PariLink v1.0 Enterprise forces strict multi-tenant Data Isolation (Row Level Security) at the database tier. All API requests are cryptographically validated via signed JWTs, and the application strictly enforces whitelist CORS origins. Third-party integrations must use rotated API keys or scoped OAuth2 tokens.

> **IMPORTANT**: In version 2.0.x, OAuth2 `client_credentials` tokens have migrated from signed JWTs to high-entropy opaque tokens. Any integration holding a token issued prior to this change will receive a 401 Unauthorized and must re-run the `client_credentials` exchange to obtain a valid opaque token.

## DB Password Rotation Runbook
- Correct method: ALTER USER parilink WITH PASSWORD '...'; then update .env, restart the API only.
- WARNING: never `docker volume rm` a data volume to change credentials. Postgres reads POSTGRES_PASSWORD only on first init.
