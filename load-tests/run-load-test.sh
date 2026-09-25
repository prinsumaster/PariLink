#!/usr/bin/env bash
# load-tests/run-load-test.sh
# Convenience wrapper: login, get a vehicleId, run k6, capture output.
# Usage: ./load-tests/run-load-test.sh [BASE_URL]
set -euo pipefail

BASE_URL="${1:-http://localhost:8080/api/v1}"
ADMIN_EMAIL="admin@parilink.com"
ADMIN_PASSWORD="password123"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTFILE="load-tests/results/baseline_${TIMESTAMP}.txt"
mkdir -p load-tests/results

echo "🔐 Logging in to ${BASE_URL}..."
TOKEN=$(curl -sf -X POST "${BASE_URL}/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))")

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed — is the API container running on port 8080?"
  exit 1
fi
echo "✅ Token acquired"

echo "🚗 Fetching a real vehicleId..."
VEHICLE_ID=$(curl -sf "${BASE_URL}/vehicles?limit=1" \
  -H "Authorization: Bearer ${TOKEN}" | python3 -c "
import sys, json
d = json.load(sys.stdin)
vehicles = d if isinstance(d, list) else d.get('data', d.get('items', []))
print(vehicles[0]['id'] if vehicles else '')
")

if [ -z "$VEHICLE_ID" ]; then
  echo "⚠️  Could not get vehicleId — TCO tests will be skipped"
else
  echo "✅ vehicleId: ${VEHICLE_ID}"
fi

echo ""
echo "🚀 Starting k6 load test — output to ${OUTFILE}"
echo "   Target: ~28 req/s sustained for 5 minutes"
echo "   Thresholds: errors<1%, p95<500ms"
echo ""

k6 run \
  -e BASE_URL="${BASE_URL}" \
  -e ADMIN_EMAIL="${ADMIN_EMAIL}" \
  -e ADMIN_PASSWORD="${ADMIN_PASSWORD}" \
  -e VEHICLE_ID="${VEHICLE_ID}" \
  load-tests/parilink-load-test.js \
  2>&1 | tee "${OUTFILE}"

echo ""
echo "📄 Raw results saved to: ${OUTFILE}"
