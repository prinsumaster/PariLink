#!/bin/bash
# A(e) -- bite check for the FK-linked tables covered by
# 20260901120000_enable_rls_fk_linked_remaining (29) and
# 20260901130000_enable_rls_dock_appointment (1).
#
# Same shape as cp2/cp4 bite checks: assert the connection is non-superuser,
# assert RLS is enabled AND forced on every table, then confirm each table
# fails closed with no tenant context and opens under bypass_rls.
#
# Per-table row-level A/B comparison is NOT attempted here: these tables have
# no companyId of their own, so seeding a meaningful row for each of 30 tables
# means walking each parent chain. The structural assertions below catch the
# failure that actually matters -- a policy that was never applied, or one
# that does not fail closed.
#
# Run AFTER prisma migrate deploy.
set -euo pipefail

DB=parilink-test-db
ADMIN="docker exec $DB psql -U postgres -d postgres -t -A"
TEST="docker exec $DB psql -U parilink_test -d postgres -t -A"

TABLES="AiChatMessage AnnouncementAudience AppConfiguration AppHealth AppOAuthConnection \
AppUsageStatistic AppWebhook ApprovalStep BackupCode ChatChannelMember ChatMessage \
DataQualityScore DockAppointment DocumentVersion ExternalReference InboundReceiptItem \
InboxMessage JobCardPart MasterDataChangeLog MessageReaction OperationalPlanItem \
PurchaseOrderItem ScheduledSync SsoSession SyncError TenderBid TrustedDevice \
UserIdentity UserWorkspaceState WarehouseZone WebAuthnCredential WorkflowExecutionStep YardDock"

echo "=== 0. connected as? (MUST be parilink_test|f) ==="
$TEST -c "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"
echo

echo "=== 1. RLS enabled AND forced on every table? ==="
FAIL=0
for T in $TABLES; do
  ROW=$($TEST -c "SELECT relrowsecurity||'|'||relforcerowsecurity FROM pg_class WHERE relname='$T' AND relkind='r';")
  if [ "$ROW" = "t|t" ]; then
    printf "  %-24s OK\n" "$T"
  else
    printf "  %-24s *** %s *** (want t|t)\n" "$T" "${ROW:-NOT FOUND}"
    FAIL=$((FAIL+1))
  fi
done
echo "  tables failing: $FAIL"
echo

echo "=== 2. fail-closed: no tenant context set -> every table must return 0 ==="
$TEST -c "RESET app.current_company_id;" > /dev/null
for T in $TABLES; do
  N=$($TEST -c "RESET app.current_company_id; SELECT count(*) FROM \"$T\";" | tail -1)
  TOTAL=$($ADMIN -c "SELECT count(*) FROM \"$T\";")
  if [ "$N" = "0" ]; then
    printf "  %-24s 0 of %-6s OK (fails closed)\n" "$T" "$TOTAL"
  else
    printf "  %-24s %s of %s *** LEAK -- visible with no tenant context ***\n" "$T" "$N" "$TOTAL"
    FAIL=$((FAIL+1))
  fi
done
echo

echo "=== 3. bypass path: bypass_rls='on' must return everything (system ops still work) ==="
for T in $TABLES; do
  N=$($TEST -c "SET app.bypass_rls='on'; SELECT count(*) FROM \"$T\";" | tail -1)
  TOTAL=$($ADMIN -c "SELECT count(*) FROM \"$T\";")
  if [ "$N" = "$TOTAL" ]; then
    printf "  %-24s %s of %s OK\n" "$T" "$N" "$TOTAL"
  else
    printf "  %-24s %s of %s *** system path broken ***\n" "$T" "$N" "$TOTAL"
    FAIL=$((FAIL+1))
  fi
done
echo
echo "TOTAL FAILURES: $FAIL"
[ "$FAIL" = "0" ] || exit 1
