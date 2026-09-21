#!/bin/bash
COMPANY_A="e5a34360-c64b-4398-aef9-ec8e873eed14"
COMPANY_B="1aec167b-473a-4663-86d8-695963f3a4f3"

echo "=== Two-Tenant Warehouse Data Isolation Proof ==="

echo "1. Tenant A (Test Corp) querying Warehouses:"
PGPASSWORD=testpw123 psql -U parilink_app -d parilink_db -h localhost -p 5433 -c "
  SET app.current_company_id = '$COMPANY_A';
  SELECT name, code FROM \"Warehouse\";
"

echo "2. Tenant B (PariLink India Logistics) querying Warehouses:"
PGPASSWORD=testpw123 psql -U parilink_app -d parilink_db -h localhost -p 5433 -c "
  SET app.current_company_id = '$COMPANY_B';
  SELECT name, code FROM \"Warehouse\";
"
