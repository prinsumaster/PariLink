# PariLink — two open gaps, then Section A is done

Everything else is green. These two are the last unproven items. Same rules:
raw output, no summaries, no fixes unless a step says so.

---

## GAP 1 — The container serves the page but may not RENDER it

Raw output from the last run:
```
login:200
--- email input count ---
0
--- html size ---
   51146
--- first 3 JS chunks ---   (all -> 200)
--- first 2 CSS files ---
                            <-- EMPTY. No CSS files in the HTML at all.
```
Two things are unexplained:
1. The dev server returns `1` for the email-input count on the same page. The
   container returns `0`.
2. Zero `/_next/static/css/*.css` links. This is a Tailwind app; a production
   build normally emits a stylesheet.

The `docker logs` and `head -c 1500` blocks were requested when the count is 0
but did not appear in the output. curl cannot settle this anyway — a client
rendered page needs a real browser.

### 1a — Look at the HTML
```
docker run -d -p 3100:3000 --name pl-verify parilink-web:latest
sleep 10
curl -s http://localhost:3100/login | head -c 2000
echo
echo "=== any stylesheet at all? ==="
curl -s http://localhost:3100/login | grep -oE '<link[^>]*rel="stylesheet"[^>]*>' | head -5
curl -s http://localhost:3100/login | grep -c '<style'
echo "=== container logs ==="
docker logs pl-verify 2>&1 | tail -40
```
Paste all of it.

### 1b — Open it in a real browser and LOOK
Navigate a browser to http://localhost:3100/login and take a screenshot at
1440px wide. Then answer, from the screenshot, not from the code:
- Is there a visible email field and password field?
- Is the page STYLED — IBM Plex type, the #CC3700 accent, proper layout — or is
  it unstyled black-on-white HTML?
- Any visible error text?

Paste the screenshot. Then log in with admin@parilink.com / password123 against
the container and say whether you reach the dashboard.

```
docker rm -f pl-verify
```

If the page renders correctly in a browser, the curl count of 0 is a non-issue
and GAP 1 is closed. If it renders unstyled or blank, that is the finding.

---

## GAP 2 — Firefox and WebKit smoke failures, actual error text

Result was:
```
  2 failed
    [firefox] › tests/smoke.spec.ts:93:5 › Smoke test all core routes
    [webkit] › tests/smoke.spec.ts:93:5 › Smoke test all core routes
  1 passed (2.6m)
SMOKE_EXIT=1
```
Chromium passed all routes. The diagnosis given — "Firefox failed on an API
response status check, WebKit caught CORS errors on localhost:8080" — was stated
without the error output. If WebKit is genuinely hitting CORS failures that
Chromium does not, that is a real production finding, not a test-runner quirk.

```
cd apps/web
(npm run dev > /tmp/webdev.log 2>&1 &) ; sleep 25
npx playwright test tests/smoke.spec.ts --project=firefox --reporter=list 2>&1 | tail -60
npx playwright test tests/smoke.spec.ts --project=webkit --reporter=list 2>&1 | tail -60
pkill -f "next dev" || true
```
Paste both. I need the assertion text, the route that failed, and any CORS
message verbatim.

Then:
```
grep -rn "CORS_ALLOWED_ORIGINS\|origin" apps/api/src/main.ts | head -20
grep -n "CORS_ALLOWED_ORIGINS" .env
```
Paste the origins list (the variable value is not a secret).

---

## GAP 3 — One small thing, no fix needed, just confirm

`apps/web/tests/.auth/user.json` is tracked in git and was modified by the test
run. That file holds a real session cookie for admin@parilink.com.
```
git ls-files --error-unmatch apps/web/tests/.auth/user.json && echo "TRACKED"
grep -c "cookies" apps/web/tests/.auth/user.json
```
Confirm whether it is tracked. Do not change anything.

---

## Report
Table: gap · resolved? · evidence.
Attach the screenshot from 1b.
No summary documents, no readiness assessment.
