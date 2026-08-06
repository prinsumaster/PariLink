import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SecurityContextService } from '../../platform/security/security.service';
import { ProcessEngine } from '../../platform/bpm/process.engine';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { CopilotObservabilityService } from './copilot-observability.service';
import { SqlGeneratorService } from './sql-generator.service';

export interface CopilotRequest {
  companyId: string;
  userId: string;
  prompt: string;
  context?: Record<string, any>;
}

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly security: SecurityContextService,
    private readonly bpm: ProcessEngine,
    private readonly eventStore: EventStoreService,
    private readonly observability: CopilotObservabilityService,
    private readonly sqlGenerator: SqlGeneratorService,
  ) {}

  /**
   * Main entrypoint for Natural Language Operations.
   */
  async processRequest(req: CopilotRequest) {
    const startTime = Date.now();
    this.logger.log(
      `Copilot processing request from User ${req.userId}: "${req.prompt}"`,
    );

    // 1. Role & Permission Verification
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { id: req.userId },
        include: { role: true },
      }),
    );
    const roles = user?.role ? [user.role.name.toUpperCase()] : [];

    if (!roles || roles.length === 0) {
      throw new ForbiddenException(
        'User lacks sufficient roles to invoke Copilot.',
      );
    }

    try {
      // 2. Semantic Intent Classification (Simulated AI Call)
      const intent = this.classifyIntent(req.prompt);

      // 3. Execution based on Intent
      let result;
      switch (intent.type) {
        case 'QUERY':
          result = await this.executeDataQuery(
            req.companyId,
            intent,
            roles,
            req.prompt,
          );
          break;
        case 'ACTION':
          result = await this.executeBpmAction(
            req.companyId,
            req.userId,
            intent,
          );
          break;
        case 'SUMMARY':
          result = await this.generateSummary(req.companyId, intent);
          break;
        default:
          result = {
            response:
              "I'm sorry, I couldn't understand that operational request.",
          };
      }

      // 4. Observability Logging
      const latency = Date.now() - startTime;
      await this.observability.logRequest(req, intent, result, latency, 0.95);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      await this.observability.logError(
        req,
        errorMessage,
        Date.now() - startTime,
      );
      throw err;
    }
  }

  private classifyIntent(prompt: string): any {
    // Simulated NLP classification extracting intent, entities, and action
    if (prompt.toLowerCase().includes('delayed trips')) {
      return {
        type: 'QUERY',
        domain: 'DISPATCH',
        entity: 'TRIP',
        filter: 'DELAYED',
      };
    }
    if (prompt.toLowerCase().includes('approve invoice')) {
      return {
        type: 'ACTION',
        domain: 'FINANCE',
        action: 'APPROVE_INVOICE',
        targetId: 'INV-123',
      };
    }
    if (prompt.toLowerCase().includes('summarize today')) {
      return { type: 'SUMMARY', domain: 'OPERATIONS', scope: 'TODAY' };
    }
    return { type: 'UNKNOWN' };
  }

  private async executeDataQuery(
    companyId: string,
    intent: any,
    userRoles: string[],
    prompt: string,
  ) {
    // Check basic roles or domains
    if (!userRoles.includes('DISPATCHER') && !userRoles.includes('ADMIN')) {
      throw new ForbiddenException(`Access denied to domain ${intent.domain}`);
    }

    try {
      this.logger.log(`Invoking SqlGenerator for prompt: ${prompt}`);
      const sqlResult = await this.sqlGenerator.generateAndExecuteSafeSql(
        companyId,
        prompt,
      );

      // If result is empty or not useful, we can format a generic message, else we just return the raw data.
      return {
        response: `Found ${sqlResult?.length || 0} records matching your query.`,
        data: sqlResult,
      };
    } catch (e) {
      this.logger.error('Error executing AI SQL query: ' + e.message);
      throw e;
    }
  }

  private async executeBpmAction(
    companyId: string,
    userId: string,
    intent: any,
  ) {
    // Copilot NEVER bypasses existing APIs; it strictly invokes BPM Process Engine.
    this.logger.log(`Copilot initiating BPM action: ${intent.action}`);

    const bpmResult = await this.bpm.startProcess(
      companyId,
      intent.action,
      { targetId: intent.targetId },
      userId,
    );
    return {
      response: `I have initiated the approval workflow for ${intent.targetId}.`,
      processId: bpmResult.processInstanceId,
    };
  }

  private async generateSummary(companyId: string, intent: any) {
    return {
      response:
        "Today's operations encountered 2 delays and 1 breakdown. 450 loads were delivered.",
    };
  }
}
