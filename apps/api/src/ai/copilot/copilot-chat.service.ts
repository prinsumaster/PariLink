// Typescript checking skipped for AI module
import { Injectable, MessageEvent } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CopilotService } from './copilot.service';
import { AgentOrchestratorService } from '../agents/agent-orchestrator.service';
import { EnterpriseRagService } from '../rag/rag.service';
import { Observable } from 'rxjs';
import { LlmManagerService } from '../platform/llm-manager.service';
import { createCopilotTools } from './tools';
import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

@Injectable()
export class AiCopilotChatService {
  constructor(
    private prisma: PrismaService,
    private copilot: CopilotService,
    private orchestrator: AgentOrchestratorService,
    private rag: EnterpriseRagService,
    private llmManager: LlmManagerService,
  ) {}

  async getSessions(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatSession.findMany({
        where: { companyId, userId },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      }),
    );
  }

  async createSession(companyId: string, userId: string, title?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatSession.create({
        data: { companyId, userId, title: title || 'New Conversation' },
      }),
    );
  }

  async getMessages(sessionId: string, userId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.aiChatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
      }),
    );
  }

  async chat(
    companyId: string,
    userId: string,
    sessionId: string,
    userMessage: string,
  ) {
    // Save user message
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatMessage.create({
        data: { sessionId, role: 'USER', content: userMessage },
      }),
    );

    // Update session title if first message
    const session = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatSession.findUnique({
        where: { id: sessionId },
      }),
    );
    if (session?.title === 'New Conversation') {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.aiChatSession.update({
          where: { id: sessionId },
          data: { title: userMessage.substring(0, 60) },
        }),
      );
    }

    // Generate AI response using copilot service
    let aiContent = '';
    let citations: Record<string, unknown>[] = [];

    try {
      // Retrieve Context via RAG (Phase 3)
      const ragContext = await this.rag.retrieveContext(userMessage);

      // Route via Agent Orchestrator (Phase 6)
      const result = await this.orchestrator.routeIntent(
        companyId,
        userMessage + '\n\nKnowledge Context:\n' + JSON.stringify(ragContext),
        'Chat',
        sessionId,
        userId,
      );

      aiContent = result.response;
      citations = [];
    } catch (e) {
      // Fallback to intelligent mock responses
      aiContent = await this.generateContextualResponse(companyId, userMessage);
    }

    // Save AI response
    const aiMessage = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatMessage.create({
        data: {
          sessionId,
          role: 'ASSISTANT',
          content: aiContent,
          citations: citations as any,
        },
      }),
    );

    // Update session
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      }),
    );

    return aiMessage;
  }

  chatStream(
    companyId: string,
    userId: string,
    sessionId: string,
    userMessage: string,
  ): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      (async () => {
        try {
          // Save user message
          await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.aiChatMessage.create({
              data: { sessionId, role: 'USER', content: userMessage },
            }),
          );

          // Update session title if first message
          const session = await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.aiChatSession.findUnique({
              where: { id: sessionId },
            }),
          );
          if (session?.title === 'New Conversation') {
            await this.prisma.runAsTenant(companyId, async (tx) =>
              tx.aiChatSession.update({
                where: { id: sessionId },
                data: { title: userMessage.substring(0, 60) },
              }),
            );
          }

          let aiContent = '';
          const citations: Record<string, unknown>[] = [];

          try {
            // Retrieve Context via RAG
            const ragContext = await this.rag.retrieveContext(userMessage);
            const contextStr =
              Object.keys(ragContext).length > 0
                ? '\n\nKnowledge Context:\n' + JSON.stringify(ragContext)
                : '';

            const model = await this.llmManager.getModel();

            // Check if mock model (which doesn't support tools natively)
            if (model._llmType() === 'mock-chat-model') {
              const stream = this.llmManager.generateStreamResponse(
                'You are PariLink Copilot.',
                userMessage + contextStr,
              );
              for await (const chunk of stream) {
                aiContent += chunk;
                subscriber.next({ data: { chunk } });
              }
            } else {
              // Real LLM with Safe Tool Calling
              const tools = createCopilotTools(this.prisma, companyId);

              const prompt = ChatPromptTemplate.fromMessages([
                [
                  'system',
                  'You are PariLink Copilot, an enterprise AI assistant for logistics and operations. Use tools to search for data if needed. ' +
                    contextStr,
                ],
                ['human', '{input}'],
                ['placeholder', '{agent_scratchpad}'],
              ]);

              const agent = createToolCallingAgent({
                llm: model,
                tools: tools as any,
                prompt,
              });

              const executor = new AgentExecutor({
                agent,
                tools: tools as any,
              });

              // We stream the final response from AgentExecutor
              // AgentExecutor doesn't yield char by char in .stream() natively, it yields steps.
              const result = await executor.invoke({ input: userMessage });
              aiContent =
                typeof result.output === 'string'
                  ? result.output
                  : JSON.stringify(result.output);

              // Mock stream to UI for UX since agent execution is blocky
              const chunks = aiContent.match(/.{1,10}/g) || [];
              for (const chunk of chunks) {
                subscriber.next({ data: { chunk } });
                await new Promise((resolve) => setTimeout(resolve, 10));
              }
            }
          } catch (e) {
            // Fallback
            aiContent = await this.generateContextualResponse(
              companyId,
              userMessage,
            );
            subscriber.next({ data: { chunk: aiContent } });
          }

          // Save AI response
          await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.aiChatMessage.create({
              data: {
                sessionId,
                role: 'ASSISTANT',
                content: aiContent,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                citations: citations as any,
              },
            }),
          );

          // Update session
          await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.aiChatSession.update({
              where: { id: sessionId },
              data: { updatedAt: new Date() },
            }),
          );

          subscriber.next({ data: { done: true } });
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  async getDailyBrief(companyId: string, userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeLoads,
      tripsToday,
      overdueInvoices,
      activeAlerts,
      newCustomers,
    ] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.count({
          where: { companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.count({
          where: { companyId, startDate: { gte: today } },
        }),
      ),
      this.prisma
        .runAsTenant(companyId, async (tx) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tx.invoice.count({ where: { companyId, status: 'OVERDUE' } } as any),
        )
        .catch(() => 0),
      this.prisma
        .runAsTenant(companyId, async (tx) =>
          tx.alert.count({ where: { companyId, status: 'ACTIVE' } }),
        )
        .catch(() => 0),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.customer.count({
          where: { companyId, createdAt: { gte: today } },
        }),
      ),
    ]);

    const metricsStr = JSON.stringify({
      activeLoads,
      tripsToday,
      overdueInvoices,
      activeAlerts,
      newCustomers,
    });

    let summary = '';
    let recommendations: string[] = [];

    try {
      const response = await this.llmManager.generateResponse(
        'You are an executive analyst. Provide a brief daily operational summary and 2-3 key bulleted recommendations based on the provided metrics. Output must be valid JSON: {"summary": "string", "recommendations": ["string"]}. Keep it professional and action-oriented.',
        `Here are today's metrics: ${metricsStr}`,
        {},
        undefined,
        'executive_analyst',
      );

      const parsed = JSON.parse(
        response.replace(/^```json\n/, '').replace(/\n```$/, ''),
      );
      summary = parsed.summary;
      recommendations = parsed.recommendations;
    } catch {
      // Fallback if LLM parsing fails or is mocked without json
      summary = `Good morning! You have ${activeLoads} active loads in transit, ${tripsToday} trips scheduled today, and ${overdueInvoices} overdue invoices requiring attention. ${activeAlerts > 0 ? `There are ${activeAlerts} active alerts that need review.` : 'No active alerts — operations are running smoothly.'}`;
      recommendations = [
        activeLoads > 5
          ? `📦 ${activeLoads} loads are in transit — check ETA updates for delays.`
          : null,
        overdueInvoices > 0
          ? `💰 ${overdueInvoices} invoices are overdue — schedule follow-ups with customers.`
          : null,
        activeAlerts > 0
          ? `🚨 ${activeAlerts} active alerts — review the alert dashboard for details.`
          : null,
        `📊 Review today's dispatch board for optimal resource allocation.`,
      ].filter(Boolean) as string[];
    }

    return {
      generatedAt: new Date().toISOString(),
      metrics: {
        activeLoads,
        tripsToday,
        overdueInvoices,
        activeAlerts,
        newCustomers,
      },
      summary,
      recommendations,
    };
  }

  async summarizeEntity(
    companyId: string,
    entityType: string,
    entityId: string,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let entity: any = null;
      let summary = '';

      if (entityType === 'Load') {
        entity = (await this.prisma.runAsTenant(
          companyId,
          async (tx) =>
            tx.load.findFirst({
              where: { id: entityId, companyId },
              include: { customer: true },
            }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any;
        if (entity) {
          summary =
            `**Load ${entity.referenceNumber}** — ${entity.status}\n\n` +
            `📍 **Route**: ${entity.originCity}, ${entity.originState} → ${entity.destinationCity}, ${entity.destinationState}\n` +
            `👤 **Customer**: ${entity.customer?.name || 'Unassigned'}\n` +
            `🚛 **Driver**: ${entity.driver?.firstName ? `${entity.driver.firstName} ${entity.driver.lastName}` : 'Unassigned'}\n` +
            `💰 **Rate**: $${entity.rate?.toLocaleString()}\n` +
            `📅 **Pickup**: ${entity.pickupDate ? new Date(entity.pickupDate).toLocaleDateString() : 'TBD'}\n` +
            `📅 **Delivery**: ${entity.deliveryDate ? new Date(entity.deliveryDate).toLocaleDateString() : 'TBD'}`;
        }
      } else if (entityType === 'Trip') {
        entity = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.findFirst({
            where: { id: entityId, companyId },
            include: { driver: true, vehicle: true },
          }),
        );
        if (entity) {
          summary =
            `**Trip ${entity.tripNumber}** — ${entity.status}\n\n` +
            `🚛 **Vehicle**: ${entity.vehicle?.licensePlate || 'Unassigned'}\n` +
            `👤 **Driver**: ${entity.driver?.firstName ? `${entity.driver.firstName} ${entity.driver.lastName}` : 'Unassigned'}\n` +
            `📅 **Start**: ${entity.startDate ? new Date(entity.startDate).toLocaleDateString() : 'TBD'}`;
        }
      }

      return {
        entityType,
        entityId,
        summary:
          summary || `No details available for ${entityType} ${entityId}.`,
      };
    } catch (e) {
      return {
        entityType,
        entityId,
        summary: `Could not load details for ${entityType}.`,
      };
    }
  }

  private async generateContextualResponse(
    companyId: string,
    query: string,
  ): Promise<string> {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('load') || lowerQuery.includes('freight')) {
      const loads = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.count({ where: { companyId } }),
      );
      const active = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.count({
          where: { companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } },
        }),
      );
      return `Based on your company data, you currently have **${loads} total loads** with **${active} actively in transit**. For detailed load analytics, I recommend reviewing the Dispatch Board for real-time status updates. Would you like me to help you analyze specific loads or identify optimization opportunities?`;
    }
    if (
      lowerQuery.includes('invoice') ||
      lowerQuery.includes('billing') ||
      lowerQuery.includes('payment')
    ) {
      return `I can help you analyze your financial data. Your invoice and billing data is synchronized in the Finance module. For overdue invoices, I'd recommend setting up automated reminder workflows using the Automation Builder. Would you like help generating a financial summary report?`;
    }
    if (
      lowerQuery.includes('driver') ||
      lowerQuery.includes('fleet') ||
      lowerQuery.includes('vehicle')
    ) {
      const drivers = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.driver.count({ where: { companyId } }),
      );
      const vehicles = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.count({
          where: { companyId },
        }),
      );
      return `Your fleet consists of **${vehicles} vehicles** and **${drivers} registered drivers**. For maintenance predictions and performance analytics, I analyze trip history and vehicle telemetry. Is there a specific driver or vehicle you'd like me to analyze?`;
    }
    if (lowerQuery.includes('customer') || lowerQuery.includes('crm')) {
      const customers = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.customer.count({
          where: { companyId },
        }),
      );
      return `You have **${customers} customers** in your database. I can help analyze customer revenue trends, identify at-risk accounts, and generate customer performance reports. What would you like to know?`;
    }

    return `I'm LogOS Copilot, your enterprise AI assistant. I have access to your complete operations data — loads, trips, fleet, drivers, customers, invoices, and analytics. I can help you:\n\n• 📊 Summarize operational performance\n• 🔍 Analyze specific loads, trips, or customers\n• 💡 Recommend dispatch optimizations\n• 📋 Generate reports and summaries\n• ⚠️ Identify anomalies and risks\n\nWhat would you like to explore?`;
  }
}
