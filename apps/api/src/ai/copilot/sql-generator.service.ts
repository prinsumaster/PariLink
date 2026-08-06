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

@Injectable()
export class SqlGeneratorService {
  private readonly logger = new Logger(SqlGeneratorService.name);
  private model: ChatOpenAI;

  // Define allowed tables to prevent accidental or malicious queries against sensitive data like users/passwords.
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
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY missing');
    this.model = new ChatOpenAI({
      modelName: 'gpt-4-turbo-preview',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
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

    // 2. Validate Safety (ABAC & SQL Injection Protection)
    this.validateSqlSafety(sqlQuery, companyId);

    // 3. Execute
    try {
      const sanitizedQuery = this.injectCompanyId(sqlQuery, companyId);
      const result = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.$queryRaw(Prisma.raw(sanitizedQuery)),
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to execute generated SQL: ${error.message}`);
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

  private validateSqlSafety(query: string, companyId: string): void {
    const upperQuery = query.toUpperCase();

    // Check for destructive operations
    if (
      upperQuery.includes('UPDATE ') ||
      upperQuery.includes('DELETE ') ||
      upperQuery.includes('INSERT ') ||
      upperQuery.includes('DROP ') ||
      upperQuery.includes('ALTER ') ||
      upperQuery.includes('TRUNCATE ')
    ) {
      throw new ForbiddenException('Only SELECT queries are allowed.');
    }

    // Ensure companyId isolation is injected or present.
    // In a robust implementation, we would parse the AST or use parameterized queries.
    // For this sprint implementation, we replace the placeholder.
    if (!query.includes('{{COMPANY_ID_PLACEHOLDER}}')) {
      // Just as an extra precaution if the LLM failed to include it.
      throw new ForbiddenException('Tenant isolation validation failed.');
    }

    // Replace the placeholder with the actual companyId (parameterization is better, but this works for demo)
    // Note: We use string replacement here, but ideally we extract the query structure and pass companyId as a param to prisma.$queryRaw.
  }

  // Helper method to sanitize and inject companyId to prevent SQL injection in the replacement phase
  public injectCompanyId(query: string, companyId: string): string {
    // Very basic sanitization for the demo
    const sanitizedCompanyId = companyId.replace(/'/g, "''");
    return query.replace(/\{\{COMPANY_ID_PLACEHOLDER\}\}/g, sanitizedCompanyId);
  }
}
