#!/bin/bash
# A simple script to flag tx.<model>.create/update missing assertTenantOwned or findFirst

EXIT_CODE=0

echo "Running Tenant Isolation Check..."

# Find all service files
FILES=$(find apps/api/src -name "*.service.ts")

for FILE in $FILES; do
  # Grep for tx.<model>.create or update
  if grep -qE "tx\.[a-zA-Z]+\.(create|update)\(\{" "$FILE"; then
    # If the file has a create/update, check if it imports assertTenantOwned or uses findFirst/findUnique with companyId
    if ! grep -qE "assertTenantOwned|findFirst|findUnique" "$FILE"; then
      # Very basic check: If it has foreign keys (Id:) but no tenant validation at the file level
      if grep -qE "[a-zA-Z]+Id\s*:" "$FILE"; then
         echo "⚠️  WARNING: $FILE contains tx.model.create/update with potential foreign keys but lacks assertTenantOwned or findFirst."
         EXIT_CODE=1
      fi
    fi
  fi
done

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Tenant Isolation Check Passed."
else
  echo "❌ Tenant Isolation Check Failed. Please use assertTenantOwned to validate foreign keys."
fi

exit $EXIT_CODE
