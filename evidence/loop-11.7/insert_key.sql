
    INSERT INTO "ApiKey" (id, "companyId", name, "keyHash", scopes, "isActive", "updatedAt")
    VALUES (gen_random_uuid(), '030ebc04-acd0-4189-b6de-92264978a5fd', 'Test Key A', 'e0b3f03b3be5880e2e1c258f3c1d44fc134ea86ccc80e563c625300a02480050', '["api:read"]', true, NOW());
  