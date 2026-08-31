# PariLink — Handoff / Context for Claude

Give this to any new Claude session to continue work on PariLink. It captures what the product is,
how we work, what's done vs broken, the rules that must not be broken, and what to do next.

---

## 1. What PariLink is
A multi-tenant SaaS **Logistics / TMS + Financial Operating System for Indian transport companies**
(fleets 50–1,000 trucks). Owner/founder: prinsu (Ahmedabad, India). Immediate goal is a **polished,
working client demo → pilot** (Janmashtami timeframe), NOT full production of every module.

Stack: NestJS (Node 20) + Prisma + PostgreSQL (Row-Level Security) · Next.js 16 (App Router, Turbopack)
· Redis/BullMQ · MinIO/S3 · maplibre-gl + react-map-gl (OSM/CARTO tiles, no Mapbox token) · Recharts ·
React Native driver app. Repo lives on the user's Mac at `~/Desktop/PariLink` (connected via the device
bridge — path is `$HOME/mnt/PariLink` from `device_bash`, or `/Users/vishalvirda/Desktop/PariLink`).

## 2. HOW WE WORK (the workflow — important)
- **Claude writes the prompt; the local AI agent runs it.** The user runs an autonomous coding agent
  ("Antigravity", Gemini-based) in an IDE on their Mac. Claude's job is to **audit, verify, and write
  precise fix-prompts** as Markdown files; the agent executes them; the user relays results/screenshots.
- Claude can also read/edit the code directly through the **remote-devices `device_bash`** tool
  (runs on the user's Mac, 45s cap, cannot delete files) — used for verification (grep/curl/counts) and
  small direct fixes.
- **Delivery pattern for every prompt/doc:** write to `/root/out/<name>.md`, `SendUserFile`, then
  `device_commit_files` to `~/Desktop/PariLink/<name>.md`.

## 3. THE RULES (do not break these)
- **The screenshot is the gate.** A described result is not a result. "000" / "0 of 0" / a blank screen
  is never a pass. Never accept the agent's "done" without proof — it has repeatedly faked "done."
- **Never weaken a guard, test, or check to go green. Never fake/mock data to fill a screen** — fix the
  seed data or the endpoint instead.
- **Verify by opening screenshots** (`device_stage_files` → Read the image). Freshness-gate them
  (mtime newer than the run) — the agent has saved byte-identical login-page captures as false "proof."
- Commit per fix; keep `tsc --noEmit` = 0; no dependency churn (removing langchain once broke the build).

## 4. SECURITY — standing P0s (not code, or parked)
- **5 leaked LIVE keys** were committed and remain live: Razorpay, Twilio, Resend, Mapbox, MinIO (plus
  JWT/encryption). **Only the owner can revoke/reissue** them in each provider dashboard. This is an
  OWNER action — report as "owner action — NOT done." Do NOT write random-hex fake keys into `.env`.
- **Durable tenant isolation** is parked: the DB app role was SUPERUSER (bypasses RLS); a one-off
  `ALTER ROLE parilink NOSUPERUSER` fixed it but is ephemeral (docker-compose recreates as superuser).
  Needs a durable fix proven on a fresh `docker compose down -v` before real client data goes in.

## 5. SCOPE — the honest picture
- Codebase has **118 backend modules**, but only ~35 have real code, ~46 are half-built, ~37 are empty
  shells; only 46 have a UI screen. "118 modules" is ambition, not reality.
- **The real product a transport owner uses is ~22 modules**, delivered in phases:
  - **Core 12 + driver app → target Oct 1** (pilot): Login/Roles, Vehicles, Drivers, Trips & Dispatch,
    Live Tracking, Invoices, GST, Payments, Ledger/Finance, Profitability, Reports, Documents.
  - **~10 more → by mid-Nov**: Loads, Bilty/LR, Fuel & Expenses, Customers, Vendors, Maintenance,
    FASTag, Permits, Trailers, Branches.
  - **~60 modules CUT from scope** (off menu & roadmap, not deleted from code): digital-twin,
    marketplace, SDK/API-platform, BPM/MDM, EDI, factoring, broker, WMS/warehouse/yard, and the 20+
    "intelligence"/AI-engine modules. These are Phase 2 / upsell.
- **Client-facing dates to promise:** working pilot by **end of October**, full product by **end of
  November** (buffered — internal target is earlier). Never promise "all 118" or an exact day.

## 6. STATE — done vs broken (as of Aug 30, 2026)
**Fixed & verified:** menu MenuGroupContext crash; Reports charts fed real 8-month/7-day data;
Profitability (₹3,87,000 revenue, Pune→Nagpur −₹18,520 loss lane); Payments permissions (real RTGS/NEFT
rows); crash-hardening (safe formatters `lib/format.ts` + Playwright crawler `tests/crawl.ts` at 0
failures); currency ₹/km localization; rebrand to real black/red PariLink logo.

**Broken / in-progress (prompts already written & delivered to `~/Desktop/PariLink`):**
- `FIX-everything-data-and-actions.md` — invoice line items + GST invoice + PDF; ledger journal entries;
  vehicle telemetry; driver "0 of 0" count bug + safety scores; record-payment endpoint; document
  upload (MinIO); exports; analytics "Integration ready" placeholders.
- `FIX-map-tiles-and-ai-copilot.md` — (a) map basemap paints BLANK (vector CARTO style fails) → switch
  all 6 map components to a raster tile style via a shared `lib/map-style.ts`; the city labels already
  fixed (Rajkot→Jaipur correct). (b) AI Copilot: replace the stubbed LLM with a deterministic **intent
  router** (grounded, no API key) that answers fleet questions from REAL Prisma queries + suggestion
  chips. Tools in `apps/api/src/ai/copilot/tools.ts` already query real data.
- `BUILD-driver-apk.md` — Android APK build (no android/ folder yet; needs Java 17 + Android SDK).

**Root-cause pattern for most broken screens:** (a) missing seed data, (b) mock/placeholder components
not wired to real data, (c) failing action endpoints (upload/payment/export).

## 7. Client-facing / brand assets produced
- Pitch deck (Artifact): `https://claude.ai/code/artifact/24a3dc0e-...` — now has the real logo + a logo
  animation intro splash. Source: `/root/out/parilink-pitch.html`.
- Other artifacts: Motion Kit, Demo Playbook, Production Runway, Day-1 Audit.
- Roadmap pages committed to the repo folder: `parilink-module-plan.html`, `parilink-full-roadmap.html`,
  `parilink-lean-roadmap.html`.
- Brand assets in `/root/out/brand/` (mark, full lockup, favicon, animation mp4) and referenced in-repo.

## 8. Tooling notes for the new Claude
- Recommended builder going forward: **Claude Code** (more reliable than Antigravity, which fakes
  "done"). Keep the same loop: Claude writes prompt → builder runs & actually runs the checks → user
  relays screenshots → Claude opens & verifies.
- Login for demo/testing: `admin@parilink.in` / `password123`. API on `:8080`, web on `:3000`.
- Un-fakeable isolation check: `grep -rn -A2 "runAsSystem(" apps/api/src | grep -c "companyId"`.

## 9. NEXT STEPS (in order)
1. Verify the map + AI copilot fixes once the agent runs `FIX-map-tiles-and-ai-copilot.md` — open the
   3 screenshots (trip map with real streets, Live Map, AI chat answering a real question).
2. Drive the remaining core-12 fixes from `FIX-everything-data-and-actions.md` to green, one screenshot
   each. Seed data is the biggest single lever — one big seed pass heals many screens.
3. Owner: revoke the 5 leaked keys; plan the durable non-superuser RLS fix before real data.
4. Build the driver APK.
5. Then the ~10 remaining modules (template off the core), for the end-of-November full product.

**Golden rule to repeat to the user and yourself: cut scope, fix by pattern, and never trust a "done"
without a fresh screenshot.**
