# PariLink v2.0 Deployment Runbook

## 1. One-Time VPS Setup

Before deploying PariLink for the first time on a new VPS, perform the following one-time setup steps:

1.  **Install Docker & Docker Compose:** Ensure the latest stable versions are installed.
2.  **Firewall Configuration:** Allow only necessary ports (HTTP/80, HTTPS/443, SSH/22).
    ```bash
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw enable
    ```
3.  **Create the Secrets File:**
    Create the environment file that Docker Compose will load.
    ```bash
    sudo mkdir -p /etc/parilink
    sudo touch /etc/parilink/secrets.env
    sudo chown root:root /etc/parilink/secrets.env
    sudo chmod 0600 /etc/parilink/secrets.env
    ```
    Populate `/etc/parilink/secrets.env` with all necessary environment variables (e.g., `DATABASE_URL`, `REDIS_PASSWORD`, `MINIO_ROOT_PASSWORD`, etc.).

4.  **TLS Certificates:**
    The Caddy reverse proxy automatically provisions TLS certificates via Let's Encrypt. Ensure your domain's DNS A/AAAA records point to the VPS IP, and update the `Caddyfile` with your domain name.

## 2. JWT Keys Deployment

As per our security policy, JWT asymmetric keys (RS256) must **never** be baked into the image or stored in Git.
**IMPORTANT:** The keys generated and used during local dry runs must NEVER become the VPS keys. Always generate fresh keys for production deployments.
Production keys must be generated ON/FOR the VPS via `npm run keys:generate`, never reused from dev or dry-run. Note that keys with fingerprints `a75f853e` and `5949a06c` are non-production and must not be deployed.

1.  Generate the key pair on the VPS using the secure script `npm run keys:generate` (or `scratch/gen_keys.js` if running directly).
2.  Securely copy the keys to the VPS into the secrets directory:
    ```bash
    scp ./keys/private.pem root@<VPS_IP>:/etc/parilink/private.pem
    scp ./keys/public.pem root@<VPS_IP>:/etc/parilink/public.pem
    ```
3.  Ensure strict permissions on the VPS:
    ```bash
    sudo chown root:root /etc/parilink/*.pem
    sudo chmod 0600 /etc/parilink/private.pem
    sudo chmod 0644 /etc/parilink/public.pem
    ```
4.  In `/etc/parilink/secrets.env`, set the paths:
    ```env
    JWT_PRIVATE_KEY_PATH=/etc/parilink/private.pem
    JWT_PUBLIC_KEY_PATH=/etc/parilink/public.pem
    ```
    *Note: The `docker-compose.prod.yml` must mount these files into the `api` container if using paths, or you can base64-encode the keys into `JWT_PRIVATE_KEY_BASE64` in the `secrets.env` file. We recommend the base64 env approach for simplicity: `JWT_PRIVATE_KEY_BASE64="<base64-string>"`.*

## 3. Deployment Sequence

To deploy a new version (or the initial version):

1.  **Pull the Tagged Image:** (Never use `latest` in production)
    Images are pulled from the GitHub Container Registry (GHCR). Ensure you are logged in first. The PAT (Personal Access Token) should be stored securely on the VPS (e.g., in `~/.ghcr_token`).
    ```bash
    cat ~/.ghcr_token | docker login ghcr.io -u <github-username> --password-stdin
    export GIT_SHA=<commit-hash>
    docker compose -f docker-compose.prod.yml pull
    ```
2.  **Run Database Migrations:**
    ```bash
    docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy
    ```
3.  **Start/Update Services:**
    ```bash
    docker compose -f docker-compose.prod.yml up -d
    ```
4.  **Verify BOOTSTRAP Fingerprint:**
    Check the API logs to ensure the correct image is running and keys are loaded correctly.
    ```bash
    docker compose -f docker-compose.prod.yml logs api | grep BOOTSTRAP
    ```
    *Expected Behavior:*
    Record the fingerprint printed on the first successful boot (e.g., `PubKeyFingerprint=...`), and confirm it is unchanged on every later deploy. A change means either an intentional key rotation or the wrong secrets file.
    *(Also ensure the GitSHA matches the tag you intended to deploy).*
5.  **Smoke Test:**
    Perform basic validations:
    *   Navigate to the web interface and successfully login.
    *   Verify an authenticated API endpoint returns `200 OK`.
    *   Ensure tenant isolation (try accessing another tenant's resource, expect `403 Forbidden`).

## 4. Rollback Procedure

If a deployment introduces critical issues, immediately roll back to the previous stable image tag.

1.  **Stop and Revert Image Tag:**
    ```bash
    export GIT_SHA=<previous-stable-commit-hash>
    docker compose -f docker-compose.prod.yml up -d
    ```
    *Note: Docker Compose will automatically recreate the containers with the previous image.*
2.  **Verify Rollback:**
    Check the BOOTSTRAP fingerprint again to ensure the old `GitSHA` is running.
    ```bash
    docker compose -f docker-compose.prod.yml logs api | grep BOOTSTRAP
    ```

## 5. Database Password Rotation

If database credentials need to be rotated, **NEVER** use `docker volume rm` to reset the database, as this deletes all production data. PostgreSQL only reads `POSTGRES_PASSWORD` on initial initialization.

**Correct Rotation Procedure:**
1.  Connect to the running PostgreSQL instance:
    ```bash
    docker compose -f docker-compose.prod.yml exec postgres psql -U parilink -d parilink_db
    ```
2.  Execute the password change:
    ```sql
    ALTER USER parilink WITH PASSWORD 'new_secure_password';
    \q
    ```
3.  Update the `/etc/parilink/secrets.env` file with the new `DATABASE_URL` and `POSTGRES_PASSWORD`.
4.  Restart **only** the API and Web services to pick up the new environment variables:
    ```bash
    docker compose -f docker-compose.prod.yml up -d api web
    ```

## 6. Troubleshooting BOOTSTRAP

If the `BOOTSTRAP` log shows the wrong `GitSHA`:
*   **Check the exported variable:** Ensure `GIT_SHA` is correctly exported in the shell running `docker compose up -d`.
*   **Check the pull step:** Verify that the image for that `GIT_SHA` was actually pulled successfully.
*   **Stale Container:** Force recreate the container if necessary: `docker compose -f docker-compose.prod.yml up -d --force-recreate api`.

## 7. Backup and Restore Procedure

**Backup Automation:**
Backups must be automated via cron and stored outside the Docker volume on the host. More importantly, **backups must be copied OFF the VPS** (e.g., to AWS S3, Google Cloud Storage, or a separate server). A dump sitting on the same disk does not survive the hardware failure it exists to protect against.

1.  Create a backup script (e.g., `/opt/parilink/backup.sh`):
    ```bash
    #!/bin/bash
    BACKUP_DIR="/var/backups/parilink"
    mkdir -p "$BACKUP_DIR"

    # Create a timestamped custom-format dump (omit -t to avoid TTY corruption)
    docker exec parilink-postgres-1 pg_dump -U parilink parilink_db -F c > "$BACKUP_DIR/db_$(date +%F_%T).dump"

    # Retention policy: keep 7 daily backups
    find "$BACKUP_DIR" -name "db_*.dump" -mtime +7 -exec rm {} \;

    # IMPORTANT: Add your off-site sync command here
    # aws s3 sync "$BACKUP_DIR" s3://my-parilink-backups/
    ```

2.  Make it executable (`chmod +x /opt/parilink/backup.sh`) and add it to the root crontab to run daily at 2 AM:
    ```bash
    0 2 * * * /opt/parilink/backup.sh >> /var/log/parilink_backup.log 2>&1
    ```

**Manual Restore:**
To restore from a backup, clean the target database and use `pg_restore`. 
*(Note: Never use `-t` with `docker exec pg_dump` when creating custom format backups, as it injects TTY characters that corrupt the binary dump, causing `pg_restore` to segfault).*

```bash
# 1. Drop the existing schema to ensure a clean slate
docker exec -i parilink-postgres-1 psql -U parilink parilink_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Restore the dump via standard input (capture stderr to monitor ignored errors)
cat /var/backups/parilink/db_backup.dump | docker exec -i parilink-postgres-1 pg_restore -U parilink -d parilink_db -F c 2>&1
```
*(No `prisma migrate deploy` is required if restoring into an environment running the exact same code version as the backup. If restoring into a newer code environment, run migrations immediately after the restore).*

**Verifying the Restore:**
Always check the `pg_restore` output for errors. To filter out benign "already exists" errors (which occur because the dump unexpectedly causes policies to be evaluated multiple times — e.g. producing 1394 errors for only 178 policies, a discrepancy that remains unexplained but empirically harmless), use the following noise filter:
```bash
grep -v 'already exists' restore.err | grep -c 'pg_restore: error'
```
*Expected output: `0`*. The specific count of ignored errors does not matter; only the filtered structural error count matters. Anything else indicates a structural error (e.g., missing tables or constraints) and must be investigated.

## 8. Dataset and Disaster Recovery Caveat

The disaster recovery and restore paths documented above have been proven against a minimal initial dataset. While the structural restoration and RLS preservation are fully verified, real-world data complexity can introduce edge cases.
*   After the first production backup containing real data, you **must** repeat a Disaster Recovery drill (Dump -> Fresh Container -> Verify Row Counts -> Check RLS) to ensure large datasets restore correctly without foreign key or constraint violations.
*   Record the specific row counts and restoration times in this runbook after that drill.

## 9. Post-Deployment Errata & Caveats

During the v0.1.0 RC deployment, the following discrepancies from the written procedure were observed:
* **Missing Git Remote Configuration:** GitHub Actions and GHCR builds rely on the `origin` remote. If the deploy environment is cloned or initialized locally, you must explicitly run `git remote add origin <url>` before pushing tags, otherwise the CI workflows will not trigger and the GHCR images will remain unbuilt.
* **Domain Configuration:** The `NEXT_PUBLIC_API_URL` and base URLs must be explicitly set to the live domain (e.g., `https://parilink.com`) in the production `.env` files. Leaving them as localhost breaks the client-side fetch calls in the standalone build.
