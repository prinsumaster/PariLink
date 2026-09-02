#!/bin/bash
set -e

echo "Provisioning roles on parilink_db..."

PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "CREATE ROLE parilink_sys LOGIN PASSWORD 'password' NOSUPERUSER NOCREATEDB NOCREATEROLE BYPASSRLS;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "GRANT USAGE ON SCHEMA public TO parilink_sys, parilink_ai;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parilink_sys;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO parilink_sys;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO parilink_sys;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO parilink_sys;"
PGPASSWORD=devpassword psql -U parilink -h localhost -p 5433 -d parilink_db -c "GRANT SELECT ON \"Trip\",\"Load\",\"Invoice\",\"Vehicle\",\"Driver\",\"Customer\",\"Expense\" TO parilink_ai;"

echo "Done."
