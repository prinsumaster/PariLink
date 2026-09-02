-- Fix existing partitions
DO $$
DECLARE
    part text;
BEGIN
    FOR part IN (SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname LIKE 'VehicleLocation_%' AND c.relkind='r')
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(part) || ' ENABLE ROW LEVEL SECURITY';
        EXECUTE 'ALTER TABLE ' || quote_ident(part) || ' FORCE ROW LEVEL SECURITY';
        
        -- Safe drop if exists and create
        EXECUTE 'DROP POLICY IF EXISTS tenant_isolation_policy ON ' || quote_ident(part);
        EXECUTE 'CREATE POLICY tenant_isolation_policy ON ' || quote_ident(part) || ' AS PERMISSIVE FOR ALL TO public USING ("companyId" = current_setting(''app.current_company_id''::text, true)) WITH CHECK ("companyId" = current_setting(''app.current_company_id''::text, true))';
    END LOOP;
END;
$$;

-- Future partitions trigger
CREATE OR REPLACE FUNCTION public.vehicle_location_partition_rls()
RETURNS event_trigger AS $$
DECLARE
    obj record;
    part_name text;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
        -- Check if it's a VehicleLocation partition
        IF obj.object_type = 'table' AND obj.object_identity LIKE 'public.VehicleLocation\_%' THEN
            part_name := (parse_ident(obj.object_identity))[2]; -- extract table name
            EXECUTE 'ALTER TABLE ' || quote_ident(part_name) || ' ENABLE ROW LEVEL SECURITY';
            EXECUTE 'ALTER TABLE ' || quote_ident(part_name) || ' FORCE ROW LEVEL SECURITY';
            EXECUTE 'CREATE POLICY tenant_isolation_policy ON ' || quote_ident(part_name) || ' AS PERMISSIVE FOR ALL TO public USING ("companyId" = current_setting(''app.current_company_id''::text, true)) WITH CHECK ("companyId" = current_setting(''app.current_company_id''::text, true))';
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

DROP EVENT TRIGGER IF EXISTS vehicle_location_partition_rls_trigger;
CREATE EVENT TRIGGER vehicle_location_partition_rls_trigger
    ON ddl_command_end
    WHEN TAG IN ('CREATE TABLE')
    EXECUTE FUNCTION public.vehicle_location_partition_rls();
