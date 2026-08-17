#!/bin/bash

echo "Running Phase 0 script to gather info"

# 1. Prisma Query Census
echo "File,Line,Method,RawQuery,Classification" > docs/security/prisma-query-census.csv
find apps/api/src -name "*.ts" -type f | xargs grep -n "\.runAsSystem(" | awk -F: '{print $1","$2",runAsSystem,,\"UNSAFE\""}' >> docs/security/prisma-query-census.csv
find apps/api/src -name "*.ts" -type f | xargs grep -n "\$queryRaw" | awk -F: '{print $1","$2",queryRaw,\""$3"\",\"SUSPICIOUS\""}' >> docs/security/prisma-query-census.csv
find apps/api/src -name "*.ts" -type f | xargs grep -n "\$executeRaw" | awk -F: '{print $1","$2",executeRaw,\""$3"\",\"SUSPICIOUS\""}' >> docs/security/prisma-query-census.csv

# 2. Route Guard Inventory
echo "Controller,Route,AuthType,Permissions" > docs/security/route-guard-inventory.csv
find apps/api/src -name "*.controller.ts" -type f | while read file; do
  controller_name=$(basename $file)
  grep -n "@Get\|@Post\|@Put\|@Patch\|@Delete" $file | while read route_line; do
    line_num=$(echo $route_line | cut -d: -f1)
    route=$(echo $route_line | cut -d: -f2- | grep -o "'.*'")
    auth_type="AUTH"
    if grep -B 5 -A 1 "@Public" $file | grep -q "$route"; then
      auth_type="PUBLIC"
    fi
    permissions=$(grep -B 5 "@RequirePermissions" $file | grep -A 5 "@Get\|@Post" | grep -v "^$" | head -1 || echo "NONE")
    echo "$controller_name,$route,$auth_type,$permissions" >> docs/security/route-guard-inventory.csv
  done
done

# 3. DB Constraints
echo "# Live Database Constraints" > docs/security/db-constraints.md
docker exec parilink-postgres-1 psql -U parilink -d parilink_db -c "
SELECT conname, pg_get_constraintdef(c.oid)
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public';" >> docs/security/db-constraints.md

