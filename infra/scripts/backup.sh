#!/usr/bin/env bash
# =============================================================================
# PariLink — Automated Database Backup Script
# Runs: Daily full backup, 4-hourly WAL archive to S3
# Validates: Restore test monthly, checksum verification
# Retention: 35 days hot, 7 years cold (Glacier)
# =============================================================================

set -euo pipefail

# ─── Configuration ────────────────────────────────────────────────────────────
DB_HOST="${POSTGRES_HOST}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-parilink}"
DB_USER="${POSTGRES_USER:-parilink_admin}"
S3_BUCKET="${BACKUP_S3_BUCKET}"
S3_GLACIER_BUCKET="${BACKUP_S3_GLACIER_BUCKET:-}"
SLACK_WEBHOOK="${SLACK_WEBHOOK_URL:-}"
ENCRYPTION_KEY_ID="${AWS_KMS_KEY_ID}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-35}"
ENVIRONMENT="${ENVIRONMENT:-production}"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="parilink_${ENVIRONMENT}_${TIMESTAMP}.pgdump"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
LOG_FILE="/tmp/backup_${TIMESTAMP}.log"

# ─── Logging ─────────────────────────────────────────────────────────────────
log() {
  echo "[$(date -u +'%Y-%m-%dT%H:%M:%SZ')] $1" | tee -a "$LOG_FILE"
}

notify_slack() {
  local STATUS="$1"
  local MESSAGE="$2"
  local COLOR="$3"

  if [[ -n "$SLACK_WEBHOOK" ]]; then
    curl -sf -X POST "$SLACK_WEBHOOK" \
      -H 'Content-type: application/json' \
      --data "{
        \"attachments\": [{
          \"color\": \"${COLOR}\",
          \"text\": \"${STATUS}: PariLink DB Backup — ${MESSAGE}\",
          \"fields\": [
            {\"title\": \"Environment\", \"value\": \"${ENVIRONMENT}\", \"short\": true},
            {\"title\": \"Database\", \"value\": \"${DB_NAME}\", \"short\": true},
            {\"title\": \"Timestamp\", \"value\": \"${TIMESTAMP}\", \"short\": false}
          ]
        }]
      }" || true
  fi
}

# ─── Trap for cleanup and failure notification ────────────────────────────────
trap 'handle_error $? $LINENO' ERR

handle_error() {
  local EXIT_CODE="$1"
  local LINE_NO="$2"
  log "ERROR: Backup failed at line ${LINE_NO} with exit code ${EXIT_CODE}"
  notify_slack "❌ FAILED" "Backup script failed at line ${LINE_NO}" "danger"
  exit "${EXIT_CODE}"
}

# ─── 1. Pre-flight Checks ─────────────────────────────────────────────────────
log "=== PariLink Database Backup Starting ==="
log "Environment: ${ENVIRONMENT}"
log "Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
log "S3 Target: s3://${S3_BUCKET}/backups/${ENVIRONMENT}/"

command -v pg_dump    >/dev/null 2>&1 || { log "pg_dump not found"; exit 1; }
command -v aws        >/dev/null 2>&1 || { log "awscli not found"; exit 1; }
command -v sha256sum  >/dev/null 2>&1 || { log "sha256sum not found"; exit 1; }

# Test DB connectivity
log "Testing database connectivity..."
pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  || { log "ERROR: Cannot connect to database"; exit 1; }
log "Database connectivity: OK"

# ─── 2. Create Backup ─────────────────────────────────────────────────────────
log "Starting pg_dump..."

PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --format=custom \
  --compress=9 \
  --no-password \
  --verbose \
  --file="/tmp/${BACKUP_FILE}" \
  2>> "$LOG_FILE"

BACKUP_SIZE=$(du -sh "/tmp/${BACKUP_FILE}" | cut -f1)
log "Backup complete. Size: ${BACKUP_SIZE}"

# ─── 3. Checksum ──────────────────────────────────────────────────────────────
log "Generating SHA-256 checksum..."
sha256sum "/tmp/${BACKUP_FILE}" > "/tmp/${CHECKSUM_FILE}"
CHECKSUM=$(cat "/tmp/${CHECKSUM_FILE}" | awk '{print $1}')
log "Checksum: ${CHECKSUM}"

# ─── 4. Upload to S3 with server-side encryption ─────────────────────────────
S3_PATH="s3://${S3_BUCKET}/backups/${ENVIRONMENT}/${TIMESTAMP}/"

log "Uploading backup to S3..."
aws s3 cp "/tmp/${BACKUP_FILE}" "${S3_PATH}${BACKUP_FILE}" \
  --sse aws:kms \
  --sse-kms-key-id "$ENCRYPTION_KEY_ID" \
  --storage-class STANDARD_IA \
  --metadata "checksum=${CHECKSUM},environment=${ENVIRONMENT},db=${DB_NAME},size=${BACKUP_SIZE}"

aws s3 cp "/tmp/${CHECKSUM_FILE}" "${S3_PATH}${CHECKSUM_FILE}" \
  --sse aws:kms \
  --sse-kms-key-id "$ENCRYPTION_KEY_ID"

log "Upload complete: ${S3_PATH}"

# ─── 5. Upload logs ───────────────────────────────────────────────────────────
aws s3 cp "$LOG_FILE" "${S3_PATH}backup.log" \
  --sse aws:kms \
  --sse-kms-key-id "$ENCRYPTION_KEY_ID"

# ─── 6. Update latest symlink in S3 ──────────────────────────────────────────
echo "${TIMESTAMP}" > /tmp/latest.txt
aws s3 cp /tmp/latest.txt "s3://${S3_BUCKET}/backups/${ENVIRONMENT}/latest.txt" \
  --sse aws:kms \
  --sse-kms-key-id "$ENCRYPTION_KEY_ID"

# ─── 7. Cleanup old local backups ────────────────────────────────────────────
rm -f "/tmp/${BACKUP_FILE}" "/tmp/${CHECKSUM_FILE}"
log "Local temporary files cleaned up"

# ─── 8. Apply retention policy ───────────────────────────────────────────────
log "Applying retention policy (${RETENTION_DAYS} days)..."
CUTOFF_DATE=$(date -d "-${RETENTION_DAYS} days" +"%Y-%m-%d" 2>/dev/null \
  || date -v -${RETENTION_DAYS}d +"%Y-%m-%d")  # macOS compatible

aws s3 ls "s3://${S3_BUCKET}/backups/${ENVIRONMENT}/" | while read -r LINE; do
  FOLDER_DATE=$(echo "$LINE" | awk '{print $2}' | cut -d'_' -f1)
  if [[ -n "$FOLDER_DATE" ]] && [[ "$FOLDER_DATE" < "$CUTOFF_DATE" ]]; then
    FOLDER=$(echo "$LINE" | awk '{print $2}')
    log "Removing expired backup: ${FOLDER}"
    aws s3 rm "s3://${S3_BUCKET}/backups/${ENVIRONMENT}/${FOLDER}" --recursive || true
  fi
done

# ─── 9. Verify backup integrity (download and verify checksum) ────────────────
log "Verifying backup integrity..."
aws s3 cp "${S3_PATH}${BACKUP_FILE}" "/tmp/verify_${BACKUP_FILE}" \
  --sse aws:kms

VERIFY_CHECKSUM=$(sha256sum "/tmp/verify_${BACKUP_FILE}" | awk '{print $1}')
rm -f "/tmp/verify_${BACKUP_FILE}"

if [[ "$CHECKSUM" != "$VERIFY_CHECKSUM" ]]; then
  log "ERROR: Checksum mismatch! Backup may be corrupted."
  log "Expected: ${CHECKSUM}"
  log "Got:      ${VERIFY_CHECKSUM}"
  notify_slack "❌ INTEGRITY FAILURE" "Backup checksum mismatch — backup may be corrupted" "danger"
  exit 1
fi

log "Integrity verification: PASSED ✅"

# ─── 10. Archive to Glacier (if cold storage bucket configured) ───────────────
if [[ -n "$S3_GLACIER_BUCKET" ]]; then
  YEAR_MONTH=$(date +"%Y-%m")
  if [[ "$(date +%d)" == "01" ]]; then  # First day of month
    log "Archiving monthly snapshot to Glacier..."
    aws s3 cp "${S3_PATH}${BACKUP_FILE}" \
      "s3://${S3_GLACIER_BUCKET}/monthly/${YEAR_MONTH}/${BACKUP_FILE}" \
      --sse aws:kms \
      --sse-kms-key-id "$ENCRYPTION_KEY_ID" \
      --storage-class DEEP_ARCHIVE
    log "Glacier archive complete"
  fi
fi

# ─── 11. CloudWatch Metric ────────────────────────────────────────────────────
aws cloudwatch put-metric-data \
  --metric-name "BackupSuccess" \
  --namespace "PariLink/Database" \
  --value 1 \
  --dimensions "Environment=${ENVIRONMENT}" \
  --unit Count || true

# ─── 12. Success notification ─────────────────────────────────────────────────
log "=== Backup completed successfully ==="
log "File: ${BACKUP_FILE}"
log "Size: ${BACKUP_SIZE}"
log "Checksum: ${CHECKSUM}"
log "S3 Path: ${S3_PATH}"

notify_slack "✅ SUCCESS" \
  "Backup completed | Size: ${BACKUP_SIZE} | S3: ${S3_PATH}" \
  "good"

exit 0
