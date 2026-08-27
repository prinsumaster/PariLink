# PariLink — GO LIVE. Start everything and give me the link. (run right before the demo)

Bring the FULL app up reliably, make sure the demo data is loaded, and print the link I open in
front of the client. Do the steps in order. Do NOT report a link until both servers answer 200.

## STEP 1 — free ports + bring up the database/infra
```bash
cd ~/Desktop/PariLink
killall node 2>/dev/null
lsof -ti:3000 -ti:8080 2>/dev/null | xargs kill -9 2>/dev/null
docker compose up -d            # postgres, redis, minio
docker ps --format '{{.Names}}'  # confirm the three are up
```

## STEP 2 — make sure the demo data is there (idempotent — safe to re-run)
```bash
cd apps/api
npx prisma migrate deploy
npx prisma db seed
```

## STEP 3 — start the API and the web app
```bash
cd ~/Desktop/PariLink
(cd apps/api && npm run start:prod > /tmp/api.log 2>&1 &)
(cd apps/web && npm run dev       > /tmp/web.log 2>&1 &)
```

## STEP 4 — WAIT until both are truly up (don't hand me a dead link)
```bash
echo "starting API..."; for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code}" localhost:8080/api/v1/health | grep -q 200 && break; sleep 3; done
echo "starting WEB..."; for i in $(seq 1 40); do curl -s -o /dev/null -w "%{http_code}" localhost:3000/login       | grep -q 200 && break; sleep 3; done
curl -s -o /dev/null -w "API : %{http_code}\n" localhost:8080/api/v1/health
curl -s -o /dev/null -w "WEB : %{http_code}\n" localhost:3000/login
```
If WEB isn't 200, read `/tmp/web.log`, fix the boot, and retry. Do NOT proceed on a guess.

## STEP 5 — hand me the link + login, in a clear block
When both are 200, print exactly this:
```
============================================
  PARILINK IS LIVE — open this in Chrome:
     http://localhost:3000/login
  Login:    admin@parilink.in
  Password: password123
============================================
```
Leave the servers RUNNING. Do not kill them, do not close the terminal — I need them up for the
whole demo.

## OPTIONAL — a SHAREABLE public link (only if the client is remote / you're screen-sharing a URL)
If you need a link to SEND someone (not just localhost on this laptop), open a tunnel:
```bash
npx cloudflared tunnel --url http://localhost:3000
```
It prints a public `https://<random>.trycloudflare.com` URL — share THAT. (Keep this running too;
closing it kills the public link. localhost stays the safest bet for an in-person demo.)

## If anything fails
Say exactly which step and paste the error from `/tmp/api.log` or `/tmp/web.log`. Do not report
"ready" unless STEP 4 shows API 200 and WEB 200.
