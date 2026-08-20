
    INSERT INTO "ApiKey" (id, "companyId", name, "keyHash", scopes, "isActive", "updatedAt")
    VALUES (gen_random_uuid(), 'bad77312-954c-437b-a34f-2e8d0d9587c5', 'Test Key', 'a9c29d0f00e123aa46fbcbeb2e3b3e327208d6a7b554f66404021ff43222b9f7', '["api:read"]', true, NOW());
  