#!/usr/bin/env bash
set -e

ENDPOINT=$1

if [ -z "$ENDPOINT" ]; then
  echo "Usage: $0 <endpoint-url>"
  exit 1
fi

echo "Running health check against ${ENDPOINT}..."

MAX_RETRIES=10
RETRY_INTERVAL=10
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${ENDPOINT})
  
  if [ "$STATUS_CODE" -eq 200 ]; then
    echo "Health check passed (HTTP 200)."
    exit 0
  fi
  
  echo "Attempt $((COUNT+1)) failed with status code ${STATUS_CODE}. Retrying in ${RETRY_INTERVAL} seconds..."
  sleep $RETRY_INTERVAL
  COUNT=$((COUNT+1))
done

echo "Health check failed after ${MAX_RETRIES} attempts."
exit 1
