#!/bin/bash
set -e

# Login
curl -s -c /tmp/ck.txt localhost:8080/api/v1/health/readiness >/dev/null || true
TOKEN=$(curl -s -X POST localhost:8080/api/v1/auth/login \
  -H "X-XSRF-TOKEN: $(grep XSRF-TOKEN /tmp/ck.txt | awk '{print $7}')" \
  -b /tmp/ck.txt \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin_a@parilink.com","password":"password123"}' | jq -r '.access_token')

echo "Token: ${TOKEN:0:10}..."

# Test companies endpoint
echo "Testing /api/v1/companies..."
curl -s -X GET localhost:8080/api/v1/companies \
  -H "Authorization: Bearer $TOKEN"
echo ""
