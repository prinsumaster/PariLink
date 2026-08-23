#!/bin/bash
lsof -ti:3000,8080 | xargs kill -9 || true
cd /Users/vishalvirda/Desktop/PariLink/apps/api && npm run start:prod > api.log 2>&1 &
API_PID=$!
cd /Users/vishalvirda/Desktop/PariLink/apps/web && npm run start > web.log 2>&1 &
WEB_PID=$!
cd /Users/vishalvirda/Desktop/PariLink
sleep 10
echo "Running smoke.spec.ts..."
npm run test:e2e -w apps/web -- tests/smoke.spec.ts
kill $API_PID $WEB_PID
