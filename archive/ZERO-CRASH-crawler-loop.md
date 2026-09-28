# PariLink — ZERO CRASHES ANYWHERE. Crawl every screen + every button, fix the whole class, loop till clean.

Every crash you've hit is ONE bug repeated: a component reads a field the API doesn't return
(`invoice.subtotal`, `trip.plannedDeparture`, …) → `undefined.toLocaleString()` → boundary. We
stop playing whack-a-mole. This does two things: (1) a global formatter so a missing field can
NEVER crash again, and (2) an automated crawler that opens every page and clicks every button,
catches every error, and loops until a full crawl is 100% clean — twice.

Same rules that work: commit after each block, no dep churn, align the component to the real API
shape (never fake data to fit a broken component), `tsc --noEmit` = 0 throughout.

## PART A — kill the class at the root: safe formatters everywhere
1. Create `apps/web/src/lib/format.ts`:
```ts
export const money = (v: unknown, cur = '₹') =>
  `${cur}${Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-IN') : '0'}`;
export const num = (v: unknown) =>
  Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-IN') : '0';
export const dateIN = (v: unknown) => {
  const d = v ? new Date(v as string) : null;
  return d && !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN') : '—';
};
```
2. Replace unguarded formatters app-wide with these — they never throw on null/undefined/NaN:
   - `X.toLocaleString()` money/number renders → `num(X)` or `money(X)`.
   - `new Date(X).toLocaleDateString(...)` → `dateIN(X)`.
   Find remaining offenders and fix each (by hand or careful codemod):
```bash
cd ~/Desktop/PariLink/apps/web
grep -rnE "\.toLocaleString\(|toLocaleDateString\(|\.toFixed\(" src --include=*.tsx | grep -vE "format\.ts|CountUp|num\(|money\(|dateIN\("
```
   Target zero rows (except the format.ts definitions / intentional guarded ones). `tsc --noEmit`=0.
Commit: `refactor: safe money/num/date formatters, no field can crash a render`.

## PART B — the crawler: open EVERY page + click EVERY button, catch EVERY error
Write `apps/web/tests/crawl.ts` (Playwright, headless) that:
1. Logs in as `admin@parilink.in` / `password123`.
2. Builds the full route list: every static route under `src/app/(dashboard)`, PLUS dynamic
   `[id]` routes filled with 3 REAL ids per entity (fetch ids via the API for loads, trips,
   invoices, customers, vehicles, drivers, warehouses, orders, lorry-receipts, payments…).
3. For EACH route: attach listeners BEFORE navigating —
   - `page.on('pageerror', …)` (uncaught JS),
   - `page.on('console', m => m.type()==='error' && …)` (React/runtime errors),
   - `page.on('response', r => r.status()>=500 && …)` (server errors),
   - after load, scan body text for `Dashboard View Error`, `Permission Denied`, `Invalid Date`,
     `NaN`, `undefined`.
   Record every hit as `{route, kind, message}`.
4. For each route, click every SAFE actionable control — buttons/links that open a form, generate,
   print, export, record, filter, tab — and re-check the same listeners. **Skip destructive
   controls** (Delete/Remove/Confirm) so no seeded data is wiped.
5. Write `crawl-report.json` with every failure, and exit non-zero if the list is non-empty.
Run it: `npx tsx apps/web/tests/crawl.ts`. Paste the failure list.

## PART C — the fix loop (this is the whole point)
For EVERY failure in `crawl-report.json`, fix the ROOT cause:
- render crash / Invalid Date / NaN → the component reads a field the API omits. Align the
  component's type to the real API response and use the Part-A formatters. Do NOT guess field
  names — hit the real endpoint (`curl … | jq`) and match it.
- 500 on an action → fix the backend handler (paste the real error from `/tmp/api.log`).
- Permission Denied → add the correct `@RequirePermissions` (mirror a working sibling).
After a batch of fixes: `tsc --noEmit`=0, rebuild, re-run the crawler. **Repeat until crawl-report
is EMPTY twice in a row.** Commit after each batch. Report the failure count dropping each pass:
`pass 1: N failures → pass 2: M → … → 0`.

## PART D — final proof (screenshots I will open)
Once the crawler is clean twice, screenshot every list AND every detail page AND the key actions
(generate bilty, record payment, generate invoice, print LR) into `demo-shots/` and `demo-shots/detail/`,
freshness-gated (every file mtime newer than run start = FRESH). Re-run the 5× soak.
Commit: `test: zero-crash crawl clean, all screens + actions verified`.

## Report
Paste: the Part-A grep at zero, the crawler's `pass N → 0` progression, `tsc`=0, and the fresh
screenshot list. Do NOT say "done" while crawl-report has a single entry. Claude will open the
detail + action screenshots and re-run the crawl grep against the repo — a boundary or "Invalid
Date" in any shot means not done.

## Still parked for after the demo: durable RLS on fresh `docker compose down -v`; revoke the 5 keys.
