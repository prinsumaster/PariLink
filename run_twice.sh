echo "Run 1..."
npm run test:e2e -w apps/web > run1.log 2>&1
echo "Run 1 Exit: $?"
echo "Run 2..."
npm run test:e2e -w apps/web > run2.log 2>&1
echo "Run 2 Exit: $?"
