INSERT INTO "Role" (id, name, description, permissions, "companyId", "createdAt", "updatedAt") 
VALUES ('rrrrrrrr-rrrr-4rrr-rrrr-rrrrrrrrrrrr', 'SUPER_ADMIN', 'Full system access', '["*"]', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', NOW(), NOW()) ON CONFLICT DO NOTHING;
UPDATE "User" SET "roleId" = 'rrrrrrrr-rrrr-4rrr-rrrr-rrrrrrrrrrrr' WHERE email = 'adminc@parilink.in';
