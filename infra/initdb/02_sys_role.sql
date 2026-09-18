-- =============================================================================
-- PariLink: System Role (BYPASSRLS) for runAsSystem() Operations
-- =============================================================================
-- This script creates the `parilink_sys` role. This role has BYPASSRLS and
-- SUPERUSER privileges so that system-level operations (seed scripts, the
-- GUC attack test, verify-revenue.ts) can bypass Row-Level Security.
--
-- In production, this role's password should be provided via the
-- PARILINK_SYS_PASSWORD environment variable.
--
-- The parilink_app role (01_app_role.sql) is the application runtime role
-- with RLS enforced. parilink_sys is ONLY for administrative operations.
-- =============================================================================

\connect parilink_db

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_sys') THEN
    CREATE ROLE parilink_sys
      LOGIN
      SUPERUSER
      BYPASSRLS
      PASSWORD 'testpw123';
    RAISE NOTICE 'parilink_sys role created.';
  ELSE
    -- Ensure the password is up to date in CI environments
    ALTER ROLE parilink_sys PASSWORD 'testpw123';
    RAISE NOTICE 'parilink_sys role already exists — password refreshed.';
  END IF;
END
$$;

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE parilink_db TO parilink_sys;

-- Grant schema and table-level access
GRANT ALL PRIVILEGES ON SCHEMA public TO parilink_sys;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO parilink_sys;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO parilink_sys;

-- Ensure future objects are also accessible
ALTER DEFAULT PRIVILEGES FOR ROLE parilink IN SCHEMA public
  GRANT ALL ON TABLES TO parilink_sys;

ALTER DEFAULT PRIVILEGES FOR ROLE parilink IN SCHEMA public
  GRANT ALL ON SEQUENCES TO parilink_sys;
