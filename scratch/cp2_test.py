import requests

BASE = "http://localhost:8080/api/v1"
def login(email):
    r = requests.post(f"{BASE}/auth/login", json={"email":email,"password":"password123"}, timeout=10)
    return r.json().get("access_token")

tok = login("admin@parilink.in")
h = {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"}

endpoints = [
    ("/trips/fake-id/desks/fake-desk/complete", "trip-desks.controller"),
    ("/trips/fake-id/loading", "loading-events.controller"),
    ("/trips/fake-id/fuel", "fuel-entries.controller"),
    ("/vehicles/fake-id/jobs", "jobs.controller (create)"),
    ("/jobs/fake-id/parts", "jobs.controller (parts)"),
    ("/jobs/fake-id/close", "jobs.controller (close)"),
    ("/vehicles/fake-id/tyres", "tyre.controller (create)"),
    ("/tyres/fake-id/remove", "tyre.controller (remove)"),
    ("/trips/fake-id/driver-score", "trips.controller (score)"),
    ("/bulk-import/fuel", "bulk-import.controller"),
    ("/ai/copilot/sessions", "ai.controller (sessions)"),
    ("/ai/copilot/sessions/fake-id/chat", "ai.controller (chat)")
]

for url, name in endpoints:
    r = requests.post(BASE + url, json={}, headers=h)
    print(f"POST {url.ljust(40)} -> {r.status_code}")
    if r.status_code != 400:
        print(f"  WARNING: Expected 400, got {r.status_code}. Response: {r.text[:100]}")
