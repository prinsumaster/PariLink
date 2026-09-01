#!/bin/bash
set -e

if [ -z "$CI" ]; then
  echo "Starting throwaway Postgres container..."
  docker rm -f parilink-test-db 2>/dev/null || true
  docker run --name parilink-test-db -e POSTGRES_PASSWORD=postgres -p 5434:5432 -d postgres:15-alpine > /dev/null

  trap "echo 'Cleaning up throwaway containers...'; docker rm -f parilink-test-db > /dev/null 2>&1" EXIT

  echo "Waiting for Postgres to be ready..."
  sleep 3

  # Migrations require superuser (DDL) — run as postgres
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres"
  export APP_DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres"
  export REDIS_URL="redis://localhost:6379"
fi

echo "Provisioning parilink_ai BEFORE migrations -- 20260901000001_ai_no_bypass
does CREATE POLICY ... TO parilink_ai and fails if the role is absent."
docker exec parilink-test-db psql -U postgres -d postgres -c \
  "DO \$\$ BEGIN
     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_ai') THEN
       CREATE ROLE parilink_ai NOSUPERUSER NOCREATEDB NOCREATEROLE;
     END IF;
   END \$\$;"

echo "Running migrations on throwaway DB as superuser (DDL requires superuser)..."
npx prisma migrate deploy > /dev/null

echo "Creating non-superuser test role so RLS is enforced..."
docker exec parilink-test-db psql -U postgres -d postgres -c \
  "DO \$\$ BEGIN
     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_test') THEN
       CREATE ROLE parilink_test LOGIN PASSWORD 'testpass' NOSUPERUSER NOCREATEDB NOCREATEROLE;
     END IF;
   END \$\$;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT USAGE ON SCHEMA public TO parilink_test;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parilink_test;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO parilink_test;"
docker exec parilink-test-db psql -U postgres -d postgres -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO parilink_test;"
docker exec parilink-test-db psql -U postgres -d postgres -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO parilink_test;"

# The AI SQL path does `SET LOCAL ROLE parilink_ai`, which requires
# parilink_test to be a MEMBER of parilink_ai -- otherwise it fails with
# "permission denied to set role". The role itself is created by migration
# 20260901000001_ai_no_bypass (already applied above by migrate deploy).
# Its grant is deliberately narrow: SELECT on the 7 ALLOWED_TABLES only, so
# the AI role cannot read User/RefreshToken even if the validator is bypassed.
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT parilink_ai TO parilink_test;"
docker exec parilink-test-db psql -U postgres -d postgres -c "REVOKE ALL ON ALL TABLES IN SCHEMA public FROM parilink_ai;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT USAGE ON SCHEMA public TO parilink_ai;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT SELECT ON \"Trip\",\"Load\",\"Invoice\",\"Vehicle\",\"Driver\",\"Customer\",\"Expense\" TO parilink_ai;"

echo "Switching connection to non-superuser — RLS will now apply for all subsequent operations..."
export DATABASE_URL="postgresql://parilink_test:testpass@localhost:5434/postgres"
export APP_DATABASE_URL="postgresql://parilink_test:testpass@localhost:5434/postgres"

echo "Verifying RLS is actually live before running anything else..."
docker exec parilink-test-db psql -U parilink_test -d postgres -c \
  "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"
RLS_CHECK=$(docker exec parilink-test-db psql -U parilink_test -d postgres -t -c \
  "SELECT bool_and(relrowsecurity) AND bool_and(relforcerowsecurity) FROM pg_class WHERE relname IN ('Trip','Invoice','Vehicle') AND relkind = 'r';" | tr -d '[:space:]')
if [ "$RLS_CHECK" != "t" ]; then
  echo "FATAL: RLS is not enabled+forced on Trip/Invoice/Vehicle. Refusing to run tests against a role that could silently bypass RLS." >&2
  docker exec parilink-test-db psql -U parilink_test -d postgres -c \
    "SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname IN ('Trip','Invoice','Vehicle');"
  exit 1
fi
echo "RLS confirmed live and forced on sentinel tables (Trip, Invoice, Vehicle)."

echo "Seeding test DB as non-superuser (seed uses runAsSystem internally)..."
npx prisma db seed > /dev/null

echo "Flushing Redis..."
redis-cli flushall || true

echo "Running E2E Suites..."
if [ $# -gt 0 ]; then
  NODE_ENV=test npx jest --runInBand --setupFiles dotenv/config --config ./test/jest-e2e.json "$@"
else
  NODE_ENV=test npx jest --runInBand --setupFiles dotenv/config --config ./test/jest-e2e.json test/auth.e2e-spec.ts test/dto-validation.e2e-spec.ts test/integrations-security.e2e-spec.ts test/soft-delete-references.e2e-spec.ts
fi
