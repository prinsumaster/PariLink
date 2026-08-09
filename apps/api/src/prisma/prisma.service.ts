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

  constructor() {
    let datasourceUrl = process.env.DATABASE_URL;
    if (datasourceUrl) {
      try {
        const url = new URL(datasourceUrl);
        if (process.env.USE_PGBOUNCER === 'true') {
          url.searchParams.set('pgbouncer', 'true');
        }
        if (process.env.NODE_ENV === 'test') {
          url.searchParams.set('connection_limit', '2');
          url.searchParams.set('pool_timeout', '10');
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const injectSoftDelete = (args: any, modelName: string) => {
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
                    injectSoftDelete(container[key], field.type);
                  } else {
                    // For to-one relations, we just process nested includes but don't inject `where` on this level
                    processNestedIncludeOnly(container[key], field.type);
                  }
                } else if (typeof val === 'object' && val !== null) {
                  if (field.isList) {
                    injectSoftDelete(val, field.type);
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
                      injectSoftDelete(container[key], field.type);
                    } else {
                      processNestedIncludeOnly(container[key], field.type);
                    }
                  } else if (typeof val === 'object' && val !== null) {
                    if (field.isList) {
                      injectSoftDelete(val, field.type);
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

        injectSoftDelete(params.args, params.model);
      }
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

  async onModuleDestroy() {
    await this.$disconnect();
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
   */
  async runAsSystem<T>(
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
      // Set the PostgreSQL local configuration variable to bypass RLS
      await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
      // Execute the business logic
      return callback(tx);
    });
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
