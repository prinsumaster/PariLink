import {
  Injectable,
  Logger,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { Prisma } from '@prisma/client';
import { validateGeneratedSql } from './sql-validator';

@Injectable()
export class SqlGeneratorService {
  private readonly logger = new Logger(SqlGeneratorService.name);
  private model: ChatOpenAI;

  // Define allowed tables to prevent accidental or malicious queries against sensitive data like users/passwords.
  // Enforced structurally in sql-validator.ts, not just referenced in the prompt text below.
  private readonly ALLOWED_TABLES = [
    'Trip',
    'Load',
    'Invoice',
    'Vehicle',
    'Driver',
    'Customer',
    'Expense',
  ];

  constructor(private readonly prisma: PrismaService) {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY || 'dummy-key-to-allow-boot',
    });
  }

  async generateAndExecuteSafeSql(
    companyId: string,
    prompt: string,
  ): Promise<any> {
    this.logger.log(
      `Generating SQL for company ${companyId} based on prompt: "${prompt}"`,
    );

    // 1. Generate SQL
    const sqlQuery = await this.generateSql(prompt);

    // 2. Validate Safety (ABAC & SQL Injection Protection) — structural, not
    // a substring scan. See sql-validator.ts for what "structural" means here.
    this.validateSqlSafety(sqlQuery, companyId);

    // 3. Execute. This runs under runAsTenant, NOT runAsSystem: RLS stays
    // active as a backstop even if the validation above has a gap. If a
    // query genuinely needs RLS off, it should not be an LLM-generated one.
    try {
      const sanitizedQuery = this.injectCompanyId(sqlQuery);
      const result = await this.prisma.runAsTenant(companyId, async (tx) => {
        await tx.$executeRawUnsafe('SET LOCAL ROLE parilink_ai;');
        // NOT `SET TRANSACTION READ ONLY`: runAsTenant already issues
        // `SELECT set_config('app.current_company_id', ...)` as the first
        // statement of this transaction, and SET TRANSACTION must precede
        // any query -- it would throw 25001 on every AI query. The GUC form
        // is legal at any point in the transaction.
        await tx.$executeRawUnsafe('SET LOCAL transaction_read_only = on;');
        return tx.$queryRawUnsafe(sanitizedQuery, companyId);
      });
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute generated SQL: ${(error as Error).message}`);
      throw new BadRequestException(
        'The generated query failed to execute safely.',
      );
    }
  }

  private async generateSql(prompt: string): Promise<string> {
    const template = `
    You are an expert PostgreSQL data analyst for a logistics operating system.
    Generate a highly optimized, read-only (SELECT) PostgreSQL query to answer the user's question.

    CRITICAL RULES:
    1. Only return the raw SQL query string. Do not include markdown formatting like \`\`\`sql.
    2. You MUST include a WHERE clause that filters by "companyId" = '{{COMPANY_ID_PLACEHOLDER}}' in every query.
    3. You may only query the following tables: ${this.ALLOWED_TABLES.join(', ')}.
    4. Never write UPDATE, DELETE, DROP, INSERT, or ALTER queries.
    5. Do NOT use sub-queries. Keep queries flat (JOINs are allowed). Sub-queries are rejected by the
       validator even when they restate the same companyId filter.

    User Question: {question}
    `;

    const promptTemplate = PromptTemplate.fromTemplate(template);

    // Format the prompt directly
    const formattedPrompt = await promptTemplate.format({
      question: prompt,
    });

    // Invoke model directly and parse string output
    const response = await this.model.invoke(formattedPrompt);

    return typeof response.content === 'string'
      ? response.content.trim()
      : JSON.stringify(response.content).trim();
  }

  /**
   * Structural validation, delegated to sql-validator.ts so it can be unit
   * tested without spinning up this service (which touches the OpenAI
   * client in its constructor). The prompt above tells the model what to
   * do; this function is what actually enforces it. Any query that reaches
   * step 3 above already passed:
   *   - no semicolons / comments / UNION
   *   - SELECT-only, no write verbs
   *   - every FROM/JOIN target is in ALLOWED_TABLES (checked against the
   *     actual parsed table list, not the prompt text)
   *   - a companyId predicate structurally inside the WHERE clause, for
   *     every distinct table/alias referenced (not just present somewhere
   *     in the query string)
   * See sql-validator.ts for the exact rules and why each exists.
   */
  private validateSqlSafety(query: string, companyId: string): void {
    const result = validateGeneratedSql(query, this.ALLOWED_TABLES);
    if (!result.ok) {
      this.logger.warn(
        `[SQL_GENERATOR] Rejected generated query for company ${companyId}: ${result.reason} | query: ${query}`,
      );
      throw new ForbiddenException(`Generated query rejected: ${result.reason}`);
    }
  }

  // Helper method to prepare parameterized query
  public injectCompanyId(query: string): string {
    // Replace the placeholder with the parameter marker $1
    return query.replace(/'\{\{COMPANY_ID_PLACEHOLDER\}\}'|\{\{COMPANY_ID_PLACEHOLDER\}\}/g, '$1');
  }
}
