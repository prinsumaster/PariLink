#!/usr/bin/env bash
# scripts/backup-postgres.sh
#
# Take a pg_dump of parilink_db and upload it to the MinIO parilink-backups
# bucket already in the docker-compose stack.
#
# Usage:
#   bash scripts/backup-postgres.sh          # backup only
#   bash scripts/backup-postgres.sh --verify # backup + restore-test to confirm dump is valid
#
# Prerequisites (all standard in the running stack):
#   - parilink-postgres-1 container is running
#   - parilink-minio-1 container is running
#   - .env is present in the repo root with POSTGRES_PASSWORD and MINIO_ROOT_PASSWORD

set -eo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ── Load credentials (tolerate unexpanded ${VAR} references in .env) ─────────
set -a
set +u
# shellcheck disable=SC1090,SC2046
eval "$(grep -E '^[A-Z_]+=.+$' .env | grep -v '\${' | xargs -d '\n' printf 'export %s\n')" 2>/dev/null || true
# Load the simple non-interpolated vars
POSTGRES_PASSWORD="$(grep '^POSTGRES_PASSWORD=' .env | cut -d= -f2-)"
MINIO_ROOT_PASSWORD="$(grep '^MINIO_ROOT_PASSWORD=' .env | cut -d= -f2-)"
set -u
set +a

TIMESTAMP=$(date -u +%Y-%m-%dT%H-%M-%SZ)
BACKUP_FILE="parilink_db_${TIMESTAMP}.sql.gz"
MINIO_BUCKET="parilink-backups"
MINIO_OBJECT="postgres/${BACKUP_FILE}"
LOCAL_TMP="/tmp/${BACKUP_FILE}"

echo "[backup-postgres] Starting backup at ${TIMESTAMP}"

# ── 1. Dump into a temp file in the postgres container, then copy out ────────
echo "[backup-postgres] Running pg_dump (as parilink superuser)..."
docker exec \
  -e PGPASSWORD="${POSTGRES_PASSWORD}" \
  parilink-postgres-1 \
  sh -c "pg_dump -U parilink parilink_db | gzip > /tmp/${BACKUP_FILE}"

# Copy the file out of the container to local tmp
docker cp "parilink-postgres-1:/tmp/${BACKUP_FILE}" "${LOCAL_TMP}"

# Clean up from container
docker exec parilink-postgres-1 rm -f "/tmp/${BACKUP_FILE}"

DUMP_SIZE=$(du -sh "${LOCAL_TMP}" | cut -f1)
echo "[backup-postgres] Dump complete: ${LOCAL_TMP} (${DUMP_SIZE})"

# ── 2. Upload to MinIO via mc (configure alias inline) ──────────────────────
echo "[backup-postgres] Uploading to MinIO ${MINIO_BUCKET}/${MINIO_OBJECT}..."

docker exec parilink-minio-1 \
  mc alias set local http://localhost:9000 admin "${MINIO_ROOT_PASSWORD}" \
  --api S3v4 2>/dev/null || true

# Copy local file into minio container then mc cp to bucket
docker cp "${LOCAL_TMP}" "parilink-minio-1:/tmp/${BACKUP_FILE}"
docker exec parilink-minio-1 \
  mc cp "/tmp/${BACKUP_FILE}" "local/${MINIO_BUCKET}/${MINIO_OBJECT}"
docker exec parilink-minio-1 rm -f "/tmp/${BACKUP_FILE}"

# Verify the object landed and get size
echo "[backup-postgres] Verifying MinIO object..."
docker exec parilink-minio-1 mc stat "local/${MINIO_BUCKET}/${MINIO_OBJECT}"

# ── 3. Optional: restore-verify into temp DB ────────────────────────────────
if [[ "${1:-}" == "--verify" ]]; then
  echo "[backup-postgres] --verify flag set: testing restore into temp database..."

  VERIFY_DB="parilink_restore_verify_$(date +%s)"

  # Create temp DB
  docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" parilink-postgres-1 \
    psql -U parilink -c "CREATE DATABASE \"${VERIFY_DB}\";"

  # Copy dump back into container and restore
  docker cp "${LOCAL_TMP}" "parilink-postgres-1:/tmp/${BACKUP_FILE}"
  docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" parilink-postgres-1 \
    sh -c "gunzip -c /tmp/${BACKUP_FILE} | psql -U parilink -d '${VERIFY_DB}' -v ON_ERROR_STOP=0 2>&1" | tail -5
  docker exec parilink-postgres-1 rm -f "/tmp/${BACKUP_FILE}"

  # Spot-check: count tables in restored DB
  TABLE_COUNT=$(docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" parilink-postgres-1 \
    psql -U parilink -d "${VERIFY_DB}" -tAc \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")

  # Drop temp DB
  docker exec -e PGPASSWORD="${POSTGRES_PASSWORD}" parilink-postgres-1 \
    psql -U parilink -c "DROP DATABASE \"${VERIFY_DB}\";"

  if [[ "${TABLE_COUNT}" -gt 0 ]]; then
    echo "[backup-postgres] RESTORE_OK: ${TABLE_COUNT} public tables verified in restored database."
  else
    echo "[backup-postgres] RESTORE_FAIL: 0 tables found after restore. Dump may be invalid."
    rm -f "${LOCAL_TMP}"
    exit 1
  fi
fi

rm -f "${LOCAL_TMP}"
echo "[backup-postgres] Done. Object saved: minio://local/${MINIO_BUCKET}/${MINIO_OBJECT}"
