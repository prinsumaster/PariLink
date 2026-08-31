INSERT INTO "Company" (id, name, "createdAt", "updatedAt") VALUES ('bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 'Tenant B', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "User" (id, email, password, "firstName", "lastName", status, "companyId", "createdAt", "updatedAt") 
VALUES ('uuuuuuuu-uuuu-4uuu-uuuu-uuuuuuuuuuuu', 'adminB@parilink.in', (SELECT password FROM "User" LIMIT 1), 'Admin', 'B', 'ACTIVE', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "Vehicle" (id, "licensePlate", make, model, year, type, status, "capacityWeight", "companyId", "createdAt", "updatedAt") 
VALUES ('vvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'MH-04-BB-9999', 'Tata', 'Signa', 2024, 'TRUCK', 'AVAILABLE', 20, 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "Driver" (id, "firstName", "lastName", phone, "licenseNumber", status, "companyId", "createdAt", "updatedAt") 
VALUES ('dddddddd-dddd-4ddd-dddd-dddddddddddd', 'Driver', 'B', '+919999999999', 'B-LIC-123', 'AVAILABLE', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "Trip" (id, "tripNumber", status, "driverId", "vehicleId", "companyId", "createdAt", "updatedAt") 
VALUES ('tttttttt-tttt-4ttt-tttt-tttttttttttt', 'TRP-B-1', 'COMPLETED', 'dddddddd-dddd-4ddd-dddd-dddddddddddd', 'vvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "FuelEntry" (id, amount, litres, "filledAt", "vehicleId", "tripId", "driverId", "companyId", "createdAt", "updatedAt") 
VALUES ('ffffffff-ffff-4fff-ffff-ffffffffffff', 5000, 50, NOW(), 'vvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'tttttttt-tttt-4ttt-tttt-tttttttttttt', 'dddddddd-dddd-4ddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "MaintenanceJob" (id, type, status, "labourCost", "vehicleId", "companyId", "createdAt", "updatedAt") 
VALUES ('mmmmmmmm-mmmm-4mmm-mmmm-mmmmmmmmmmmm', 'PREVENTIVE', 'COMPLETED', 1000, 'vvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
INSERT INTO "Tyre" (id, brand, status, position, "vehicleId", "companyId", "createdAt", "updatedAt") 
VALUES ('yyyyyyyy-yyyy-4yyy-yyyy-yyyyyyyyyyyy', 'MRF', 'ACTIVE', 'FL', 'vvvvvvvv-vvvv-4vvv-vvvv-vvvvvvvvvvvv', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
