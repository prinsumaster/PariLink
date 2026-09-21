INSERT INTO "Warehouse" (id, "companyId", name, code, address, city, state, active, "updatedAt")
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'e5a34360-c64b-4398-aef9-ec8e873eed14', 'Test Corp Warehouse', 'TC-01', '123 Test St', 'Mumbai', 'MH', true, NOW()),
  ('22222222-2222-2222-2222-222222222222', '1aec167b-473a-4663-86d8-695963f3a4f3', 'PariLink Main Hub', 'PL-MH', '456 Hub Blvd', 'Pune', 'MH', true, NOW())
ON CONFLICT (id) DO NOTHING;
