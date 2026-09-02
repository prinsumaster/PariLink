import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly dmmfModels = new Map<string, any>();
  private readonly systemClient: PrismaClient;

  constructor() {
    let datasourceUrl = process.env.APP_DATABASE_URL || process.env.DATABASE_URL;
    if (datasourceUrl) {
      try {
        const url = new URL(datasourceUrl);
        if (process.env.USE_PGBOUNCER === 'true') {
          url.searchParams.set('pgbouncer', 'true');
        }
        if (process.env.NODE_ENV === 'test') {
          url.searchParams.set('connection_limit', '2');
          url.searchParams.set('pool_timeout', '10');
        } else {
          // Connection math (max_connections=100, reserve 10 for maintenance → budget=90):
          // Main datasource:   16 connections/instance
          // System datasource:  2 connections/instance
          // Total per instance: 18 connections
          // 5 instances × 18 = 90 = budget. At 4 instances: 4 × 18 = 72 (safe head-room).
          url.searchParams.set('connection_limit', '16');
        }
        datasourceUrl = url.toString();
      } catch (e) {
        // ignore invalid URL parsing errors
      }
    }

    super({
      datasourceUrl,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    this.$on('error', (e) => this.logger.error(`Prisma Error: ${e.message}`));
    this.$on('warn', (e) => this.logger.warn(`Prisma Warn: ${e.message}`));

    let systemDatasourceUrl = process.env.SYSTEM_DATABASE_URL || datasourceUrl;
    if (systemDatasourceUrl) {
      try {
        const url = new URL(systemDatasourceUrl);
        if (process.env.NODE_ENV === 'test') {
          url.searchParams.set('connection_limit', '1');
        } else {
          // System datasource: 2 connections/instance.
          // (16 main + 2 system) × 5 instances = 90 = budget.
          url.searchParams.set('connection_limit', '2');
        }
        systemDatasourceUrl = url.toString();
      } catch (e) {}
    }
    this.systemClient = new PrismaClient({
      datasourceUrl: systemDatasourceUrl,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // Cache DMMF models and their fields for O(1) lookup during soft-delete middleware
    for (const model of Prisma.dmmf.datamodel.models) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldsMap = new Map<string, any>();
      for (const field of model.fields) {
        fieldsMap.set(field.name, field);
      }
      this.dmmfModels.set(model.name, { ...model, fieldsMap });
    }
    // await this.$connect(); // Bypassed for local load testing without a running DB
    this.setupSoftDeleteMiddleware();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.systemClient.$disconnect();
  }

  private setupSoftDeleteMiddleware() {
    this.$use(async (params, next) => {
      if (!params.model) return next(params);

      const model = this.dmmfModels.get(params.model);
      if (!model) return next(params);

      const hasDeletedAt = model.fields.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => f.name === 'deletedAt',
      );

      if (!hasDeletedAt) return next(params);

      if (
        params.action === 'findUnique' ||
        params.action === 'findFirst' ||
        params.action === 'findMany'
      ) {
        if (params.action === 'findUnique') {
          params.action = 'findFirst';
        }
        params.args = params.args || {};

        // Detect if this is a drill-down lookup (explicitly querying by ID)
        const isDrillDown = params.args?.where?.id !== undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const injectSoftDelete = (args: any, modelName: string, isRoot = false) => {
          if (!args) return;
          const currentModel = this.dmmfModels.get(modelName);
          if (!currentModel) return;

          const hasDelAt = currentModel.fields.some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (f: any) => f.name === 'deletedAt',
          );
          if (hasDelAt) {
            if (!args.where) {
              args.where = {};
            }
            if (isRoot && isDrillDown) {
              // Bypass soft-delete injection for root drill-down queries
            } else if (args.where.deletedAt === undefined) {
              args.where.deletedAt = null;
            }
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const processNested = (container: any) => {
            if (!container) return;
            for (const key of Object.keys(container)) {
              const val = container[key];
              const field = currentModel.fieldsMap.get(key);
              if (field && field.kind === 'object') {
                if (val === true) {
                  container[key] = {};
                  if (field.isList) {
                    injectSoftDelete(container[key], field.type, false);
                  } else {
                    // For to-one relations, we just process nested includes but don't inject `where` on this level
                    processNestedIncludeOnly(container[key], field.type);
                  }
                } else if (typeof val === 'object' && val !== null) {
                  if (field.isList) {
                    injectSoftDelete(val, field.type, false);
                  } else {
                    processNestedIncludeOnly(val, field.type);
                  }
                }
              }
            }
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const processNestedIncludeOnly = (args: any, modelName: string) => {
            if (!args) return;
            const nestedModel = this.dmmfModels.get(modelName);
            if (!nestedModel) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nestedProcess = (container: any) => {
              if (!container) return;
              for (const key of Object.keys(container)) {
                const val = container[key];
                const field = nestedModel.fieldsMap.get(key);
                if (field && field.kind === 'object') {
                  if (val === true) {
                    container[key] = {};
                    if (field.isList) {
                      injectSoftDelete(container[key], field.type, false);
                    } else {
                      processNestedIncludeOnly(container[key], field.type);
                    }
                  } else if (typeof val === 'object' && val !== null) {
                    if (field.isList) {
                      injectSoftDelete(val, field.type, false);
                    } else {
                      processNestedIncludeOnly(val, field.type);
                    }
                  }
                }
              }
            };
            nestedProcess(args.include);
            nestedProcess(args.select);
          };

          processNested(args.include);
          processNested(args.select);
        };

        injectSoftDelete(params.args, params.model, true);
      }
      
      const result = await next(params);
      
      // Post-process the result to append deleted: true flag
      if (
        params.action === 'findFirst' ||
        params.action === 'findMany'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flagDeleted = (obj: any, seen = new Set()) => {
          if (!obj || typeof obj !== 'object') return;
          if (seen.has(obj)) return;
          seen.add(obj);

          if (obj.deletedAt !== null && obj.deletedAt !== undefined) {
            obj.deleted = true;
          }

          for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) {
              obj[key].forEach((item: any) => flagDeleted(item, seen));
            } else if (typeof obj[key] === 'object') {
              flagDeleted(obj[key], seen);
            }
          }
        };

        if (Array.isArray(result)) {
          result.forEach(item => flagDeleted(item));
        } else {
          flagDeleted(result);
        }
      }
      
      return result;
      // We DO NOT convert 'update' to 'updateMany' because updateMany does not support 'include'/'select'
      // and returns a BatchPayload { count: number } instead of the updated object.
      // If we want to prevent updating deleted records, we rely on findFirst/findUnique checks beforehand,
      // which the services already do.
      if (params.action === 'updateMany') {
        params.args = params.args || {};
        if (params.args.where) {
          if (params.args.where.deletedAt === undefined) {
            params.args.where = { ...params.args.where };
          }
        } else {
          params.args.where = {};
        }
      }
      if (params.action === 'delete') {
        params.action = 'update';
        params.args = params.args || {};
        params.args.data = { deletedAt: new Date() };
      }
      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        params.args = params.args || {};
        if (params.args.data !== undefined) {
          params.args.data = { ...params.args.data, deletedAt: new Date() };
        } else {
          params.args.data = { deletedAt: new Date() };
        }
      }
      return next(params);
    });
  }

  /**
   * Executes a callback within a Prisma transaction that has RLS enabled
   * for the given companyId.
   */
  async runAsTenant<T>(
    companyId: string,
    callback: (
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      // Set the PostgreSQL local configuration variable for this transaction
      await tx.$executeRaw`SELECT set_config('app.current_company_id', ${companyId}, true)`;
      // Execute the business logic within the RLS-constrained transaction
      return callback(tx);
    });
  }

  /**
   * Executes a callback within a Prisma transaction that bypasses RLS policies
   * for system/admin operations across all companies.
   * A valid reason MUST be provided for security auditing.
   *
   * REASON STRING, HONESTLY: this only enforces length (>=5 chars), not
   * content. ~74 of the ~230 call sites in this codebase currently pass the
   * literal string 'System operation or legacy bypass', which satisfies the
   * length check but is not a real audit trail -- it can't tell you *why*
   * RLS was bypassed for a given call. Rejecting that placeholder outright
   * was considered and deliberately NOT done here: it would break ~74 call
   * sites at once, and reviewing/rewriting each one's actual reason is real
   * work that deserves its own change, not something to fold into this
   * security pass. New code added in this pass (runAsTenantById below)
   * passes a real, dynamic, per-call reason. Backfilling the other 74 is
   * flagged as follow-up work, not silently dropped.
   */
  async runAsSystem<T>(
    reason: string,
    callback: (
      tx: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    if (!reason || reason.trim().length < 5) {
      throw new Error('A valid reason must be provided to bypass RLS.');
    }

    this.logger.warn(
      `[SECURITY_AUDIT] SYSTEM_BYPASS: Bypassing RLS. Reason: ${reason}`
    );

    return this.systemClient.$transaction(async (tx) => {
      // Execute the business logic using the system-level connection
      return callback(tx as any);
    });
  }

  /**
   * Fetches a single record by id while RLS is bypassed (a system-level
   * lookup), then structurally re-checks that the fetched record's
   * companyId matches the caller's companyId before returning it.
   *
   * This replaces the "runAsSystem + manually recheck companyId" pattern
   * used at 15+ call sites in this codebase. That pattern is correct at
   * every site sampled during audit, but nothing enforces the recheck --
   * it's just a convention every call site has to remember to write, and
   * one missed recheck is a full tenant leak (fetch someone else's record
   * by guessing/enumerating an id). Using this helper instead makes the
   * recheck structurally unskippable: there is no code path here that
   * returns a record without it.
   *
   * Throws NotFoundException -- not ForbiddenException -- on both "no such
   * record" and "record exists but belongs to another company", on
   * purpose: a 403 would confirm to the caller that a record with that id
   * exists in some other tenant, which is itself a (small) information
   * leak. 404 for both cases tells an attacker nothing more than "you
   * don't have this".
   */
  async runAsTenantById<T extends { companyId: string | null }>(
    model: string,
    id: string,
    companyId: string,
  ): Promise<T> {
    if (!companyId) {
      throw new NotFoundException(`${model} not found.`);
    }

    const record = await this.runAsSystem<T | null>(
      `runAsTenantById: fetch ${model} ${id} for tenant-scope recheck (caller company ${companyId})`,
      async (tx) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const delegate = (tx as any)[model];
        if (!delegate || typeof delegate.findUnique !== 'function') {
          throw new Error(`runAsTenantById: unknown Prisma model "${model}".`);
        }
        return delegate.findUnique({ where: { id } });
      },
    );

    if (!record || record.companyId !== companyId) {
      throw new NotFoundException(`${model} not found.`);
    }

    return record;
  }

  /**
   * Framework-Level Optimistic Concurrency Control (OCC) Updater.
   * Eliminates the duplicate updateMany -> check count -> findFirst pattern.
   */
  async updateWithOcc<T>(
    tx: Omit<
      PrismaClient,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    modelName: string,
    id: string,
    existingUpdatedAt: Date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include?: any,
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (tx as any)[modelName];
    const updateResult = await model.updateMany({
      where: { id, updatedAt: existingUpdatedAt },
      data: { ...data, updatedAt: new Date() },
    });

    if (updateResult.count === 0) {
      throw new ConflictException(
        `${modelName} was modified by another process. Please refresh and try again.`,
      );
    }

    const configResult = await tx.$queryRaw<{ current_company_id: string | null }[]>`SELECT current_setting('app.current_company_id', true) as current_company_id`;
    const companyId = configResult[0]?.current_company_id;

    const finalWhere: any = { id };
    if (companyId) {
      finalWhere.companyId = companyId;
    }

    const updatedEntity = await model.findFirst({
      where: finalWhere,
      include,
    });

    if (!updatedEntity) {
      throw new NotFoundException(`${modelName} not found after update.`);
    }

    return updatedEntity;
  }
}
