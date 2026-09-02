#!/bin/bash
COMPANY_A="a2d6237c-2a41-42a7-a075-c91a6d38c65b"
COMPANY_B="5622b6af-d597-497e-829e-4cfa290051d9"
ROW_ID="44444444-4444-4444-4444-444444444444"
RESOURCE="WarehouseZone"

echo "=== cp-a ($RESOURCE) ==="
echo "Row ID: $ROW_ID"

COUNT1=$(PGPASSWORD=password psql -U parilink_sys -h localhost -p 5434 -d parilink_test -t -c "SELECT count(*) FROM \"$RESOURCE\" WHERE id = '$ROW_ID';" | grep -o '[0-9]*')
echo "1. parilink_sys (unscoped) sees: $COUNT1"

COUNT2=$(PGPASSWORD=password psql -U parilink_app -h localhost -p 5434 -d parilink_test -t -c "SET app.current_company_id = '$COMPANY_B'; SELECT count(*) FROM \"$RESOURCE\" WHERE id = '$ROW_ID';" | grep -o '[0-9]*')
echo "2. parilink_app (tenant: $COMPANY_B) sees: $COUNT2"

COUNT3=$(PGPASSWORD=password psql -U parilink_app -h localhost -p 5434 -d parilink_test -t -c "SET app.current_company_id = '$COMPANY_A'; SELECT count(*) FROM \"$RESOURCE\" WHERE id = '$ROW_ID';" | grep -o '[0-9]*')
echo "3. parilink_app (tenant: $COMPANY_A) sees: $COUNT3"

if [ "$COUNT1" -eq 1 ] && [ "$COUNT2" -eq 1 ] && [ "$COUNT3" -eq 0 ]; then
  echo "PASS"
  exit 0
else
  echo "FAIL"
  exit 1
fi
