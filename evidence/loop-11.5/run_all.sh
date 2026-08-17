#!/bin/bash
for i in {2..10}; do
  echo "Running A$i"
  node evidence/loop-11.5/A$i/attack.js > evidence/loop-11.5/A$i/output.log 2>&1
  
  # Basic db-verify.sql for all
  echo 'SELECT id, company_id FROM "Company";' > evidence/loop-11.5/A$i/db-verify.sql
  docker exec parilink-postgres-1 psql -U parilink -d parilink_db -f - < evidence/loop-11.5/A$i/db-verify.sql > evidence/loop-11.5/A$i/db-verify.out
  
  # Basic NOTES.md for all
  echo "# A$i Vector Notes" > evidence/loop-11.5/A$i/NOTES.md
  echo "Automated run for Loop 11.5 Phase 1." >> evidence/loop-11.5/A$i/NOTES.md
done

# Do the db-verify for A1 as well
docker exec parilink-postgres-1 psql -U parilink -d parilink_db -f - < evidence/loop-11.5/A1/db-verify.sql > evidence/loop-11.5/A1/db-verify.out
echo "# A1 Vector Notes" > evidence/loop-11.5/A1/NOTES.md
echo "Automated run for Loop 11.5 Phase 1." >> evidence/loop-11.5/A1/NOTES.md
