import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface MetricsLogInput {
  modelProvider: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  cost: number;
  success: boolean;
  companyId?: string;
  agentName?: string;
  workflowName?: string;
}

export interface ToolCallLog {
  agentName: string;
  toolName: string;
  input: Record<string, any>;
  output: string;
  durationMs: number;
  success: boolean;
  userId?: string;
  companyId?: string;
}

export interface FeedbackInput {
  interactionId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  userId: string;
  companyId: string;
}

export interface HallucinationReport {
  interactionId: string;
  reportedBy: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  companyId: string;
}

// In-memory stores for quick aggregation (production: supplement with TimescaleDB)
const toolCallAuditLog: ToolCallLog[] = [];
const feedbackLog: FeedbackInput[] = [];
const hallucinationLog: HallucinationReport[] = [];

@Injectable()
export class AiObservabilityService {
  private readonly logger = new Logger(AiObservabilityService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Core Metrics ─────────────────────────────────────────────────────────

  async logMetrics(data: MetricsLogInput) {
    try {
      await this.prisma.runAsSystem(async (tx) =>
        tx.aiMetricsLog.create({
          data: {
            modelProvider: data.modelProvider,
            modelVersion: 'v1',
            latencyMs: data.latencyMs,
            promptTokens: data.promptTokens,
            completionTokens: data.completionTokens,
            totalCost: data.cost,
            companyId: data.companyId || 'SYSTEM',
            interactionId: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          },
        }),
      );
    } catch {
      // Non-blocking — observability should never crash the AI pipeline
    }
  }

  /**
   * Platform-wide AI metrics for the Executive Command Center
   */
  async getPlatformMetrics(companyId: string) {
    let logs: any[] = [];
    let recs: any[] = [];

    try {
      [logs, recs] = await Promise.all([
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.aiMetricsLog.findMany({ where: { companyId } }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.aiRecommendation.findMany({ where: { companyId } }),
        ),
      ]);
    } catch {
      // Tables might not exist in all environments
    }

    const totalCost = logs.reduce((sum, log) => sum + (log.totalCost || 0), 0);
    const avgLatency =
      logs.length > 0
        ? logs.reduce((sum, log) => sum + (log.latencyMs || 0), 0) / logs.length
        : 0;
    const acceptedRecs = recs.filter((r) => r.status === 'ACCEPTED').length;
    const acceptanceRate =
      recs.length > 0 ? (acceptedRecs / recs.length) * 100 : 0;

    // Token aggregation
    const totalPromptTokens = logs.reduce(
      (sum, l) => sum + (l.promptTokens || 0),
      0,
    );
    const totalCompletionTokens = logs.reduce(
      (sum, l) => sum + (l.completionTokens || 0),
      0,
    );

    // Provider breakdown
    const providerBreakdown: Record<
      string,
      { calls: number; cost: number; avgLatency: number }
    > = {};
    for (const log of logs) {
      const p = log.modelProvider || 'unknown';
      if (!providerBreakdown[p])
        providerBreakdown[p] = { calls: 0, cost: 0, avgLatency: 0 };
      providerBreakdown[p].calls++;
      providerBreakdown[p].cost += log.totalCost || 0;
      providerBreakdown[p].avgLatency += log.latencyMs || 0;
    }
    for (const p of Object.keys(providerBreakdown)) {
      providerBreakdown[p].avgLatency =
        providerBreakdown[p].calls > 0
          ? providerBreakdown[p].avgLatency / providerBreakdown[p].calls
          : 0;
    }

    return {
      totalInteractions: logs.length,
      totalCostUsd: Math.round(totalCost * 10000) / 10000,
      averageLatencyMs: Math.round(avgLatency),
      totalPromptTokens,
      totalCompletionTokens,
      recommendationAcceptanceRate: Math.round(acceptanceRate * 10) / 10,
      totalRecommendations: recs.length,
      providerBreakdown,
      agentActivity: this.getAgentActivitySummary(),
      toolCallsSummary: this.getToolCallsSummary(),
      feedbackSummary: this.getFeedbackSummary(companyId),
      hallucinationReports: hallucinationLog.filter(
        (h) => h.companyId === companyId,
      ).length,
    };
  }

  // ─── Tool Call Audit Trail ────────────────────────────────────────────────

  async logToolCall(data: ToolCallLog): Promise<void> {
    toolCallAuditLog.push(data);
    this.logger.log(
      `[TOOL AUDIT] ${data.agentName}::${data.toolName} — ${data.success ? 'SUCCESS' : 'FAILED'} in ${data.durationMs}ms`,
    );
    // Keep last 1000 entries in memory
    if (toolCallAuditLog.length > 1000) toolCallAuditLog.shift();
  }

  getToolCallsSummary() {
    const byTool: Record<
      string,
      { calls: number; failures: number; avgDuration: number }
    > = {};
    for (const log of toolCallAuditLog) {
      if (!byTool[log.toolName])
        byTool[log.toolName] = { calls: 0, failures: 0, avgDuration: 0 };
      byTool[log.toolName].calls++;
      if (!log.success) byTool[log.toolName].failures++;
      byTool[log.toolName].avgDuration += log.durationMs;
    }
    for (const t of Object.keys(byTool)) {
      byTool[t].avgDuration =
        byTool[t].calls > 0 ? byTool[t].avgDuration / byTool[t].calls : 0;
    }
    return byTool;
  }

  // ─── Hallucination Reporting ──────────────────────────────────────────────

  async logHallucination(report: HallucinationReport): Promise<void> {
    hallucinationLog.push(report);
    this.logger.warn(
      `[HALLUCINATION] Severity: ${report.severity} | Reported by: ${report.reportedBy} — ${report.description.substring(0, 100)}`,
    );
    if (report.severity === 'CRITICAL') {
      this.logger.error(
        `CRITICAL hallucination reported on interaction ${report.interactionId}. Immediate review required.`,
      );
    }
  }

  getHallucinationReports(companyId?: string): HallucinationReport[] {
    return companyId
      ? hallucinationLog.filter((h) => h.companyId === companyId)
      : hallucinationLog;
  }

  // ─── Feedback ─────────────────────────────────────────────────────────────

  async submitFeedback(feedback: FeedbackInput): Promise<void> {
    feedbackLog.push(feedback);
    this.logger.log(
      `Feedback received: ${feedback.rating}/5 for interaction ${feedback.interactionId}`,
    );
  }

  getFeedbackSummary(companyId?: string) {
    const relevant = companyId
      ? feedbackLog.filter((f) => f.companyId === companyId)
      : feedbackLog;

    if (relevant.length === 0)
      return { totalRatings: 0, averageRating: 0, distribution: {} };

    const avgRating =
      relevant.reduce((sum, f) => sum + f.rating, 0) / relevant.length;
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    for (const f of relevant) distribution[f.rating]++;

    return {
      totalRatings: relevant.length,
      averageRating: Math.round(avgRating * 10) / 10,
      distribution,
    };
  }

  // ─── Agent Health ─────────────────────────────────────────────────────────

  getAgentActivitySummary() {
    const agentCalls: Record<string, number> = {};
    for (const log of toolCallAuditLog) {
      agentCalls[log.agentName] = (agentCalls[log.agentName] || 0) + 1;
    }
    return agentCalls;
  }

  async getAgentHealth(agentName: string): Promise<{
    agentName: string;
    totalToolCalls: number;
    failureRate: number;
    avgToolDurationMs: number;
    lastActive?: Date;
  }> {
    const agentLogs = toolCallAuditLog.filter((l) => l.agentName === agentName);
    const failures = agentLogs.filter((l) => !l.success).length;
    const avgDuration =
      agentLogs.length > 0
        ? agentLogs.reduce((sum, l) => sum + l.durationMs, 0) / agentLogs.length
        : 0;

    return {
      agentName,
      totalToolCalls: agentLogs.length,
      failureRate: agentLogs.length > 0 ? failures / agentLogs.length : 0,
      avgToolDurationMs: Math.round(avgDuration),
      lastActive: agentLogs.length > 0 ? new Date() : undefined,
    };
  }
}
