import subprocess, requests

def sql(q):
    res = subprocess.run(['psql', '-U', 'vishalvirda', '-d', 'parilink_db', '-h', 'localhost', '-p', '5432', '-t', '-c', q], capture_output=True, text=True)
    if res.stderr: print("SQL Error:", res.stderr)
    return res.stdout.strip()

comp_b_id = sql("SELECT id FROM \"Company\" WHERE name='Tenant B' LIMIT 1;")
comp_a_id = sql("SELECT id FROM \"Company\" WHERE name!='Tenant B' LIMIT 1;")

lr_b_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")

if not lr_b_id:
    print("Cloning a LorryReceipt from Tenant A to Tenant B...")
    lr_a_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_a_id}' LIMIT 1;")
    
    # We must also clone the load, but let's just clone a Load too!
    load_a_id = sql(f"SELECT \"loadId\" FROM \"LorryReceipt\" WHERE id='{lr_a_id}';")
    clone_load_q = f"INSERT INTO \"Load\" SELECT gen_random_uuid(), '{comp_b_id}', \"customerId\", \"originStation\", \"destinationStation\", status, now() FROM \"Load\" WHERE id='{load_a_id}' RETURNING id;"
    load_b_id = sql(clone_load_q)
    
    clone_lr_q = f"""
    INSERT INTO "LorryReceipt" (id, "companyId", "loadId", "lrNumber", "consignorName", "consigneeName", "fromStation", "toStation", "goodsDescription", "packagesCount", "freightAmount", "hamaliCharges", "otherCharges", "gstAmount", "totalAmount", "paymentType", status, "updatedAt")
    SELECT gen_random_uuid(), '{comp_b_id}', '{load_b_id}', 'LR-B-001', "consignorName", "consigneeName", "fromStation", "toStation", "goodsDescription", "packagesCount", "freightAmount", "hamaliCharges", "otherCharges", "gstAmount", "totalAmount", "paymentType", status, now()
    FROM "LorryReceipt" WHERE id='{lr_a_id}' RETURNING id;
    """
    lr_b_id = sql(clone_lr_q)
    print(f"Cloned LR: {lr_b_id}")

BASE = "http://localhost:8080/api/v1"
def login(email):
    r = requests.post(f"{BASE}/auth/login", json={"email":email,"password":"password123"}, timeout=10)
    return r.json().get("access_token")

tokA = login("admin@parilink.in")
tokB = login("adminC@parilink.in")
hA = {"Authorization": f"Bearer {tokA}"}
hB = {"Authorization": f"Bearer {tokB}"}

r_bilty_A = requests.get(f"{BASE}/bilty/{lr_b_id}/pdf", headers=hA)
r_bilty_B = requests.get(f"{BASE}/bilty/{lr_b_id}/pdf", headers=hB)
print(f"/bilty/:id/pdf                 | A -> {r_bilty_A.status_code} | B -> {r_bilty_B.status_code}")
