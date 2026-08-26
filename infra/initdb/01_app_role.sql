-- =============================================================================
-- PariLink: Least-Privilege Application Role
-- =============================================================================
-- This script runs ONCE automatically when PostgreSQL initialises a fresh data
-- directory (docker-entrypoint-initdb.d). It creates a dedicated application
-- role (parilink_app) that has NO superuser, NO bypass-RLS, NO createdb, and
-- NO createrole privileges. The running API connects as parilink_app so that
-- PostgreSQL Row-Level Security policies are enforced at every query.
--
-- The privileged parilink role (created by docker-compose POSTGRES_USER) is
-- reserved ONLY for running "prisma migrate deploy" which requires DDL rights.
-- =============================================================================

\connect parilink_db

DO $$
BEGIN
  -- Create the application role only if it does not already exist.
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_app') THEN
    CREATE ROLE parilink_app
      LOGIN
      NOSUPERUSER
      NOBYPASSRLS
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      PASSWORD 'apppassword';
    RAISE NOTICE 'parilink_app role created.';
  ELSE
    RAISE NOTICE 'parilink_app role already exists — skipping creation.';
  END IF;
END
$$;

-- Allow the app role to connect to the database.
GRANT CONNECT ON DATABASE parilink_db TO parilink_app;

-- Allow usage of the public schema.
GRANT USAGE ON SCHEMA public TO parilink_app;

-- Grant CRUD on all existing tables.
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO parilink_app;

-- Grant sequence usage (needed for auto-increment primary keys).
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO parilink_app;

-- Ensure future tables/sequences created by parilink are accessible to parilink_app.
ALTER DEFAULT PRIVILEGES FOR ROLE parilink IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO parilink_app;

ALTER DEFAULT PRIVILEGES FOR ROLE parilink IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO parilink_app;

-- Verify: the next psql query by parilink_app MUST show rolsuper=f, rolbypassrls=f.
-- Run: SELECT current_user, rolsuper::text, rolbypassrls::text
--      FROM pg_roles WHERE rolname = current_user;
