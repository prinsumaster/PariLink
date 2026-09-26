#!/usr/bin/env bash
# scripts/rotate-credentials.sh
#
# Rotate all PariLink service credentials with genuine randomness.
# Generates new secrets via `openssl rand -base64 32`, applies them to:
#   - Postgres (ALTER USER ... via docker exec peer-auth)
#   - Redis (container restart picks up new REDIS_PASSWORD from .env)
#   - MinIO (container restart picks up new MINIO_ROOT_PASSWORD from .env)
#   - .env file (all relevant variables updated)
#
# After rotation, performs an auth-check for each service and reports
# AUTH_OK / AUTH_FAIL — secrets are NEVER echoed.
#
# Usage: bash scripts/rotate-credentials.sh
#        (run from the repo root where .env lives)
#
# Prerequisites:
#   - Docker Compose stack is running (postgres, redis, minio containers up)
#   - python3 available on PATH (for URL-encoding)
#   - psql available on PATH (for auth verification)
#   - curl available on PATH (for MinIO auth verification)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "[rotate-credentials] Generating new secrets..."

# ── 1. Generate secrets (never printed) ──────────────────────────────────────
export RAW_PARILINK; RAW_PARILINK=$(openssl rand -base64 32 | tr -d '\n')
export RAW_PARILINK_APP; RAW_PARILINK_APP=$(openssl rand -base64 32 | tr -d '\n')
export RAW_PARILINK_SYS; RAW_PARILINK_SYS=$(openssl rand -base64 32 | tr -d '\n')
export RAW_REDIS; RAW_REDIS=$(openssl rand -base64 32 | tr -d '\n')
export RAW_MINIO; RAW_MINIO=$(openssl rand -base64 32 | tr -d '\n')

# URL-encode for connection string embedding
url_encode() { python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1],safe=''))" "$1"; }
export ENC_PARILINK; ENC_PARILINK=$(url_encode "$RAW_PARILINK")
export ENC_PARILINK_APP; ENC_PARILINK_APP=$(url_encode "$RAW_PARILINK_APP")
export ENC_REDIS; ENC_REDIS=$(url_encode "$RAW_REDIS")

# ── 2. Rotate Postgres users via peer-auth docker exec ───────────────────────
echo "[rotate-credentials] Rotating Postgres users..."
docker exec parilink-postgres-1 psql -U postgres -d parilink_db \
  -c "ALTER USER parilink    WITH PASSWORD '$RAW_PARILINK';"
docker exec parilink-postgres-1 psql -U postgres -d parilink_db \
  -c "ALTER USER parilink_app WITH PASSWORD '$RAW_PARILINK_APP';"
docker exec parilink-postgres-1 psql -U postgres -d parilink_db \
  -c "ALTER USER parilink_sys WITH PASSWORD '$RAW_PARILINK_SYS';"

# ── 3. Update .env (both root and apps/api, same file is symlinked/copied) ───
echo "[rotate-credentials] Updating .env..."
python3 - <<'PYEOF'
import os, re

for env_file in ['.env', 'apps/api/.env']:
    try:
        with open(env_file, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        continue

    content = re.sub(r'POSTGRES_PASSWORD=.*',      f"POSTGRES_PASSWORD={os.environ['RAW_PARILINK']}",  content)
    content = re.sub(r'PARILINK_SYS_PASSWORD=.*',  f"PARILINK_SYS_PASSWORD={os.environ['RAW_PARILINK_SYS']}", content)
    content = re.sub(r'REDIS_PASSWORD=.*',          f"REDIS_PASSWORD={os.environ['RAW_REDIS']}",        content)
    content = re.sub(r'MINIO_ROOT_PASSWORD=.*',     f"MINIO_ROOT_PASSWORD={os.environ['RAW_MINIO']}",   content)

    # Connection-string lines (host differs between root .env and apps/api/.env)
    content = re.sub(
        r'DATABASE_URL=postgresql://parilink:[^@]+@',
        f"DATABASE_URL=postgresql://parilink:{os.environ['ENC_PARILINK']}@",
        content)
    content = re.sub(
        r'APP_DATABASE_URL=postgresql://parilink_app:[^@]+@',
        f"APP_DATABASE_URL=postgresql://parilink_app:{os.environ['ENC_PARILINK_APP']}@",
        content)
    content = re.sub(
        r'REDIS_URL=redis://:[^@]+@',
        f"REDIS_URL=redis://:{os.environ['ENC_REDIS']}@",
        content)

    with open(env_file, 'w') as f:
        f.write(content)
    print(f"  Updated {env_file}")
PYEOF

# ── 4. Restart services so they pick up new credentials ──────────────────────
echo "[rotate-credentials] Restarting services..."
docker compose up -d --force-recreate postgres pgbouncer redis minio api
echo "[rotate-credentials] Waiting 20s for services to stabilise..."
sleep 20

# ── 5. Auth verification (AUTH_OK / AUTH_FAIL only — no secrets printed) ────
echo "[rotate-credentials] Verifying credentials..."

export PGPASSWORD="$RAW_PARILINK"
if psql -w -U parilink -h 127.0.0.1 -p 6432 -d parilink_db -c '\q' 2>/dev/null; then
  echo "PARILINK:     AUTH_OK"
else
  echo "PARILINK:     AUTH_FAIL"
fi

export PGPASSWORD="$RAW_PARILINK_APP"
if psql -w -U parilink_app -h 127.0.0.1 -p 6432 -d parilink_db -c '\q' 2>/dev/null; then
  echo "PARILINK_APP: AUTH_OK"
else
  echo "PARILINK_APP: AUTH_FAIL"
fi

export PGPASSWORD="$RAW_PARILINK_SYS"
if psql -w -U parilink_sys -h 127.0.0.1 -p 6432 -d parilink_db -c '\q' 2>/dev/null; then
  echo "PARILINK_SYS: AUTH_OK"
else
  echo "PARILINK_SYS: AUTH_FAIL"
fi
unset PGPASSWORD

if docker exec parilink-redis-1 redis-cli -a "$RAW_REDIS" PING 2>/dev/null | grep -q PONG; then
  echo "REDIS:        AUTH_OK"
else
  echo "REDIS:        AUTH_FAIL"
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -u "admin:${RAW_MINIO}" http://127.0.0.1:9000/minio/admin/v3/info)
if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "MINIO:        AUTH_OK"
else
  echo "MINIO:        AUTH_FAIL (HTTP $HTTP_STATUS)"
fi

echo "[rotate-credentials] Done. Commit the updated .env files."
