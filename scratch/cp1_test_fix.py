import subprocess, json, requests

def sql(q):
    res = subprocess.run(['psql', '-U', 'vishalvirda', '-d', 'parilink_db', '-h', 'localhost', '-p', '5432', '-t', '-c', q], capture_output=True, text=True)
    if res.stderr: print("SQL Error:", res.stderr)
    return res.stdout.strip()

comp_b_id = sql("SELECT id FROM \"Company\" WHERE name='Tenant B' LIMIT 1;")
lr_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")

if not lr_id:
    # Get any LR and Load for cloning
    comp_a_id = sql("SELECT id FROM \"Company\" WHERE name!='Tenant B' LIMIT 1;")
    lr_a_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_a_id}' LIMIT 1;")
    load_a_id = sql(f"SELECT \"loadId\" FROM \"LorryReceipt\" WHERE id='{lr_a_id}';")
    
    # We need a Load for Tenant B
    load_b_id = sql(f"SELECT id FROM \"Load\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")
    if not load_b_id:
        print("ERROR: No load for B")
        # create a dummy load
        sql(f"INSERT INTO \"Load\" (id, \"companyId\", \"customerId\", \"originStation\", \"destinationStation\", status, \"updatedAt\") VALUES (gen_random_uuid(), '{comp_b_id}', null, 'DEL', 'MUM', 'PENDING', now());")
        load_b_id = sql(f"SELECT id FROM \"Load\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")
        
    print(f"Creating LorryReceipt for B using load: {load_b_id}")
    insert_q = f"""
    INSERT INTO "LorryReceipt" (id, "companyId", "loadId", "lrNumber", "consignorName", "consigneeName", "fromStation", "toStation", "goodsDescription", "packagesCount", "freightAmount", "hamaliCharges", "otherCharges", "gstAmount", "totalAmount", "paymentType", status, "updatedAt") 
    VALUES (gen_random_uuid(), '{comp_b_id}', '{load_b_id}', 'LR-B-001', 'Tenant B', 'Consignee B', 'DEL', 'MUM', 'Goods', 10, 5000, 0, 0, 0, 5000, 'PAID', 'GENERATED', now());
    """
    sql(insert_q)
    lr_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")

print(f"Bilty ID (Tenant B): {lr_id}")

BASE = "http://localhost:8080/api/v1"
def login(email):
    r = requests.post(f"{BASE}/auth/login", json={"email":email,"password":"password123"}, timeout=10)
    return r.json().get("access_token")

tokA = login("admin@parilink.in")
tokB = login("adminC@parilink.in")
hA = {"Authorization": f"Bearer {tokA}"}
hB = {"Authorization": f"Bearer {tokB}"}

r_bilty_A = requests.get(f"{BASE}/lorry-receipts/{lr_id}/pdf", headers=hA)
r_bilty_B = requests.get(f"{BASE}/lorry-receipts/{lr_id}/pdf", headers=hB)
print(f"/bilty/:id/pdf                 | A -> {r_bilty_A.status_code} | B -> {r_bilty_B.status_code}")
