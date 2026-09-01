#!/bin/bash
docker rm -f parilink-test-db-manual || true
docker run -d --name parilink-test-db-manual -p 5434:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=parilink_test pgvector/pgvector:pg16
sleep 5
export PGPASSWORD=postgres
psql -U postgres -h localhost -p 5434 -d parilink_test -c "CREATE ROLE parilink_ai;"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "CREATE ROLE parilink_app WITH LOGIN PASSWORD 'password';"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "CREATE ROLE parilink_test WITH LOGIN PASSWORD 'password';"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "CREATE ROLE parilink_sys WITH LOGIN PASSWORD 'password' BYPASSRLS;"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "GRANT ALL PRIVILEGES ON SCHEMA public TO parilink_app;"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "GRANT ALL PRIVILEGES ON SCHEMA public TO parilink_test;"
cd apps/api
export DATABASE_URL="postgres://postgres:postgres@localhost:5434/parilink_test"
npx prisma migrate deploy
# Give parilink_app and parilink_test access to all tables after migrate
psql -U postgres -h localhost -p 5434 -d parilink_test -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parilink_app, parilink_test, parilink_sys;"
psql -U postgres -h localhost -p 5434 -d parilink_test -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO parilink_app, parilink_test, parilink_sys;"
npx prisma db seed
