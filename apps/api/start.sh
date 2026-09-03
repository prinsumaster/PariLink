#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running Prisma migrations..."
  npx prisma@5.22.0 migrate deploy
else
  echo "Skipping Prisma migrations (RUN_MIGRATIONS != true)"
fi

echo "Starting application..."
exec "$@"
