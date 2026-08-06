import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class CopilotObservabilityService {
  private readonly logger = new Logger(CopilotObservabilityService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  async logRequest(
    req: any,
    intent: any,
    result: any,
    latencyMs: number,
    confidence: number,
  ) {
    this.logger.debug(
      `Copilot Observability: Logged ${intent.type} request. Latency: ${latencyMs}ms, Confidence: ${confidence}`,
    );

    // Store immutably in EventStore for Enterprise Analytics
    await this.eventStore.append({
      tenantId: req.companyId,
      streamId: `COPILOT-REQ-${Date.now()}`,
      streamType: 'AI_OBSERVABILITY',
      eventType: 'CopilotInteraction',
      payload: {
        prompt: req.prompt,
        intent,
        latencyMs,
        confidence,
        success: true,
      },
      userId: req.userId,
    });
  }

  async logError(req: any, errorMsg: string, latencyMs: number) {
    this.logger.error(`Copilot Error: ${errorMsg}`);

    await this.eventStore.append({
      tenantId: req.companyId,
      streamId: `COPILOT-REQ-${Date.now()}`,
      streamType: 'AI_OBSERVABILITY',
      eventType: 'CopilotInteractionFailed',
      payload: { prompt: req.prompt, error: errorMsg, latencyMs },
      userId: req.userId,
    });
  }

  async recordUserFeedback(
    companyId: string,
    requestId: string,
    accepted: boolean,
    userId: string,
  ) {
    // Allows measuring Copilot suggestion acceptance rates
    await this.eventStore.append({
      tenantId: companyId,
      streamId: requestId,
      streamType: 'AI_OBSERVABILITY',
      eventType: 'CopilotFeedbackReceived',
      payload: { accepted },
      userId,
    });
  }
}
