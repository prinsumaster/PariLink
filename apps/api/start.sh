#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma@5.22.0 migrate deploy

echo "Starting application..."
exec "$@"
