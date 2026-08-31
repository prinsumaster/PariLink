DO $$
DECLARE
    v_comp_b text;
    v_comp_a text;
    v_cust_b text;
    v_load_b text;
    v_lr_b text;
    
    r_cust RECORD;
    r_load RECORD;
    r_lr RECORD;
BEGIN
    SELECT id::text INTO v_comp_b FROM "Company" WHERE name='Tenant B' LIMIT 1;
    SELECT id::text INTO v_comp_a FROM "Company" WHERE name!='Tenant B' LIMIT 1;
    
    -- Clone Customer
    SELECT * INTO r_cust FROM "Customer" WHERE "companyId"=v_comp_a LIMIT 1;
    INSERT INTO "Customer" (id, "companyId", name, "updatedAt") 
    VALUES (gen_random_uuid(), v_comp_b, 'Customer B', now()) RETURNING id::text INTO v_cust_b;
    
    -- Clone Load
    SELECT * INTO r_load FROM "Load" WHERE "companyId"=v_comp_a LIMIT 1;
    INSERT INTO "Load" (id, "companyId", "customerId", "referenceNumber", "originAddress", "originCity", "originState", "destinationAddress", "destinationCity", "destinationState", "pickupDate", "deliveryDate", "equipmentType", status, rate, "updatedAt")
    VALUES (gen_random_uuid(), v_comp_b, v_cust_b, r_load."referenceNumber", r_load."originAddress", r_load."originCity", r_load."originState", r_load."destinationAddress", r_load."destinationCity", r_load."destinationState", r_load."pickupDate", r_load."deliveryDate", r_load."equipmentType", r_load.status, r_load.rate, now()) RETURNING id::text INTO v_load_b;

    -- Clone LorryReceipt
    SELECT * INTO r_lr FROM "LorryReceipt" WHERE "companyId"=v_comp_a LIMIT 1;
    INSERT INTO "LorryReceipt" (id, "companyId", "loadId", "lrNumber", "consignorName", "consigneeName", "fromStation", "toStation", "goodsDescription", "packagesCount", "freightAmount", "hamaliCharges", "otherCharges", "gstAmount", "totalAmount", "paymentType", status, "updatedAt") 
    VALUES (gen_random_uuid(), v_comp_b, v_load_b, r_lr."lrNumber", r_lr."consignorName", r_lr."consigneeName", r_lr."fromStation", r_lr."toStation", r_lr."goodsDescription", r_lr."packagesCount", r_lr."freightAmount", r_lr."hamaliCharges", r_lr."otherCharges", r_lr."gstAmount", r_lr."totalAmount", r_lr."paymentType", r_lr.status, now()) RETURNING id::text INTO v_lr_b;

    RAISE NOTICE 'Bilty B ID: %', v_lr_b;
END $$;
