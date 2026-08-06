#!/bin/bash
echo "Testing Auth..."
AUTH_RESP=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parilink.com","password":"password123"}')

echo "Auth Response: $AUTH_RESP"

TOKEN=$(echo $AUTH_RESP | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
    TOKEN=$(echo $AUTH_RESP | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
    echo "Failed to extract token"
    exit 1
fi

echo "Token extracted. Testing Execution endpoint..."
EXEC_RESP=$(curl -s -X GET http://localhost:8080/api/v1/operations/executions \
  -H "Authorization: Bearer $TOKEN")

echo "Executions Response (first 200 chars): ${EXEC_RESP:0:200}"
