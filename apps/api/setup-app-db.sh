#!/bin/bash
set -e

ADMIN_DB_URL=${ADMIN_DATABASE_URL:-"postgresql://parilink:devpassword@localhost:5433/parilink_db"}

if [ -z "$PARILINK_SYS_PASSWORD" ]; then
  echo "Error: PARILINK_SYS_PASSWORD environment variable must be set."
  exit 1
fi

echo "Provisioning roles on parilink_db..."

psql "$ADMIN_DB_URL" -v ON_ERROR_STOP=1 <<-EOSQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'parilink_sys') THEN
    CREATE ROLE parilink_sys LOGIN PASSWORD '${PARILINK_SYS_PASSWORD}' NOSUPERUSER NOCREATEDB NOCREATEROLE BYPASSRLS;
  ELSE
    ALTER ROLE parilink_sys WITH PASSWORD '${PARILINK_SYS_PASSWORD}';
  END IF;

  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'parilink_ai') THEN
    CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
  END IF;
END
\$\$;

GRANT USAGE ON SCHEMA public TO parilink_sys, parilink_ai;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parilink_sys;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO parilink_sys;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO parilink_sys;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO parilink_sys;
GRANT SELECT ON "Trip","Load","Invoice","Vehicle","Driver","Customer","Expense" TO parilink_ai;
EOSQL

echo "Done."
