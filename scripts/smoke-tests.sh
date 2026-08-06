#!/usr/bin/env bash
set -e

BASE_URL=$1

if [ -z "$BASE_URL" ]; then
  echo "Usage: $0 <base-url>"
  exit 1
fi

echo "Running smoke tests against ${BASE_URL}..."

# 1. API Root responds
echo "Testing root endpoint..."
curl -s -f ${BASE_URL}/api/v1 > /dev/null

# 2. Database connection check via health endpoint
echo "Testing deep health check..."
curl -s -f ${BASE_URL}/health | grep '"status":"ok"' > /dev/null

echo "All smoke tests passed."
exit 0
