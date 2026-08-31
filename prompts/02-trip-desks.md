# Prompt 02 — Trip Desks (multi-role trip workflow)

The signature feature: one trip is run by ~5 office roles, each owning a slice. A trip **cannot close
until every desk is DONE**. Needs Prompt 01 (TripDesk model) done first. Rules: commit per step,
`tsc`=0, no fake data, screenshot is the gate.

## Backend (`apps/api/src/trips` + a `trip-desks` service)
- When a Trip is created, auto-create its 5 `TripDesk` rows (DISPATCH, DIESEL, FASTAG, WORKSHOP, DOCS)
  with status PENDING.
- Endpoints (all `@RequirePermissions`, tenant-scoped):
  - `GET /trips/:id/desks` — the 5 desks + status.
  - `POST /trips/:id/desks/:desk/complete` — mark a desk DONE (records user + time + notes).
  - `GET /desks/my` — open trips where MY desk (by my role) is still PENDING — the desk worker's queue.
- **Guard trip close:** `POST /trips/:id/close` must reject (422) if any desk is PENDING, with a clear
  message listing which desks are incomplete. Only close when all 5 are DONE.

## Frontend
- **Trip detail:** a "Trip Desks" panel showing the 5 desks with status chips (Pending/Done), who
  completed each, and a "Mark done" button visible to the right role.
- **Desk home screen:** a page (e.g. `/desks`) that shows the logged-in user only the trips where their
  desk is pending — their to-do queue. Diesel manager sees diesel-pending trips, etc.
- Trip "Close trip" button disabled with a tooltip until all desks are done.

## VERIFY (screenshot gate)
- Curl: create a trip → `GET /trips/:id/desks` returns 5 PENDING → complete 4 → `close` returns 422
  listing the 1 remaining → complete the 5th → `close` returns 200.
- Screenshots: (1) Trip detail with the 5-desk panel, some Done some Pending; (2) a desk home screen
  showing that role's pending queue; (3) the blocked "close" state.
## REPORT
Paste the curl sequence (422 then 200), `tsc`=0, and the 3 screenshots. Do NOT say done if a trip can
close with a pending desk, or the desks aren't real DB rows.
