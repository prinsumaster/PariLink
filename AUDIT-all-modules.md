# PariLink — HONEST module audit (evidence required, no claims)

Produce a truthful inventory of EVERY module: what actually works, what's a stub, what's
missing. Do NOT fix anything yet — audit first so we know the real scope. Every verdict needs
pasted evidence (commands + output). A verdict with no evidence pasted above it is rejected.
"STUB" and "PARTIAL" are fine answers — a false "WORKING" is not.

## Step 1 — list every module
```bash
cd ~/Desktop/PariLink
ls apps/api/src            # backend modules
ls apps/web/src/app        # frontend pages/routes
```

## Step 2 — for EACH backend module, gather evidence (paste raw output)
```bash
M=<module>
echo "### $M"
# fake / placeholder data (stub signals):
grep -rn "Math.random\|TODO\|FIXME\|NotImplemented\|throw new Error('Not\|mock\|hardcoded\|return \[\];" apps/api/src/$M --include=*.ts | wc -l
# real tests present:
find apps/api/src/$M apps/api/test -name "*$M*spec.ts" 2>/dev/null | wc -l
# isolation debt (runAsSystem using companyId in body):
grep -rn -A2 "runAsSystem(" apps/api/src/$M --include=*.ts | grep -c companyId
# does it have real controllers/endpoints:
grep -rln "@Controller\|@Get\|@Post" apps/api/src/$M --include=*.ts | wc -l
```

## Step 3 — classify each module with a one-line evidence justification
Use exactly three verdicts, and be strict:
- **WORKING** = has real endpoints, returns real DB data (NOT Math.random/hardcoded), and you
  proved it with a live `curl` returning real rows. Paste that curl.
- **PARTIAL** = endpoints exist but some data is faked/hardcoded, OR no tests, OR isolation debt.
- **STUB** = scaffolding only — fake data, empty returns, or not wired to anything real.

## Step 4 — the honest table (this is the deliverable)
One row per module:

| Module | Verdict | Fake-data hits | Tests | isolation debt | Proven by (curl/file:line) |
|--------|---------|----------------|-------|----------------|----------------------------|

Then three counts: how many WORKING, how many PARTIAL, how many STUB.

## Step 5 — frontend reality check
For each page in `apps/web/src/app`: does it fetch a real API, or render static/placeholder
data? `grep -rn "Math.random\|placeholder\|lorem\|TODO\|mockData\|const data = \[" apps/web/src`.
List which screens are real vs mockups.

## Rules
- No writing/fixing code in this pass. Audit only.
- No verdict without its pasted command output.
- If you can't prove WORKING with a live curl, it is PARTIAL or STUB — not WORKING.
- Paste the final table + the 3 counts + the frontend list. That's the whole job.

Claude will re-run these same greps against the repo and check your table against the evidence.
