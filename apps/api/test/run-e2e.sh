#!/bin/bash
set -e

if [ -z "$CI" ]; then
  echo "Starting throwaway Postgres container..."
  docker rm -f parilink-test-db 2>/dev/null || true
  docker run --name parilink-test-db -e POSTGRES_PASSWORD=postgres -p 5434:5432 -d postgres:15-alpine > /dev/null

  trap "echo 'Cleaning up throwaway containers...'; docker rm -f parilink-test-db > /dev/null 2>&1" EXIT

  echo "Waiting for Postgres to be ready..."
  sleep 3

  export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/postgres?schema=public"
  export REDIS_URL="redis://localhost:6379"
fi

echo "Running migrations and seeding on throwaway DB..."
npx prisma migrate deploy > /dev/null
npx prisma db seed > /dev/null

echo "Flushing Redis..."
redis-cli flushall || true

echo "Running E2E Suites..."
if [ $# -gt 0 ]; then
  NODE_ENV=test npx jest --runInBand --setupFiles dotenv/config --config ./test/jest-e2e.json "$@"
else
  NODE_ENV=test npx jest --runInBand --setupFiles dotenv/config --config ./test/jest-e2e.json test/auth.e2e-spec.ts test/dto-validation.e2e-spec.ts test/integrations-security.e2e-spec.ts test/soft-delete-references.e2e-spec.ts
fi
