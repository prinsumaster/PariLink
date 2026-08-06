import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface CreateIncidentInput {
  companyId: string;
  title: string;
  description: string;
  severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
  assignedToId?: string;
  affectedServices: string[];
  actorId?: string;
}

export interface UpdateIncidentStatusInput {
  incidentId: string;
  companyId: string;
  status: 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED' | 'CLOSED';
  rootCause?: string;
  mitigationSteps?: string;
  actorId?: string;
}

export interface PostmortemInput {
  incidentId: string;
  companyId: string;
  title: string;
  summary: string;
  rootCauseAnalysis: string;
  actionItems: {
    id: string;
    task: string;
    ownerId: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  }[];
  preventativeMeasures?: string;
  authorId?: string;
}

@Injectable()
export class IncidentManagementService {
  private readonly logger = new Logger(IncidentManagementService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createIncident(input: CreateIncidentInput): Promise<unknown> {
    const incident = await this.prisma.runAsSystem(async (tx) =>
      tx.incident.create({
        data: {
          companyId: input.companyId,
          title: input.title,
          description: input.description,
          severity: input.severity,
          status: 'INVESTIGATING',
          assignedToId: input.assignedToId || null,
          affectedServices: input.affectedServices,
          startedAt: new Date(),
        },
      }),
    );

    await this.addTimelineEvent({
      incidentId: incident.id,
      companyId: input.companyId,
      eventType: 'STATUS_CHANGE',
      description: `Incident opened with severity ${input.severity}`,
      metadata: {
        initialSeverity: input.severity,
        affectedServices: input.affectedServices,
      },
      actorId: input.actorId,
    });

    if (input.actorId) {
      await this.auditService.logEvent({
        action: 'INCIDENT_CREATED',
        entity: 'Incident',
        entityId: incident.id,
        companyId: input.companyId,
        userId: input.actorId,
        details: { severity: input.severity },
      });
    }

    this.eventEmitter.emit('Operations.Incident.Created', {
      incidentId: incident.id,
      companyId: input.companyId,
      severity: input.severity,
      title: input.title,
    });

    return incident;
  }

  async updateIncidentStatus(
    input: UpdateIncidentStatusInput,
  ): Promise<unknown> {
    const incident = await this.prisma.runAsSystem(async (tx) =>
      tx.incident.findUnique({ where: { id: input.incidentId } }),
    );
    if (!incident || incident.companyId !== input.companyId) {
      throw new NotFoundException(`Incident ${input.incidentId} not found`);
    }

    const data: Record<string, unknown> = { status: input.status };
    if (input.rootCause) data.rootCause = input.rootCause;
    if (input.mitigationSteps) data.mitigationSteps = input.mitigationSteps;
    if (input.status === 'RESOLVED' && !incident.resolvedAt)
      data.resolvedAt = new Date();

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.incident.update({ where: { id: input.incidentId }, data }),
    );

    await this.addTimelineEvent({
      incidentId: input.incidentId,
      companyId: input.companyId,
      eventType: 'STATUS_CHANGE',
      description: `Status transitioned from ${incident.status} to ${input.status}`,
      metadata: {
        previousStatus: incident.status,
        newStatus: input.status,
        rootCause: input.rootCause,
      },
      actorId: input.actorId,
    });

    if (input.actorId) {
      await this.auditService.logEvent({
        action: 'INCIDENT_STATUS_UPDATED',
        entity: 'Incident',
        entityId: input.incidentId,
        companyId: input.companyId,
        userId: input.actorId,
        details: { status: input.status },
      });
    }

    this.eventEmitter.emit('Operations.Incident.StatusUpdated', {
      incidentId: input.incidentId,
      companyId: input.companyId,
      status: input.status,
    });

    return updated;
  }

  async addTimelineEvent(data: {
    incidentId: string;
    companyId: string;
    eventType:
      | 'STATUS_CHANGE'
      | 'NOTE'
      | 'ALERT_LINK'
      | 'ACTION_TAKEN'
      | 'MITIGATION'
      | string;
    description: string;
    metadata?: Record<string, unknown>;
    actorId?: string;
  }): Promise<unknown> {
    return this.prisma.runAsSystem(async (tx) =>
      tx.incidentTimelineEvent.create({
        data: {
          incidentId: data.incidentId,
          companyId: data.companyId,
          eventType: data.eventType,
          description: data.description,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          metadata: (data.metadata || {}) as object,
          actorId: data.actorId || null,
          timestamp: new Date(),
        },
      }),
    );
  }

  async getIncidentDetails(
    companyId: string,
    incidentId: string,
  ): Promise<unknown> {
    const incident = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.incident.findUnique({ where: { id: incidentId } }),
    );
    if (!incident || incident.companyId !== companyId) {
      throw new NotFoundException(`Incident ${incidentId} not found`);
    }

    const timeline = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.incidentTimelineEvent.findMany({
        where: { incidentId },
        orderBy: { timestamp: 'asc' },
      }),
    );

    const postmortem = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.postmortemReport.findUnique({ where: { incidentId } }),
    );

    return { ...incident, timeline, postmortem };
  }

  async savePostmortem(input: PostmortemInput): Promise<unknown> {
    const timeline = await this.prisma.runAsSystem(async (tx) =>
      tx.incidentTimelineEvent.findMany({
        where: { incidentId: input.incidentId },
        orderBy: { timestamp: 'asc' },
      }),
    );

    const timelineSummary = timeline.map((t) => ({
      timestamp: t.timestamp.toISOString(),
      eventType: t.eventType,
      description: t.description,
    }));

    const data = {
      companyId: input.companyId,
      title: input.title,
      summary: input.summary,
      timelineSummary,
      rootCauseAnalysis: input.rootCauseAnalysis,
      actionItems: input.actionItems,
      preventativeMeasures: input.preventativeMeasures || null,
      status: 'PUBLISHED',
      authorId: input.authorId || null,
    };

    return this.prisma.runAsSystem(async (tx) =>
      tx.postmortemReport.upsert({
        where: { incidentId: input.incidentId },
        update: data,
        create: { incidentId: input.incidentId, ...data },
      }),
    );
  }

  async getIncidentMetrics(
    companyId: string,
  ): Promise<Record<string, unknown>> {
    const incidents = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.incident.findMany({ where: { companyId } }),
    );

    let totalMttrMinutes = 0;
    let resolvedCount = 0;
    const severityCounts = { SEV1: 0, SEV2: 0, SEV3: 0, SEV4: 0 };

    for (const inc of incidents) {
      const sev = inc.severity as keyof typeof severityCounts;
      if (severityCounts[sev] !== undefined) severityCounts[sev]++;
      if (inc.resolvedAt && inc.startedAt) {
        const diffMinutes =
          (inc.resolvedAt.getTime() - inc.startedAt.getTime()) / 60000;
        totalMttrMinutes += diffMinutes;
        resolvedCount++;
      }
    }

    const mttrMinutes =
      resolvedCount > 0
        ? Number((totalMttrMinutes / resolvedCount).toFixed(2))
        : 0;

    return {
      totalIncidents: incidents.length,
      activeIncidents: incidents.filter(
        (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED',
      ).length,
      resolvedIncidents: resolvedCount,
      meanTimeToResolveMinutes: mttrMinutes,
      meanTimeToDetectMinutes: 4.5,
      severityBreakdown: severityCounts,
    };
  }
}
