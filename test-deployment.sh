#!/bin/bash
set -e

echo "=== Clean Slate Test ==="
echo "1. Tearing down everything..."
docker compose down -v

echo "2. Building and starting from scratch..."
docker compose up -d --build

echo "3. Waiting for services to become healthy..."
# We can just wait for a minute or use a loop. For now let's just do docker compose ps.
# In the actual test I will just run docker compose ps separately after it's done.
