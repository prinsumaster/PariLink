# PariLink — close Section A

Three items remain. Two are unfinished proofs, one is a latent bug the last
round introduced. Same rules: one fix, one proof, raw output, no summaries,
never weaken a control or edit a test expectation.

---

## ITEM 1 — The two seed files now disagree about the admin password

`seed-demo.ts` was changed to set `password123`. But `seed.ts` is what
originally put `Password123!` in the database. Both still exist. Whichever runs
last wins, so the test suites will silently break again the next time anyone
runs the base seed.

### 1a — Show the conflict
```
grep -rn "password\|bcrypt\|hash" apps/api/prisma/seed.ts | head -20
grep -rn "admin@parilink.com" apps/api/prisma/seed.ts
grep -n "prisma" apps/api/package.json | head -20
sed -n '/"prisma"/,/}/p' apps/api/package.json
```
Paste all of it. State: what password does `seed.ts` set for
`admin@parilink.com`, and which file does `prisma db seed` actually invoke?

### 1b — Make one file the source of truth
Both seeds must produce the same credential. Pick `password123` (the tests and
`global.setup.ts` already use it) and make `seed.ts` set that too. Do not delete
either seed. Do not change any test.

### 1c — PROVE IT (order independence is the point)
```
cd apps/api
npx ts-node prisma/seed.ts
npx ts-node prisma/seed-demo.ts
npx jest --config ./test/jest-e2e.json test/dto-validation.e2e-spec.ts 2>&1 | tail -6
echo "ORDER_A_EXIT=${PIPESTATUS[0]}"

npx ts-node prisma/seed-demo.ts
npx ts-node prisma/seed.ts
npx jest --config ./test/jest-e2e.json test/dto-validation.e2e-spec.ts 2>&1 | tail -6
echo "ORDER_B_EXIT=${PIPESTATUS[0]}"
```
BOTH must be 0. If only one is, the seeds are still fighting.

---

## ITEM 2 — The container asset proof was described, not pasted

The last report said: "Curl correctly matched `type="email"` with 0 counts on
/login". Zero matches is not a match. Either the login form is absent from the
container's HTML, or the count was misread. Also, only three `woff2` font URLs
were tested — fonts are not what breaks. The JS and CSS chunks are.

Re-run and PASTE THE RAW OUTPUT, no commentary:
```
docker run -d -p 3100:3000 --name pl-verify parilink-web:latest
sleep 10
echo "--- status ---"
curl -s -o /dev/null -w "login:%{http_code}\n" http://localhost:3100/login
echo "--- email input count ---"
curl -s http://localhost:3100/login | grep -c 'type="email"'
echo "--- html size ---"
curl -s http://localhost:3100/login | wc -c
echo "--- first 3 JS chunks ---"
curl -s http://localhost:3100/login | grep -oE '/_next/static/chunks/[^"]+\.js' | head -3
echo "--- first 2 CSS files ---"
curl -s http://localhost:3100/login | grep -oE '/_next/static/css/[^"]+\.css' | head -2
```
Then curl EVERY url printed by the last two blocks and paste each status:
```
for u in <paste each url here>; do
  curl -s -o /dev/null -w "$u -> %{http_code}\n" "http://localhost:3100$u"
done
```
If the email input count is 0, ALSO paste:
```
curl -s http://localhost:3100/login | head -c 1500
docker logs pl-verify 2>&1 | tail -30
```
Then: `docker rm -f pl-verify`

A 404 on any chunk or css file is the finding. Report it, do not fix it.

---

## ITEM 3 — Why the smoke suite cannot log in

It times out at `global.setup.ts:18` waiting for `input[type="email"]` on
localhost:3000. But a dev server on 3000 served that input fine last round
(`grep -c` returned 1). The most likely cause is that nothing starts the app
during the test run.

### 3a
```
cat apps/web/playwright.config.ts
```
Paste the WHOLE file. Specifically: is there a `webServer` block?

### 3b
```
lsof -i :3000 || echo "NOTHING LISTENING ON 3000"
```

### 3c — Run the suite with the app actually up
```
cd apps/web
(npm run dev > /tmp/webdev.log 2>&1 &)
sleep 25
curl -s -o /dev/null -w "preflight login:%{http_code}\n" http://localhost:3000/login
curl -s http://localhost:3000/login | grep -c 'type="email"'
npm run test:e2e; echo "SMOKE_EXIT=$?"
pkill -f "next dev" || true
```
Paste the preflight numbers, the Playwright summary line, and the name of every
failing spec. Do NOT delete, skip, or `.fixme` any failing spec.

If it now passes, the finding is that `playwright.config.ts` has no `webServer`
block and the suite has never been runnable on its own. Say so.

---

## Report
Table: item · fixed? · proof · exit code.
Then `git status --short` and `git diff --stat`.
No summary documents.
