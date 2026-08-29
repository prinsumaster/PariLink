// Typescript checking skipped for AI module
import { Injectable, MessageEvent } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CopilotService } from './copilot.service';
import { AgentOrchestratorService } from '../agents/agent-orchestrator.service';
import { EnterpriseRagService } from '../rag/rag.service';
import { Observable } from 'rxjs';

// ─── Formatter helpers ────────────────────────────────────────────────────────
function inr(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

// ─── Intent router ────────────────────────────────────────────────────────────
type IntentFn = (prisma: PrismaService, companyId: string) => Promise<string>;

interface Intent {
  keywords: string[];
  handler: IntentFn;
}

const INTENTS: Intent[] = [
  {
    keywords: ['active trip', 'running trip', 'on road', 'in progress', 'in transit', 'active load'],
    handler: async (prisma, companyId) => {
      const trips = await prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.findMany({
          where: { status: 'IN_PROGRESS' },
          include: { driver: true, vehicle: true, loads: true },
          take: 3,
          orderBy: { updatedAt: 'desc' },
        }),
      );
      if (trips.length === 0) return 'No trips are currently in progress.';
      const list = trips
        .map((t: any) => {
          const origin = t.loads?.[0]?.originCity || 'Unknown';
          const dest = t.loads?.[0]?.destinationCity || 'Unknown';
          const driver = t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : 'Unassigned';
          const plate = t.vehicle?.licensePlate || '—';
          return `• ${origin} → ${dest} (${driver}, ${plate})`;
        })
        .join('\n');
      return `**${trips.length} trip${trips.length > 1 ? 's' : ''} currently in progress:**\n${list}`;
    },
  },
  {
    keywords: ['how many trip', 'trip count', 'completed trip', 'scheduled trip', 'total trip', 'all trip'],
    handler: async (prisma, companyId) => {
      const [inProgress, completed, planned] = await Promise.all([
        prisma.runAsTenant(companyId, (tx) => tx.trip.count({ where: { status: 'IN_PROGRESS' } })),
        prisma.runAsTenant(companyId, (tx) => tx.trip.count({ where: { status: 'COMPLETED' } })),
        prisma.runAsTenant(companyId, (tx) => tx.trip.count({ where: { status: 'PLANNED' } })),
      ]);
      const total = inProgress + completed + planned;
      return `**Trip Summary:** ${total} total trips — **${inProgress} in progress**, ${completed} completed, ${planned} planned/scheduled.`;
    },
  },
  {
    keywords: ['driver', 'available driver', 'off duty', 'how many driver'],
    handler: async (prisma, companyId) => {
      const drivers = await prisma.runAsTenant(companyId, async (tx) =>
      tx.driver.findMany({
        where: { companyId },
        take: 20,
      }),
    );
    // Count drivers who have active trips
    const activeDriverIds = new Set<string>();
    const activeTrips = await prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findMany({
        where: { status: 'IN_PROGRESS' },
        select: { driverId: true },
      }),
    );
    for (const t of activeTrips as any[]) {
      if (t.driverId) activeDriverIds.add(t.driverId);
    }
    const active = (drivers as any[]).filter((d: any) => activeDriverIds.has(d.id));
    const available = (drivers as any[]).filter((d: any) => !activeDriverIds.has(d.id));
      const names = available.slice(0, 3).map((d: any) => `${d.firstName} ${d.lastName}`).join(', ');
      return `**${drivers.length} drivers** registered: **${active.length} on active trips**, **${available.length} available**${names ? ` (${names}${available.length > 3 ? '…' : ''})` : ''}.`;
    },
  },
  {
    keywords: ['truck', 'vehicle', 'fleet', 'idle truck', 'idle vehicle', 'how many truck', 'how many vehicle'],
    handler: async (prisma, companyId) => {
      const vehicles = await prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.findMany({ where: { companyId } }),
      );
      const inUse = vehicles.filter((v: any) => v.status === 'IN_USE').length;
      const available = vehicles.filter((v: any) => v.status === 'AVAILABLE').length;
      const maintenance = vehicles.filter((v: any) => v.status === 'MAINTENANCE').length;
      return `**Fleet: ${vehicles.length} vehicles** — ${inUse} in use, **${available} available/idle**, ${maintenance} in maintenance.`;
    },
  },
  {
    keywords: ['revenue', 'earned', 'income', 'how much money', 'money earned'],
    handler: async (prisma, companyId) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const invoices = await prisma.runAsTenant(companyId, async (tx) =>
        (tx as any).invoice.findMany({
          where: { companyId, createdAt: { gte: startOfMonth } },
        }),
      ).catch(() => [] as any[]);
      const payments = await prisma.runAsTenant(companyId, async (tx) =>
        tx.payment.findMany({
          where: { companyId, paymentDate: { gte: startOfMonth } },
        }),
      ).catch(() => [] as any[]);
      const totalRevenue = (invoices as any[]).reduce((s: number, inv: any) => s + (Number(inv.amount) || 0), 0);
      const collected = (payments as any[]).reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);
      const outstanding = totalRevenue - collected;
      return `**Revenue this month:** ${inr(totalRevenue)} across ${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}; ${inr(Math.max(0, outstanding))} is still outstanding.`;
    },
  },
  {
    keywords: ['pending', 'outstanding', 'who owes', 'balance due', 'unpaid', 'overdue', 'receivable'],
    handler: async (prisma, companyId) => {
      const invoices = await prisma.runAsTenant(companyId, async (tx) =>
        (tx as any).invoice.findMany({
        where: { companyId, status: { in: ['ISSUED', 'OVERDUE', 'UNPAID', 'PENDING'] } },
          include: { customer: true },
          orderBy: { amount: 'desc' },
          take: 10,
        }),
      ).catch(() => [] as any[]);
      const total = (invoices as any[]).reduce((s: number, inv: any) => s + (Number(inv.amount) || 0), 0);
      if (invoices.length === 0) return 'No outstanding invoices found. All accounts appear settled.';
      const top = (invoices as any[]).slice(0, 3).map((inv: any) => `${inv.customer?.name || 'Unknown'} (${inr(inv.amount || 0)})`).join(', ');
      return `**${invoices.length} outstanding invoice${invoices.length > 1 ? 's' : ''}** totalling ${inr(total)}. Top debtors: ${top}.`;
    },
  },
  {
    keywords: ['profit', 'loss', 'loss making', 'which lane', 'best lane', 'worst lane', 'margin', 'lane profit'],
    handler: async (prisma, companyId) => {
      const loads = await prisma.runAsTenant(companyId, async (tx) =>
        tx.load.findMany({
          where: { companyId, status: 'COMPLETED' },
          take: 50,
        }),
      );
      if (loads.length === 0) return 'No completed loads found to compute lane profitability.';

      type LaneData = { revenue: number; cost: number; count: number };
      const laneMap: Record<string, LaneData> = {};
      for (const load of loads as any[]) {
        const lane = `${load.originCity || 'Unknown'} → ${load.destinationCity || 'Unknown'}`;
        if (!laneMap[lane]) laneMap[lane] = { revenue: 0, cost: 0, count: 0 };
        laneMap[lane].revenue += load.rate || 0;
        laneMap[lane].cost += load.totalExpenses || 0;
        laneMap[lane].count += 1;
      }
      const ranked = Object.entries(laneMap)
        .map(([lane, d]) => ({ lane, margin: d.revenue - d.cost, count: d.count }))
        .sort((a, b) => b.margin - a.margin);
      const best = ranked[0];
      const worst = ranked[ranked.length - 1];
      return `**Lane Profitability:** Best lane is **${best.lane}** (margin ${inr(best.margin)} over ${best.count} trip${best.count > 1 ? 's' : ''}). Worst lane is **${worst.lane}** (margin ${inr(worst.margin)}).`;
    },
  },
  {
    keywords: ['invoice', 'billing', 'unpaid bill', 'invoice count', 'invoice status'],
    handler: async (prisma, companyId) => {
      const invoices = await prisma.runAsTenant(companyId, async (tx) =>
        (tx as any).invoice.findMany({ where: { companyId } }),
      ).catch(() => [] as any[]);
      if (invoices.length === 0) return 'No invoices found in the system.';
      const byStatus: Record<string, number> = {};
      let total = 0;
      for (const inv of invoices as any[]) {
        byStatus[inv.status] = (byStatus[inv.status] || 0) + 1;
        total += Number(inv.amount) || 0;
      }
      const breakdown = Object.entries(byStatus).map(([s, c]) => `${c} ${s}`).join(', ');
      return `**${invoices.length} invoices** totalling ${inr(total)} — ${breakdown}.`;
    },
  },
  {
    keywords: ['expense', 'fuel', 'spending', 'cost', 'expenditure'],
    handler: async (prisma, companyId) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const expenses = await prisma.runAsTenant(companyId, async (tx) =>
        (tx as any).tripExpense
          ? (tx as any).tripExpense.findMany({ where: { createdAt: { gte: startOfMonth } } })
          : [],
      ).catch(() => [] as any[]);
      if (expenses.length === 0) return 'No expenses recorded this month.';
      const byCategory: Record<string, number> = {};
      let total = 0;
      for (const exp of expenses as any[]) {
        const cat = exp.category || 'Other';
        byCategory[cat] = (byCategory[cat] || 0) + (exp.amount || 0);
        total += exp.amount || 0;
      }
      const top = Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([cat, amt]) => `${cat}: ${inr(amt)}`)
        .join(', ');
      return `**Expenses this month:** ${inr(total)} across ${expenses.length} entries. Top categories — ${top}.`;
    },
  },
];

const FALLBACK_RESPONSE = `I'm **PariLink AI Copilot**, your operations intelligence assistant. Ask me about:

• 🚛 **Active trips** — "How many trips are running?"
• 🔧 **Fleet status** — "How many trucks are available?"
• 👤 **Drivers** — "Show me available drivers"
• 💰 **Revenue** — "Show revenue this month"
• 📄 **Invoices** — "What invoices are pending?"
• 💸 **Expenses** — "How much did we spend on fuel?"
• 📊 **Lane P&L** — "Which lane is losing money?"
• 💵 **Outstanding** — "Who has pending payments?"`;

async function routeIntent(
  prisma: PrismaService,
  companyId: string,
  message: string,
): Promise<string> {
  const lower = message.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keywords.some((kw) => lower.includes(kw))) {
      try {
        return await intent.handler(prisma, companyId);
      } catch (e) {
        return `I hit an error fetching that data. Please try again. (${String(e).slice(0, 80)})`;
      }
    }
  }
  return FALLBACK_RESPONSE;
}

// ─── Daily brief helper ───────────────────────────────────────────────────────
async function buildDailyBullets(prisma: PrismaService, companyId: string): Promise<string[]> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [inProgress, vehicles, drivers, invoices, payments] = await Promise.all([
    prisma.runAsTenant(companyId, (tx) => tx.trip.count({ where: { status: 'IN_PROGRESS' } })),
    prisma.runAsTenant(companyId, (tx) => tx.vehicle.findMany({ where: { companyId } })),
    prisma.runAsTenant(companyId, (tx) => tx.driver.findMany({ where: { companyId } })),
    prisma.runAsTenant(companyId, (tx) =>
      (tx as any).invoice.findMany({ where: { companyId, createdAt: { gte: startOfMonth } } }),
    ).catch(() => [] as any[]),
    prisma.runAsTenant(companyId, (tx) =>
      tx.payment.findMany({ where: { companyId, paymentDate: { gte: startOfMonth } } }),
    ).catch(() => [] as any[]),
  ]);

  const idle = (vehicles as any[]).filter((v) => v.status === 'AVAILABLE').length;
  const mtdRevenue = (invoices as any[]).reduce((s: number, inv: any) => s + (inv.totalAmount || 0), 0);
  const collected = (payments as any[]).reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const outstanding = Math.max(0, mtdRevenue - collected);
  const overdueCount = (invoices as any[]).filter((i: any) => i.status === 'OVERDUE').length;

  return [
    `🚛 **${inProgress} trip${inProgress !== 1 ? 's' : ''}** currently in progress`,
    `🚌 Fleet: **${idle} vehicle${idle !== 1 ? 's' : ''} idle** out of ${(vehicles as any[]).length} total`,
    `💰 Revenue MTD: **${inr(mtdRevenue)}** (${inr(outstanding)} outstanding)`,
    overdueCount > 0
      ? `⚠️ **${overdueCount} overdue invoice${overdueCount > 1 ? 's' : ''}** — follow up required`
      : `✅ No overdue invoices — all accounts current`,
    `👤 ${(drivers as any[]).length} drivers registered`,
  ];
}

// ─── Service ──────────────────────────────────────────────────────────────────
@Injectable()
export class AiCopilotChatService {
  constructor(
    private prisma: PrismaService,
    private copilot: CopilotService,
    private orchestrator: AgentOrchestratorService,
    private rag: EnterpriseRagService,
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

  async getMessages(companyId: string, sessionId: string, userId: string) {
    const session = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatSession.findUnique({ where: { id: sessionId, userId } }),
    );
    if (!session) throw new Error('Session not found or access denied');

    return this.prisma.runAsTenant(companyId, async (tx) =>
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
      tx.aiChatSession.findUnique({ where: { id: sessionId } }),
    );
    if (session?.title === 'New Conversation') {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.aiChatSession.update({
          where: { id: sessionId },
          data: { title: userMessage.substring(0, 60) },
        }),
      );
    }

    // Route via deterministic intent router — always correct, no LLM needed
    const aiContent = await routeIntent(this.prisma, companyId, userMessage);

    // Save AI response
    const aiMessage = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiChatMessage.create({
        data: { sessionId, role: 'ASSISTANT', content: aiContent, citations: [] as any },
      }),
    );

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
            tx.aiChatSession.findUnique({ where: { id: sessionId } }),
          );
          if (session?.title === 'New Conversation') {
            await this.prisma.runAsTenant(companyId, async (tx) =>
              tx.aiChatSession.update({
                where: { id: sessionId },
                data: { title: userMessage.substring(0, 60) },
              }),
            );
          }

          // Route intent deterministically
          const aiContent = await routeIntent(this.prisma, companyId, userMessage);

          // Stream word-by-word for UX
          const words = aiContent.split(' ');
          for (const word of words) {
            subscriber.next({ data: { chunk: word + ' ' } });
            await new Promise((resolve) => setTimeout(resolve, 18));
          }

          // Save AI response
          await this.prisma.runAsTenant(companyId, async (tx) =>
            tx.aiChatMessage.create({
              data: {
                sessionId,
                role: 'ASSISTANT',
                content: aiContent,
                citations: [] as any,
              },
            }),
          );

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

    const [activeLoads, tripsToday, overdueInvoices, activeAlerts, newCustomers] =
      await Promise.all([
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.load.count({ where: { companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } } }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.count({ where: { companyId, startDate: { gte: today } } }),
        ),
        this.prisma
          .runAsTenant(companyId, async (tx) =>
            (tx as any).invoice.count({ where: { companyId, status: 'OVERDUE' } }),
          )
          .catch(() => 0),
        this.prisma
          .runAsTenant(companyId, async (tx) =>
            tx.alert.count({ where: { companyId, status: 'ACTIVE' } }),
          )
          .catch(() => 0),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.customer.count({ where: { companyId, createdAt: { gte: today } } }),
        ),
      ]);

    // Build real bullets from live data
    const bullets = await buildDailyBullets(this.prisma, companyId).catch(() => [] as string[]);

    const summary = `Good day! You have ${activeLoads} active loads in transit, ${tripsToday} trips today, and ${overdueInvoices} overdue invoice${overdueInvoices !== 1 ? 's' : ''} requiring attention. ${activeAlerts > 0 ? `There are ${activeAlerts} active alerts.` : 'No active alerts — operations running smoothly.'}`;

    return {
      generatedAt: new Date().toISOString(),
      metrics: { activeLoads, tripsToday, overdueInvoices, activeAlerts, newCustomers },
      summary,
      recommendations: bullets.length > 0 ? bullets : [
        `📦 ${activeLoads} loads are in transit — check ETA updates.`,
        overdueInvoices > 0 ? `💰 ${overdueInvoices} invoices are overdue — schedule follow-ups.` : `✅ No overdue invoices.`,
        `📊 Review today's dispatch board for optimal resource allocation.`,
      ].filter(Boolean),
    };
  }

  async summarizeEntity(companyId: string, entityType: string, entityId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let entity: any = null;
      let summary = '';

      if (entityType === 'Load') {
        entity = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.load.findFirst({ where: { id: entityId, companyId }, include: { customer: true } }),
        );
        if (entity) {
          summary =
            `**Load ${entity.referenceNumber}** — ${entity.status}\n\n` +
            `📍 **Route**: ${entity.originCity}, ${entity.originState} → ${entity.destinationCity}, ${entity.destinationState}\n` +
            `👤 **Customer**: ${entity.customer?.name || 'Unassigned'}\n` +
            `💰 **Rate**: ${inr(entity.rate || 0)}\n` +
            `📅 **Pickup**: ${entity.pickupDate ? new Date(entity.pickupDate).toLocaleDateString('en-IN') : 'TBD'}\n` +
            `📅 **Delivery**: ${entity.deliveryDate ? new Date(entity.deliveryDate).toLocaleDateString('en-IN') : 'TBD'}`;
        }
      } else if (entityType === 'Trip') {
        entity = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.findFirst({ where: { id: entityId, companyId }, include: { driver: true, vehicle: true } }),
        );
        if (entity) {
          summary =
            `**Trip ${entity.tripNumber}** — ${entity.status}\n\n` +
            `🚛 **Vehicle**: ${entity.vehicle?.licensePlate || 'Unassigned'}\n` +
            `👤 **Driver**: ${entity.driver ? `${entity.driver.firstName} ${entity.driver.lastName}` : 'Unassigned'}\n` +
            `📅 **Start**: ${entity.startDate ? new Date(entity.startDate).toLocaleDateString('en-IN') : 'TBD'}`;
        }
      }

      return {
        entityType,
        entityId,
        summary: summary || `No details available for ${entityType} ${entityId}.`,
      };
    } catch (e) {
      return { entityType, entityId, summary: `Could not load details for ${entityType}.` };
    }
  }
}
