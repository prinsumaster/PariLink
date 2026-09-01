#!/bin/bash
set -e

echo "Starting throwaway Postgres container..."
docker rm -f parilink-test-db 2>/dev/null || true
docker run --name parilink-test-db -e POSTGRES_PASSWORD=postgres -p 5434:5432 -d postgres:15-alpine > /dev/null

echo "Waiting for Postgres to be ready..."
sleep 3

export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres"
export APP_DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres"

echo "Provisioning parilink_ai BEFORE migrations -- 20260901000001_ai_no_bypass
does CREATE POLICY ... TO parilink_ai and fails if the role is absent."
docker exec parilink-test-db psql -U postgres -d postgres -c \
  "DO \$\$ BEGIN
     IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_ai') THEN
       CREATE ROLE parilink_ai NOSUPERUSER NOCREATEDB NOCREATEROLE;
     END IF;
   END \$\$;"

echo "Running migrations on throwaway DB as superuser..."
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

echo "Setting up AI role..."
docker exec parilink-test-db psql -U postgres -d postgres -c "ALTER ROLE parilink_ai LOGIN PASSWORD 'aipass';"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT USAGE ON SCHEMA public TO parilink_ai;"
# The AI role gets SELECT on exactly the 7 ALLOWED_TABLES and nothing else.
# Granting SELECT on ALL tables left parilink_ai able to read User (password
# hashes included) with app.bypass_rls='on', stopped only by the app-layer
# ALLOWED_TABLES check in the SQL validator. The ai_no_bypass RESTRICTIVE
# policy only covers those 7 tables; this grant is what protects the other 234.
docker exec parilink-test-db psql -U postgres -d postgres -c "REVOKE ALL ON ALL TABLES IN SCHEMA public FROM parilink_ai;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT SELECT ON \"Trip\",\"Load\",\"Invoice\",\"Vehicle\",\"Driver\",\"Customer\",\"Expense\" TO parilink_ai;"
docker exec parilink-test-db psql -U postgres -d postgres -c "GRANT parilink_ai TO parilink_test;"

export DATABASE_URL="postgresql://parilink_test:testpass@localhost:5434/postgres"
export APP_DATABASE_URL="postgresql://parilink_test:testpass@localhost:5434/postgres"

echo "Seeding DB..."
npx prisma db seed > /dev/null
echo "Done"
