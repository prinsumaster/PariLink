#!/bin/bash
set -eo pipefail

echo "=========================================="
echo "    PARILINK DEMO RESET SCRIPT            "
echo "=========================================="
echo "WARNING: This will DESTROY your local demo database."
echo "It will not affect production AWS resources."
echo ""
read -p "Are you sure you want to proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Reset cancelled."
    exit 1
fi

echo "1. Stopping services..."
docker-compose down -v || true

echo "2. Starting Database..."
POSTGRES_PASSWORD=parilink_demo_pass docker-compose up -d postgres redis minio
echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "3. Resetting schema and data..."
cd apps/api
npx prisma migrate reset --force --skip-seed
npx ts-node prisma/seed.ts
cd ../..

echo "=========================================="
echo "    DEMO ENVIRONMENT RESET COMPLETE       "
echo "=========================================="
echo "You can now run ./scripts/demo-start.sh"
