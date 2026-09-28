# PariLink — make the AI Copilot actually work (grounded / demo-safe, no LLM key), then prove it

The AI Copilot UI and endpoints are already built and the tools already query REAL tenant data
(`apps/api/src/ai/copilot/tools.ts` — `search_trips`, `search_drivers`, etc. run real Prisma queries).
The ONLY broken link is the middle: the langchain agent + LLM is stubbed (`stubs/langchain.ts`,
`OPENAI_API_KEY || 'dummy-key-to-allow-boot'`, `MockAIProvider`), so a typed question never reaches a
tool and the chat just sits on "How can I assist you".

We are NOT connecting a paid LLM for the demo. Instead, replace the stubbed brain with a deterministic
**intent router**: match the question to a known fleet query, run the REAL DB query, return a clean
answer. Every answer is real data, always correct, instant, and it can never hallucinate a wrong number
in front of the client. Rules: commit per step, `tsc --noEmit`=0, do NOT fake the numbers — they must
come from real Prisma queries, and do NOT weaken any check to go green.

## STEP 1 — build the grounded router (`apps/api/src/ai/copilot/copilot-chat.service.ts`)

Replace the langchain-agent path inside `chat(companyId, userId, sessionId, message)` with a rule-based
router. Keep the existing session/message persistence (`aiChatSession` / `aiChatMessage`) — still save
the user message and the assistant reply so history works.

Router logic:
1. Lowercase the message; match against intents (keywords / simple regex). Reuse the real queries from
   `tools.ts` (or call the same Prisma reads) — do NOT invent numbers.
2. For each intent, run the query via `prisma.runAsTenant(companyId, …)` and format a short, natural
   answer in ₹ / Indian number format.
3. If nothing matches, return a friendly fallback that lists what it CAN answer (see Step 3).

Intents to support (all from real seeded data):
- **Active trips** — "active trips", "trucks running", "on road", "in progress" →
  count trips where status IN_PROGRESS + list a few (origin→destination, driver, vehicle).
- **Trip status counts** — "how many trips", "completed trips", "scheduled" → group counts by status.
- **Driver status** — "drivers", "how many drivers", "who is available", "off duty" →
  count + list active/off-duty drivers.
- **Fleet / vehicles** — "how many trucks", "vehicles", "fleet size", "idle trucks" →
  count vehicles by status (ON_TRIP / IDLE / MAINTENANCE).
- **Revenue** — "revenue", "how much did we earn", "income this month" →
  Σ invoices/payments for the current month, formatted ₹.
- **Outstanding / dues** — "pending payments", "outstanding", "who owes", "balance due" →
  Σ unpaid/partial invoice balances + top debtors.
- **Profit / loss lane** — "profit", "which lane loses money", "loss making", "most profitable" →
  best and worst lane by margin (reuse the profitability data).
- **Invoices** — "invoices", "unpaid invoices", "bills" → count + total by status.
- **Expenses** — "expenses", "fuel cost", "spending" → Σ expenses this month by category.

Each answer should be one or two clean sentences with the real figure, e.g.
`"You have 7 trips in progress right now. The next to arrive is Ahmedabad → Surat (driver Rajesh, GJ-01-AB-1234)."`
`"Revenue this month is ₹3,87,000 across 12 invoices. ₹85,000 is still outstanding from 2 customers."`

## STEP 2 — the streaming endpoint + daily brief use the same router

- `chatStream` (SSE) should call the same router and stream the answer text (chunk it word-by-word so it
  feels live). No LLM.
- `getDailyBrief` (`copilot/daily-brief`) — build a real brief from live queries: today's active trips,
  trucks idle, revenue MTD, outstanding dues, any trip flagged late. Return 3–5 real bullet lines.

## STEP 3 — suggested question chips in the UI (makes the demo effortless)

On the copilot page (`apps/web/src/app/(dashboard)/ai/...`), under the empty "How can I assist you"
state, render 5–6 clickable suggestion chips that fire known-good questions:
`How many trucks are active?` · `Show revenue this month` · `Which lane is losing money?` ·
`Who has pending payments?` · `How many drivers are available?` · `Give me today's brief`.
Clicking a chip sends that message. This guarantees the client sees perfect answers, and free typing
still works via the router. The fallback reply (unknown question) should also list these as suggestions.

## STEP 4 — keep it building
- Do NOT install a real langchain/LLM. The stub can stay; the router does not depend on it. If any
  langchain import in `copilot-chat.service.ts` blocks the build once the agent code is removed, delete
  the now-unused imports (createToolCallingAgent, AgentExecutor, ChatPromptTemplate, RunnableSequence).
- `npx tsc --noEmit` = 0.

## VERIFY — screenshots are the gate
Bring api + web up. Then:
```bash
# real answer, real data, via curl (create a session first, then chat):
SID=$(curl -s -X POST localhost:8080/api/v1/ai/copilot/sessions -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}' | jq -r '.id')
curl -s -X POST "localhost:8080/api/v1/ai/copilot/sessions/$SID/chat" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"message":"how many trucks are active?"}'
curl -s -X POST "localhost:8080/api/v1/ai/copilot/sessions/$SID/chat" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"message":"show revenue this month"}'
```
Both must return real answers with real numbers (not empty, not "dummy", not an error).
Then screenshot the copilot page showing: the suggestion chips, AND a real conversation — the owner
asked "How many trucks are active?" and got a correct data-backed answer.

## REPORT
Paste: the two curl answers (real numbers), `tsc`=0, and the fresh screenshot of a working chat with
chips. Do NOT say done if the chat still shows only "How can I assist you" or returns an empty/dummy
reply. Claude will open the screenshot and confirm the answer matches the real seeded data.

## Note (post-demo, optional)
When you later want free-form conversation, connect a real model in `llm-manager` with a FRESH key kept
in `.env` (never committed) — the router stays as the accurate-numbers layer and the LLM only handles
phrasing and off-script questions. That's the hybrid upgrade; not needed for the demo.
