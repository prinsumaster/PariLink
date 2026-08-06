import re
import os
import datetime

schema = open("apps/api/prisma/schema.prisma").read()
models = []

# Find all models with companyId
for model_match in re.finditer(r"model\s+(\w+)\s+\{(.*?)\}", schema, re.DOTALL):
    model_name = model_match.group(1)
    body = model_match.group(2)
    if re.search(r"companyId\s+String", body):
        models.append(model_name)

# Company table doesn't have companyId, but its id is the tenant boundary.
# Actually, wait, let's just use "id" for Company.
models_with_company_id = models
sql_statements = []

for model in models_with_company_id:
    sql = f"""
-- RLS for {model}
ALTER TABLE "{model}" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "{model}" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "{model}";
CREATE POLICY "tenant_isolation_policy" ON "{model}"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "companyId" = current_setting('app.current_company_id', true)
);
"""
    sql_statements.append(sql)

# Special case for Company
sql = f"""
-- RLS for Company
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Company" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_isolation_policy" ON "Company";
CREATE POLICY "tenant_isolation_policy" ON "Company"
AS PERMISSIVE FOR ALL
USING (
  current_setting('app.bypass_rls', true) = 'on'
  OR "id" = current_setting('app.current_company_id', true)
)
WITH CHECK (
  current_setting('app.bypass_rls', true) = 'on'
  OR "id" = current_setting('app.current_company_id', true)
);
"""
sql_statements.append(sql)

migration_name = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + "_enable_rls"
migration_dir = f"apps/api/prisma/migrations/{migration_name}"
os.makedirs(migration_dir, exist_ok=True)

with open(f"{migration_dir}/migration.sql", "w") as f:
    f.write("\n".join(sql_statements))

print(f"Migration created at {migration_dir}/migration.sql")
