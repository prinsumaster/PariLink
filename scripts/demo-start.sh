#!/bin/bash
set -eo pipefail

echo "=========================================="
echo "    PARILINK CLIENT SHOWCASE STARTUP      "
echo "=========================================="

echo "1. Checking dependencies..."
if ! command -v docker &> /dev/null; then
    echo "Docker is required but not installed. Please install Docker."
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "Node.js/npm is required but not installed."
    exit 1
fi

echo "2. Setting up environment variables..."
cat << 'EOF' > .env
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://parilink:parilink_demo_pass@localhost:5433/parilink_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=super_secret_demo_key_for_client_showcase
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=admin
S3_SECRET_KEY=parilink_demo_pass
FRONTEND_URL=http://localhost:3000
EOF

cp .env apps/api/.env
cp .env apps/web/.env
echo "NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1" >> apps/web/.env

echo "3. Starting Infrastructure (Postgres, Redis, MinIO)..."
docker-compose down -v || true
POSTGRES_PASSWORD=parilink_demo_pass docker-compose up -d postgres redis minio
echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "4. Installing dependencies..."
npm install

echo "5. Running Database Migrations & Validation..."
cd apps/api
npx prisma generate
npx prisma migrate reset --force --skip-seed
npx prisma validate
echo "6. Seeding Demo Data..."
npx ts-node prisma/seed.ts
cd ../..

echo "7. Building and Starting PariLink Services..."
echo "Starting API in background..."
cd apps/api
npm run start:dev > ../../api.log 2>&1 &
API_PID=$!
cd ../..

echo "Starting Web Frontend in background..."
cd apps/web
npm run build
npm run start > ../../web.log 2>&1 &
WEB_PID=$!
cd ../..

echo "=========================================="
echo "      PARILINK DEMO IS NOW RUNNING!       "
echo "=========================================="
echo "API Server: http://localhost:8080/health"
echo "Web Portal: http://localhost:3000"
echo ""
echo "Demo Credentials:"
echo "Email: admin@parilink.com"
echo "Password: password123"
echo "=========================================="
echo "Press Ctrl+C to stop the demo."

trap "echo 'Stopping Demo...'; kill $API_PID $WEB_PID; docker-compose down" EXIT

wait
