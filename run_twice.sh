echo "Starting production web server..."
cd apps/web
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
npm run start > ../server.log 2>&1 &
SERVER_PID=$!
# Wait for server to boot
sleep 5

echo "Run 1..."
npx playwright test tests/smoke.spec.ts > ../run1.log 2>&1
echo "Run 1 Exit: $?"

echo "Run 2..."
npx playwright test tests/smoke.spec.ts > ../run2.log 2>&1
echo "Run 2 Exit: $?"

kill -9 $SERVER_PID 2>/dev/null
