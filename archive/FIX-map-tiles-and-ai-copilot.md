# PariLink — fix the blank map tiles + make the AI Copilot work (both), then prove each with a screenshot

Two fixes in one pass. The trip map now shows the RIGHT cities (Rajkot → Jaipur) — good — but the
basemap paints BLANK (cream background, no streets). And the AI Copilot sits on "How can I assist you"
because its brain is stubbed. Fix both. Rules: commit per fix, `tsc --noEmit`=0, don't fake data, don't
weaken any check. Screenshots are the gate.

===============================================================================
## FIX 1 — the map tiles don't load (blank basemap)
===============================================================================

**Root cause.** Every map uses a CARTO **vector GL** style, e.g.
`apps/web/src/components/trips/trip-map.tsx:61-63`:
```
mapStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'  (dark-matter for dark)
```
A vector GL style needs its vector tiles + glyphs + sprites all to load; when any is blocked or
rate-limited, the map paints blank while your pins/labels (drawn on top) still show — exactly the
screenshot. Vector GL is fragile for a demo.

**The fix — switch to a raster tile style (robust, no token).** Replace the vector style URL with an
inline raster style object pointing at CARTO's RASTER tiles (or OSM). Raster almost always renders.
Do this in EVERY map component (they all share the bug):
`components/trips/trip-map.tsx`, `components/dashboard/live-map.tsx`, `components/fleet/fleet-map.tsx`,
`components/control-tower/live-map.tsx`, `app/(dashboard)/command-center/_components/LiveFleetMap.tsx`,
`app/(dashboard)/dispatch-workspace/_components/DispatchFleetMap.tsx`.

Create ONE shared helper `apps/web/src/lib/map-style.ts` and use it everywhere so there's a single
source of truth:
```ts
import type { StyleSpecification } from 'maplibre-gl';

// Raster basemap — far more reliable than vector GL styles, no API token needed.
export function rasterStyle(dark = false): StyleSpecification {
  const light = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const dk    = 'https://a.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
  const url = dark ? dk : light;
  return {
    version: 8,
    sources: {
      base: {
        type: 'raster',
        tiles: [url.replace('{r}', ''), url.replace('a.basemaps', 'b.basemaps').replace('{r}', '')],
        tileSize: 256,
        attribution: '© CARTO © OpenStreetMap contributors',
      },
    },
    layers: [{ id: 'base', type: 'raster', source: 'base' }],
  };
}
```
Then in each map component:
```tsx
import { rasterStyle } from '@/lib/map-style';
const mapStyle = rasterStyle(resolvedTheme === 'dark');   // pass the object, not a URL string
```
`react-map-gl`/maplibre accept a style object directly. If a fallback OSM source is wanted, use
`https://tile.openstreetmap.org/{z}/{x}/{y}.png` (tileSize 256) — but CARTO raster above is the primary.

**Also make sure the map has a real height.** The container must have an explicit height (e.g. the
wrapper is `h-[420px]` / `style={{height: 420}}`) and the `<Map>` uses
`style={{width:'100%',height:'100%'}}` — a 0-height parent shows blank too.

**Keep the branded fallback.** If tiles still fail to load within ~4s (`onError` / a timeout), show the
existing branded India panel so the screen is NEVER blank.

**Proof for FIX 1:** open the Rajkot → Jaipur trip → the basemap now shows actual streets/land under the
two pins, not a cream box. Screenshot it. Also screenshot the Live Map with the raster basemap visible.

===============================================================================
## FIX 2 — AI Copilot answers from real data (grounded, no LLM key)
===============================================================================

The copilot UI + endpoints are built and the tools in `apps/api/src/ai/copilot/tools.ts` already run
REAL Prisma queries. The only broken link is the stubbed LLM in the middle
(`stubs/langchain.ts`, `OPENAI_API_KEY || 'dummy-key-to-allow-boot'`), so questions never reach a tool.
We are NOT wiring a paid LLM for the demo. Replace the stubbed brain with a deterministic **intent
router**: match the question → run the real query → return a clean ₹-formatted answer. Always correct,
instant, can never hallucinate a wrong number in front of the client.

**Build it in `apps/api/src/ai/copilot/copilot-chat.service.ts`** — inside `chat(companyId,userId,
sessionId,message)`, replace the langchain-agent path with a router. Keep saving user + assistant
messages to `aiChatSession`/`aiChatMessage` so history works. Intents (all from real seeded data, via
`prisma.runAsTenant(companyId, …)` — reuse the queries in tools.ts, do NOT invent numbers):

- **Active trips** — "active", "running", "on road", "in progress" → count IN_PROGRESS + list a few
  (origin→destination, driver, vehicle).
- **Trip counts by status** — "how many trips", "completed", "scheduled".
- **Drivers** — "drivers", "available", "off duty" → count + list.
- **Fleet/vehicles** — "trucks", "vehicles", "idle" → count by status.
- **Revenue** — "revenue", "earned", "income this month" → Σ invoices/payments this month, ₹.
- **Outstanding** — "pending", "outstanding", "who owes", "balance due" → Σ unpaid balances + top debtors.
- **Profit/loss lane** — "profit", "loss making", "which lane" → best & worst lane by margin.
- **Invoices** — "invoices", "unpaid bills" → count + total by status.
- **Expenses** — "expenses", "fuel", "spending" → Σ this month by category.

Answers = 1–2 clean sentences with the real figure, e.g.
`"7 trips are in progress. Next to arrive: Ahmedabad → Surat (Rajesh, GJ-01-AB-1234)."`
`"Revenue this month is ₹3,87,000 across 12 invoices; ₹85,000 is still outstanding."`
Unknown question → friendly fallback listing what it CAN answer.

- `chatStream` (SSE) uses the same router, streamed word-by-word. `copilot/daily-brief` returns 3–5 real
  bullet lines (active trips, idle trucks, revenue MTD, dues, any late trip).
- Do NOT install a real LLM. Delete now-unused langchain imports if they block the build. `tsc`=0.

**Suggestion chips (UI).** On the copilot page under "How can I assist you", render 5–6 clickable chips
that fire known-good questions: `How many trucks are active?` · `Show revenue this month` ·
`Which lane is losing money?` · `Who has pending payments?` · `How many drivers are available?` ·
`Give me today's brief`. Clicking sends that message. Free typing still works.

**Proof for FIX 2 (curl real answers):**
```bash
SID=$(curl -s -X POST localhost:8080/api/v1/ai/copilot/sessions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | jq -r '.id')
curl -s -X POST "localhost:8080/api/v1/ai/copilot/sessions/$SID/chat" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"message":"how many trucks are active?"}'
curl -s -X POST "localhost:8080/api/v1/ai/copilot/sessions/$SID/chat" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"message":"show revenue this month"}'
```
Both must return real answers with real numbers. Then screenshot the copilot showing the chips AND a
real conversation with a correct data-backed answer.

===============================================================================
## VERIFY (both) — screenshots are the gate
===============================================================================
Bring api + web up (200 each). `cd apps/web && npx tsc --noEmit && npx tsx tests/crawl.ts`  → 0 failures.
Capture fresh screenshots (mtime newer than run start — a blank/login capture does NOT count):
1. Trip map — real streets/land visible under the Rajkot→Jaipur pins (not a cream box).
2. Live Map — raster basemap visible with fleet pins.
3. AI Copilot — suggestion chips + a real answered question.

## REPORT
Paste: the two copilot curl answers (real numbers), `tsc`=0, crawl=0, and the 3 fresh screenshot names.
Do NOT say done while the map is still a blank cream box or the chat returns empty/dummy. Claude will
open all three screenshots and confirm the basemap paints and the AI answer matches the real seeded data.
