#!/bin/bash
echo "Extracting Token..."
TOKEN=$(grep -o '"access_token":"[^"]*"' /Users/vishalvirda/.gemini/antigravity-ide/brain/b0f307fb-9c4d-490b-ae0d-e230c4b40613/.system_generated/tasks/task-7191.log | head -n 1 | cut -d '"' -f 4)

echo "Sending traffic to major list endpoints..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/trips > /dev/null
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/vehicles > /dev/null
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/drivers > /dev/null
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/dashboard/shipments > /dev/null

echo "Waiting for logs to flush..."
sleep 2

echo "Performance Audit Results:"
grep -E "PERFORMANCE\]|WARNING\]" /Users/vishalvirda/.gemini/antigravity-ide/brain/b0f307fb-9c4d-490b-ae0d-e230c4b40613/.system_generated/tasks/task-7311.log | tail -n 5
