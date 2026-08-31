# Prompt 01 — Data model foundation for the large-fleet modules

Build the Prisma schema + migration for every new entity the big-fleet features need, BEFORE any UI.
Schema first = a solid foundation for prompts 02–10. Rules: commit per step, `tsc --noEmit`=0, real
migration (not a one-off SQL), every model carries `companyId` for RLS. Do NOT fake data.

## Add these Prisma models (in `apps/api/prisma/schema.prisma`)
All tenant-scoped (`companyId`, indexed `@@index([companyId])`), timestamps, relations to existing
`Trip`, `Vehicle`, `Driver`, `Invoice`.

- **TripDesk** — `tripId`, `desk` (enum: DISPATCH|DIESEL|FASTAG|WORKSHOP|DOCS), `status`
  (PENDING|DONE), `completedBy`, `completedAt`, `notes`.
- **FuelEntry** — `tripId`, `vehicleId`, `driverId`, `litres`, `amount`, `pump`, `slipNo`,
  `expectedLitres`, `variancePct`, `filledAt`.
- **LoadingEvent** — `tripId`, `type` (LOAD|UNLOAD), `point`, `timeIn`, `timeOut`, `weightIn`,
  `weightOut`, `hamaliCost`, `detentionHrs`, `detentionCharge`.
- **Tyre** — `vehicleId`, `position` (e.g. FL,FR,RL1...), `serialNo`, `brand`, `fittedAtKm`,
  `expectedLifeKm`, `cost`, `status` (ACTIVE|REMOVED), `removedAtKm`.
- **MaintenanceJob** — `vehicleId`, `tripId?`, `type`, `vendorId?`, `labourCost`, `odometer`,
  `openedAt`, `closedAt`, `status`. (Upgrade existing Maintenance if present.)
  - **JobPart** — `jobId`, `name`, `qty`, `unitCost`, `amount`.
- **DriverScore** — `driverId`, `tripId`, `onTime`, `podUploaded`, `fuelScore`, `damageScore`,
  `behaviourScore`, `total`, `ratedBy`, `ratedAt`. (Running score aggregates from these.)
- **TripExpense** — `tripId`, `category` (BHATTA|TOLL|MISC), `amount`, `note` (if not already present).

Add matching enums. Wire relations both ways (e.g. `Trip.desks`, `Vehicle.tyres`, `Driver.scores`).

## Migrate + seed
```bash
cd apps/api
npx prisma migrate dev --name large_fleet_models
npx prisma generate
```
Extend `prisma/seed.ts` with a FEW realistic Indian rows for each new model tied to existing seeded
trips/vehicles/drivers (e.g. fuel entries with expected vs actual, a couple of tyres per truck, one
workshop job with 2 parts, driver scores on completed trips, trip desks per trip). Then:
```bash
npx prisma db seed
psql "$DATABASE_URL" -c "select count(*) from \"FuelEntry\";"
psql "$DATABASE_URL" -c "select count(*) from \"TripDesk\";"
psql "$DATABASE_URL" -c "select count(*) from \"Tyre\";"
```

## VERIFY / REPORT
Paste: `migrate` success, `prisma generate` ok, `tsc --noEmit`=0, and the three non-zero SQL counts.
No UI yet — this prompt is the foundation. Do NOT say done if migration failed or counts are 0.
