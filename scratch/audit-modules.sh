#!/bin/bash
cd /Users/vishalvirda/Desktop/PariLink

echo "# HONEST Module Audit Evidence" > scratch/audit-evidence.md
echo "" >> scratch/audit-evidence.md

echo "| Module | Verdict | Fake-data hits | Tests | isolation debt | Proven by (curl/file:line) |" > scratch/audit-table.md
echo "|--------|---------|----------------|-------|----------------|----------------------------|" >> scratch/audit-table.md

modules=$(ls -d apps/api/src/*/ | xargs -n 1 basename)

WORKING=0
PARTIAL=0
STUB=0

for M in $modules; do
  echo "### $M" >> scratch/audit-evidence.md
  
  echo '```bash' >> scratch/audit-evidence.md
  
  # Fake data
  echo "$ grep -rn \"Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];\" apps/api/src/$M --include=*.ts | wc -l" >> scratch/audit-evidence.md
  FAKE_HITS=$(grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/$M --include=*.ts | wc -l | tr -d ' ')
  echo "$FAKE_HITS" >> scratch/audit-evidence.md
  
  # Tests
  echo "$ find apps/api/src/$M apps/api/test -name \"*$M*spec.ts\" 2>/dev/null | wc -l" >> scratch/audit-evidence.md
  TESTS=$(find apps/api/src/$M apps/api/test -name "*$M*spec.ts" 2>/dev/null | wc -l | tr -d ' ')
  echo "$TESTS" >> scratch/audit-evidence.md
  
  # Isolation Debt
  echo "$ grep -rn -A2 \"runAsSystem(\" apps/api/src/$M --include=*.ts | grep -c companyId" >> scratch/audit-evidence.md
  ISOLATION_DEBT=$(grep -rn -A2 "runAsSystem(" apps/api/src/$M --include=*.ts | grep -c companyId | tr -d ' ')
  echo "$ISOLATION_DEBT" >> scratch/audit-evidence.md
  
  # Controllers
  echo "$ grep -rln \"@Controller\|@Get\|@Post\" apps/api/src/$M --include=*.ts | wc -l" >> scratch/audit-evidence.md
  CONTROLLERS=$(grep -rln "@Controller\|@Get\|@Post" apps/api/src/$M --include=*.ts | wc -l | tr -d ' ')
  echo "$CONTROLLERS" >> scratch/audit-evidence.md
  
  echo '```' >> scratch/audit-evidence.md
  
  # Classification
  VERDICT="STUB"
  PROOF="endpoints=$CONTROLLERS"
  
  if [ "$CONTROLLERS" -gt 0 ]; then
    if [ "$FAKE_HITS" -eq 0 ] && [ "$TESTS" -gt 0 ] && [ "$ISOLATION_DEBT" -eq 0 ]; then
       # Assume PARTIAL unless proven with curl
       VERDICT="PARTIAL"
       PROOF="needs curl proof"
    else
       VERDICT="PARTIAL"
       if [ "$FAKE_HITS" -gt 0 ]; then
         PROOF="fake_data=$FAKE_HITS"
       elif [ "$TESTS" -eq 0 ]; then
         PROOF="no tests"
       elif [ "$ISOLATION_DEBT" -gt 0 ]; then
         PROOF="isolation_debt=$ISOLATION_DEBT"
       fi
    fi
  else
    VERDICT="STUB"
    PROOF="no endpoints"
  fi
  
  # Check for completely empty stubs
  if [ "$FAKE_HITS" -eq 0 ] && [ "$TESTS" -eq 0 ] && [ "$CONTROLLERS" -eq 0 ]; then
    VERDICT="STUB"
  fi
  # Re-evaluate STUB if it has fake data hits but no endpoints (it's scaffolding)
  if [ "$CONTROLLERS" -eq 0 ] && [ "$FAKE_HITS" -gt 0 ]; then
    VERDICT="STUB"
    PROOF="fake_data, no endpoints"
  fi

  if [ "$VERDICT" == "PARTIAL" ]; then PARTIAL=$((PARTIAL+1)); fi
  if [ "$VERDICT" == "STUB" ]; then STUB=$((STUB+1)); fi
  # No WORKING yet, as we need manual curl proof for those
  
  echo "| $M | $VERDICT | $FAKE_HITS | $TESTS | $ISOLATION_DEBT | $PROOF |" >> scratch/audit-table.md
  echo "" >> scratch/audit-evidence.md
done

cat scratch/audit-evidence.md > scratch/audit-final.md
echo "## Honest Table" >> scratch/audit-final.md
cat scratch/audit-table.md >> scratch/audit-final.md
echo "" >> scratch/audit-final.md
echo "WORKING: 0 (pending curl verification)" >> scratch/audit-final.md
echo "PARTIAL: $PARTIAL" >> scratch/audit-final.md
echo "STUB: $STUB" >> scratch/audit-final.md

