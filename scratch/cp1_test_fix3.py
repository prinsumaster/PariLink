import subprocess, requests
def sql(q):
    res = subprocess.run(['psql', '-U', 'vishalvirda', '-d', 'parilink_db', '-h', 'localhost', '-p', '5432', '-t', '-c', q], capture_output=True, text=True)
    return res.stdout.strip()

comp_b_id = sql("SELECT id FROM \"Company\" WHERE name='Tenant B' LIMIT 1;")
lr_id = sql(f"SELECT id FROM \"LorryReceipt\" WHERE \"companyId\"='{comp_b_id}' LIMIT 1;")
print(f"Initial LR ID for B: '{lr_id}'")

if not lr_id:
    print("Finding a LorryReceipt from any company, and changing it to Tenant B...")
    # Just grab an existing LorryReceipt and change its company to Tenant B!
    # Wait, the foreign keys (trip, load, customer) will STILL point to Tenant A!
    # That might cause Prisma's strict companyId matching to fail?
    # Yes, Prisma enforces companyId on the relations too.
    # So I need to clone the ENTIRE chain? Or just find ONE LR and change everything?
