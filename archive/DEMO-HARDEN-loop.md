# PariLink — DEMO-HARDEN THE WHOLE APP (looped until zero crashes)

GOAL: the client will drive the ENTIRE product live for 1+ hour, clicking anywhere. Nothing
may crash, white-screen, hang on a "thinking…"/loading spinner, show an empty list, or throw a
500 — anywhere they click. This is a LOOP: sweep the whole app → fix every failure → commit →
re-sweep → repeat until the whole-app sweep is 100% clean twice in a row.

"Won't crash" is the goal, not "every feature is deep." Do NOT build new features. Make what
exists robust and populated.

=====================================================================
# ANTI-THRASH RULES (these are why past rounds failed — obey them)
=====================================================================
1. **Commit after EVERY route/module fixed.** `git add -A && git commit -m "..."`. Uncommitted
   work gets wiped — it already happened once. Never batch a whole phase into one commit.
2. **Pin deps ONCE, install ONCE.** No `rm -rf node_modules`, no deleting `package-lock.json`,
   no reinstall loops. langchain is pinned: `langchain@0.1.37 @langchain/core@0.1.63
   @langchain/openai@0.0.33 @langchain/anthropic@0.1.20`.
3. **No `as any` to pass tsc. No fake/`Math.random`/lorem data to fill a screen.** If it doesn't
   compile, fix the type. If a screen is empty, SEED real data.
4. One fix → prove it → commit → next. The loop below is the structure; follow it exactly.

=====================================================================
# PHASE 0 — stabilize (build runs, server stays up)
=====================================================================
- Pin the langchain versions above; single `npm install --legacy-peer-deps`.
- Restore the `LorryReceipt` + `LrSequence` Prisma models (recover from git history or
  reconstruct from `lorry-receipts.service.ts`), `prisma migrate dev`, remove EVERY
  `(x as any).lorryReceipt` cast.
- `npx tsc -p tsconfig.build.json --noEmit` = 0 (both apps). `npm run build` succeeds.
- `docker compose up -d`, migrate, seed, `start:prod` → `curl health` = 200.
Commit: `chore: stabilize build + LR model`. Paste tsc + health.

=====================================================================
# PHASE 1 — GLOBAL SAFETY NETS (so nothing CAN crash or hang)
=====================================================================
These four guarantee that even an unforeseen click cannot break the demo:
1. **Global React ErrorBoundary** wrapping the whole app, PLUS a per-route boundary. Any render
   error shows a friendly "Something went wrong" panel with a Retry — NEVER a white screen.
2. **Global API error handling** (axios/fetch interceptor + React Query `onError`): any failed
   request shows an inline empty/error state — NEVER an unhandled promise rejection or crash.
3. **Kill infinite "thinking"/loading:** every data hook gets a timeout (e.g. 10s) and an error
   fallback. A request that hangs resolves to an error state, not a spinner forever. Audit every
   `isLoading` that has no error/timeout branch and fix it.
4. **Reusable `<EmptyState>` + loading skeleton**; every `.map()` over API data is
   `Array.isArray(x) ? … : <EmptyState/>`. Grep every `.map(` on fetched data and guard it.
Commit each of the four separately. This phase is the core of "it can't crash."

=====================================================================
# PHASE 2 — SEED EVERYTHING (no empty screens anywhere)
=====================================================================
One idempotent seed that populates EVERY module's tables with realistic Indian data so no list
is ever empty during the demo: transporters, drivers, vehicles (GJ-01-AB-1234…), customers,
loads/bookings across Mumbai→Delhi / Pune→Nagpur / Ahmedabad→Surat, trips (incl ≥1 loss-making),
invoices, payments, lorry receipts, documents/PODs, maintenance, fuel, fastag, GST records,
notifications, chat threads, support tickets, warehouse/yard, etc.
Target: every list screen shows ≥5 realistic rows. Seed twice → identical counts (idempotent).
Commit: `feat: full demo seed (Indian data, all modules)`.

=====================================================================
# PHASE 3 — THE LOOP: whole-app sweep until zero problems
=====================================================================
Enumerate EVERY route in `apps/web/src/app` and EVERY GET endpoint in the API.
Write a Playwright sweep that visits every page and records, per route:
- HTTP 200 and a known content selector is visible (rendered), 
- `0` console errors, `0` uncaught exceptions,
- NOT stuck loading > 8s (no infinite spinner),
- NOT an empty state where Phase 2 seeded data.
And a curl/jest sweep over API GETs: no 5xx; POST `{}` → 400 not 500.

Emit a table: `route | renders | console-errors | 5xx | verdict`.
For EVERY fail: fix the root cause (guard, endpoint, seed gap, boundary), commit that fix, re-run
that route. Then re-run the FULL sweep.

**Loop exit:** repeat the entire sweep until it is 100% green (every route renders, 0 console
errors, 0 uncaught, 0 5xx, no unexpected empties) **TWICE in a row**. Paste both green sweeps.
Report the running tally each pass: `routes total=N  passing=M  failing=(list)`.

=====================================================================
# PHASE 4 — ENDURANCE (survive a 1hr+ demo)
=====================================================================
- Keep server + web up; run the Playwright sweep on a loop for **90 minutes** (or a scripted
  soak that repeatedly walks every module). Watch API memory (`process.memoryUsage`/container
  stats) — it must stay flat, not climb to a crash.
- `curl health` every 5 min throughout → 200 every time.
- Fix any handler that leaks memory or throws under repeated use.
Commit: `perf: 90-min soak stable`. Paste start/end memory + the health checks.

=====================================================================
# PHASE 5 — no-fake-data pass (nothing looks faked on screen)
=====================================================================
Remove any visible `Math.random`, lorem, or placeholder data from screens that render during the
demo (keep jitter only in genuinely-live sim like a map animation, and label it). Dashboard tiles
show real seeded numbers — spot-check 3 tiles against SQL. Commit.

=====================================================================
# DONE = the "it can't happen" guarantee (as strong as software allows)
=====================================================================
Paste ALL of:
- Whole-app Playwright sweep 100% green TWICE (every route renders, 0 console errors, 0 5xx).
- 90-minute soak: server + web up throughout, memory flat, health 200 every check.
- Every left-nav item leads to a screen that renders with data.
- `tsc --noEmit` both apps = 0; `npm run build` both = 0.
- `git log --oneline` showing a commit per fix (proof nothing was lost).

Only when all of that is pasted is the app demo-hardened. Report per phase, raw output above
every "done", commit after every fix. Claude will re-run the sweep and check the commit log.
