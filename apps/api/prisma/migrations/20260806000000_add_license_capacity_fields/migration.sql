-- Migration: add_license_capacity_fields
-- Purpose: Enterprise Licensing Engine - Truck/Vehicle Capacity Control
-- Adds maxVehicles, maxDrivers, unlimitedMode, boostExpiresAt to TenantConfig
-- Adds planCode, defaultMaxVehicles, defaultMaxDrivers to SubscriptionPlan

-- AddColumn TenantConfig
ALTER TABLE "TenantConfig" ADD COLUMN IF NOT EXISTS "maxVehicles" INTEGER NOT NULL DEFAULT 20;
ALTER TABLE "TenantConfig" ADD COLUMN IF NOT EXISTS "maxDrivers" INTEGER NOT NULL DEFAULT 50;
ALTER TABLE "TenantConfig" ADD COLUMN IF NOT EXISTS "unlimitedMode" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "TenantConfig" ADD COLUMN IF NOT EXISTS "boostExpiresAt" TIMESTAMP(3);
ALTER TABLE "TenantConfig" ADD COLUMN IF NOT EXISTS "boostMaxVehicles" INTEGER;

-- AddColumn SubscriptionPlan
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "planCode" TEXT NOT NULL DEFAULT 'STARTER';
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "defaultMaxVehicles" INTEGER NOT NULL DEFAULT 20;
ALTER TABLE "SubscriptionPlan" ADD COLUMN IF NOT EXISTS "defaultMaxDrivers" INTEGER NOT NULL DEFAULT 50;

-- Seed default subscription plans with correct capacity limits
-- These are upserted by planCode to be idempotent
INSERT INTO "SubscriptionPlan" ("id", "name", "planCode", "description", "price", "currency", "interval", "defaultMaxVehicles", "defaultMaxDrivers", "features", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'Starter',          'STARTER',         'For small fleets getting started',           5000,   'INR', 'month', 20,    50,   '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Growth',           'GROWTH',          'For growing logistics operations',          12000,   'INR', 'month', 50,   100,   '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Professional',     'PROFESSIONAL',    'For professional fleet managers',           25000,   'INR', 'month', 100,  200,   '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Business',         'BUSINESS',        'For mid-size transport businesses',         50000,   'INR', 'month', 250,  500,   '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Enterprise',       'ENTERPRISE',      'For large enterprise logistics',           100000,   'INR', 'month', 500, 1000,   '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Enterprise Plus',  'ENTERPRISE_PLUS', 'For the largest transport networks',       200000,   'INR', 'month', 1000, 2000, '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Custom',           'CUSTOM',          'Unlimited capacity - admin controlled',         0,   'INR', 'month', 99999, 99999,'{}', NOW(), NOW())
ON CONFLICT DO NOTHING;
