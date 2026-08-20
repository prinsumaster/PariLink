#!/bin/bash
set -e

echo "=== First-Run Setup ==="
echo "1. Running Database Migrations..."
docker compose exec api sh -c 'npx prisma migrate deploy'

echo "2. Seeding Database..."
docker compose exec api sh -c 'npm run seed'

echo "3. Verifying Login & Dashboard..."
node evidence/loop-11.7/restart-test.js
