#!/bin/bash
echo "Waiting for API (8080) and Web (3000) to start..."
while ! curl -s http://localhost:8080/api/v1/health > /dev/null; do sleep 2; done
while ! curl -s http://localhost:3000 > /dev/null; do sleep 2; done
echo "Servers are up. Running tests..."
cd apps/web && npx playwright test tests/auth.spec.ts
