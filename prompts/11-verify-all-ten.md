# Prompt 11 — VERIFY all 10 (boot everything, prove each with real data + a screenshot)

The 10 modules' CODE is in place (models, migrations, controllers, computed logic all look real). But
nothing has been run — DB down, servers down, zero screenshots. Code existing is NOT the same as working.
This prompt boots the stack, seeds real data, and PROVES each of the 10 with a curl (real computed
numbers) + a fresh screenshot. Rules: never fake data, never weaken a check; a described result is not a
result; a blank/login screenshot does not count.

## STEP 0 — clean up + bring the stack up
```bash
cd ~/Desktop/PariLink
rm -f apps/api/count.js            # scratch file left by verification, delete it
docker compose up -d               # postgres + redis + minio
cd apps/api
npx prisma migrate deploy          # apply large_fleet_models migration
npx prisma generate
npx prisma db seed                 # must seed the NEW tables too (see Step 1)
npm run start:prod &               # api on :8080
cd ../web && npm run build && npm run start &   # web on :3000
```
Confirm: `curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/v1/health` = 200, web = 200.
`npx tsc --noEmit` in both apps/api and apps/web = 0 errors.

## STEP 1 — seed must fill the new tables (with a few DELIBERATE anomalies)
Ensure `prisma/seed.ts` creates, tied to existing trips/vehicles/drivers:
- TripDesks (5 per trip), FuelEntries **including 2–3 with high variance** (so the anomaly engine has
  something to flag), LoadingEvents (with detention), Tyres (few per truck), a MaintenanceJob + JobParts,
  DriverScores on completed trips.
Prove counts (via Prisma, not psql — psql isn't installed):
```bash
cd ~/Desktop/PariLink/apps/api
node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();(async()=>{for(const m of ['tripDesk','fuelEntry','loadingEvent','tyre','maintenanceJob','jobPart','driverScore'])console.log(m, await p[m].count());await p.\$disconnect()})()"
```
All counts must be > 0.

## STEP 2 — curl each feature (real computed output, not empty/dummy)
Login for a token first, then hit each. Each must return REAL numbers:
1. Trip Desks — `GET /trips/:id/desks` → 5 desks; `POST /trips/:id/close` with a pending desk → 422.
2. Loading — `GET /trips/:id/loading` → events with computed detention/hamali.
3. Bilty — `GET /bilty/:id/pdf` → Content-Type application/pdf, non-zero size.
4. Fuel — `GET /trips/:id/fuel` → entries with expectedLitres + variancePct computed.
5. Workshop/Tyre — `GET /vehicles/:id/jobs` (labour+parts total), `GET /vehicles/:id/tyres` (cost/km).
6. Per-Truck P&L — `GET /profitability/vehicles` → per-truck revenue/costs/netProfit, non-zero.
7. Driver Score — `GET /drivers/:id/score` → running score + breakdown.
8. Fuel Anomaly — `GET /intelligence/fuel/anomalies` → entries with cause buckets (MECHANICAL/DRIVER/
   INVESTIGATE) computed from the high-variance seed.
9. Bulk Import — `POST /import/vehicles` a tiny CSV with 1 bad row → imported good + reported bad.
10. Copilot — `POST /ai/copilot/sessions/:id/chat` "who is my worst diesel driver?" → real answer.

## STEP 3 — screenshot each screen (the gate)
Fresh captures (mtime after boot; not the login page) into `demo-shots/`:
Trip detail (desks panel + loading + fuel), Bilty PDF, Vehicle detail (Workshop + Tyres tabs),
Per-Truck Profit list, Driver scorecard, Fuel Anomaly feed, Import screen, AI Copilot answer.
Also run the crawler: `cd apps/web && npx tsx tests/crawl.ts` → 0 failures.

## REPORT (paste all — or it is NOT done)
- health 200 (api+web), tsc=0 both, crawl=0.
- the 7 Prisma counts (all > 0).
- the Step-2 curl outputs (real numbers; the 422; the PDF type+size; the anomaly causes).
- the fresh screenshot filenames.
Do NOT say done if the stack didn't boot, any count is 0, any endpoint returns empty/dummy/error, or a
screen is blank. Claude will open the screenshots and check each feature against real seeded data.
