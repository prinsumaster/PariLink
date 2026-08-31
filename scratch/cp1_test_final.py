import subprocess, json, requests

BASE = "http://localhost:8080/api/v1"

def sql(q):
    res = subprocess.run(['psql', '-U', 'vishalvirda', '-d', 'parilink_db', '-h', 'localhost', '-p', '5432', '-t', '-c', q], capture_output=True, text=True)
    return res.stdout.strip()

comp_b_id = sql("SELECT id FROM \"Company\" WHERE name='Tenant B' LIMIT 1;")
bilty_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")
fuel_b_ids = sql(f"SELECT id FROM \"FuelEntry\" WHERE \"companyId\"='{comp_b_id}';").split()

def login(email):
    r = requests.post(f"{BASE}/auth/login", json={"email":email,"password":"password123"}, timeout=10)
    return r.json().get("access_token")

tokA = login("admin@parilink.in")
tokB = login("adminC@parilink.in")
hA = {"Authorization": f"Bearer {tokA}"}
hB = {"Authorization": f"Bearer {tokB}"}

print(f"=== CP1.a: Bilty Isolation ===")
print(f"Bilty ID (Tenant B): {bilty_id}")
r_bilty_A = requests.get(f"{BASE}/lorry-receipts/{bilty_id}/pdf", headers=hA)
r_bilty_B = requests.get(f"{BASE}/lorry-receipts/{bilty_id}/pdf", headers=hB)
print(f"/bilty/:id/pdf                 | A -> {r_bilty_A.status_code} | B -> {r_bilty_B.status_code}")

print(f"\n=== CP1.b: Anomalies ===")
r_ano_A = requests.get(f"{BASE}/intelligence/fuel/anomalies", headers=hA)
anomalies_A = r_ano_A.json()
print("Response body for Tenant A:")
print(json.dumps(anomalies_A, indent=2))

print(f"\nComparing IDs:")
print(f"Tenant B fuel IDs: {fuel_b_ids}")
leaked = []
if anomalies_A:
    for ano in anomalies_A:
        if 'fuelEntryId' in ano and ano['fuelEntryId'] in fuel_b_ids:
            leaked.append(ano['fuelEntryId'])
            
if leaked:
    print(f"FAILED: Leaked {len(leaked)} B entries to A! {leaked}")
else:
    print(f"PASSED: 0 B entries leaked to A")
