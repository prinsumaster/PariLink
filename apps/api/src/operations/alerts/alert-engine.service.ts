import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface AlertTriggerInput {
  companyId: string;
  ruleId?: string;
  type:
    | 'THRESHOLD'
    | 'HEALTH'
    | 'QUEUE'
    | 'WORKFLOW'
    | 'SECURITY'
    | 'NOTIFICATION'
    | 'WEBHOOK'
    | string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  metadata?: Record<string, unknown>;
  vehicleId?: string;
  driverId?: string;
}

@Injectable()
export class AlertEngineService {
  private readonly logger = new Logger(AlertEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async isUnderMaintenance(
    companyId: string,
    serviceName: string,
  ): Promise<boolean> {
    const now = new Date();
    const activeWindows = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.maintenanceWindow.findMany({
        where: {
          companyId,
          isActive: true,
          startTime: { lte: now },
          endTime: { gte: now },
        },
      }),
    );
    for (const w of activeWindows) {
      const affected = (w.affectedServices as string[]) || [];
      if (affected.includes('ALL') || affected.includes(serviceName))
        return true;
    }
    return false;
  }

  async triggerAlert(input: AlertTriggerInput): Promise<unknown> {
    if (await this.isUnderMaintenance(input.companyId, input.type)) {
      this.logger.log(
        `[Alert Engine] Alert suppressed for ${input.type} due to active Maintenance Window.`,
      );
      return { suppressed: true, reason: 'MAINTENANCE_WINDOW_ACTIVE' };
    }

    let ruleId = input.ruleId;
    if (!ruleId) {
      let rule = await this.prisma.runAsSystem(async (tx) =>
        tx.alertRule.findFirst({
          where: { companyId: input.companyId, type: input.type },
        }),
      );
      if (!rule) {
        rule = await this.prisma.runAsSystem(async (tx) =>
          tx.alertRule.create({
            data: {
              companyId: input.companyId,
              name: `System Rule - ${input.type}`,
              type: input.type,
              condition: 'EXCEEDS',
              threshold: 0,
              severity: input.severity,
              isActive: true,
            },
          }),
        );
      }
      ruleId = rule.id;
    }

    const alert = await this.prisma.runAsSystem(async (tx) =>
      tx.alert.create({
        data: {
          companyId: input.companyId,
          ruleId,
          vehicleId: input.vehicleId || null,
          driverId: input.driverId || null,
          severity: input.severity,
          message: input.message,
          status: 'NEW',
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          metadata: (input.metadata || {}) as object,
        },
      }),
    );

    await this.processEscalation(input.companyId, alert);

    this.eventEmitter.emit('Operations.Alert.Triggered', {
      alertId: alert.id,
      companyId: input.companyId,
      type: input.type,
      severity: input.severity,
      message: input.message,
    });

    return alert;
  }

  async evaluateThresholds(
    companyId: string,
    metricName: string,
    value: number,
    subsystem: string,
  ): Promise<void> {
    const rules = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.findMany({
        where: { companyId, type: subsystem, isActive: true },
      }),
    );

    for (const rule of rules) {
      let triggered = false;
      if (rule.condition === 'EXCEEDS' && value > rule.threshold)
        triggered = true;
      else if (rule.condition === 'LESS_THAN' && value < rule.threshold)
        triggered = true;
      else if (rule.condition === 'MATCHES' && value === rule.threshold)
        triggered = true;

      if (triggered) {
        await this.triggerAlert({
          companyId,
          ruleId: rule.id,
          type: subsystem,
          severity:
            (rule.severity as 'CRITICAL' | 'LOW' | 'MEDIUM' | 'HIGH') || 'HIGH',
          message: `Threshold breached for ${metricName}: observed value ${value} ${rule.condition} threshold ${rule.threshold}`,
          metadata: {
            metricName,
            value,
            threshold: rule.threshold,
            condition: rule.condition,
          },
        });
      }
    }
  }

  async processEscalation(
    companyId: string,
    alert: { severity: string; id: string },
  ): Promise<void> {
    try {
      const policy = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.alertEscalationPolicy.findFirst({
          where: { companyId, isActive: true, severity: alert.severity },
        }),
      );
      if (!policy) return;
      const steps =
        (policy.steps as {
          delayMinutes?: number;
          targetRoles?: string[];
          channels?: string[];
        }[]) || [];
      this.logger.log(
        `[Alert Engine] Executing escalation policy "${policy.name}" (${steps.length} steps) for alert ${alert.id}`,
      );
      for (const step of steps) {
        this.eventEmitter.emit('Operations.Alert.EscalateStep', {
          alertId: alert.id,
          delayMinutes: step.delayMinutes || 0,
          targetRoles: step.targetRoles || ['ADMIN'],
          channels: step.channels || ['EMAIL'],
        });
      }
    } catch (e: unknown) {
      this.logger.error(
        `Escalation processing failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  async acknowledgeAlert(
    companyId: string,
    alertId: string,
    userId?: string,
  ): Promise<unknown> {
    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.update({
        where: { id: alertId },
        data: { status: 'ACKNOWLEDGED' },
      }),
    );
    if (userId) {
      await this.auditService.logEvent({
        action: 'ALERT_ACKNOWLEDGED',
        entity: 'Alert',
        entityId: alertId,
        companyId,
        userId,
        details: { status: 'ACKNOWLEDGED' },
      });
    }
    return updated;
  }

  async resolveAlert(
    companyId: string,
    alertId: string,
    userId?: string,
  ): Promise<unknown> {
    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.update({
        where: { id: alertId },
        data: { status: 'RESOLVED', resolvedAt: new Date() },
      }),
    );
    if (userId) {
      await this.auditService.logEvent({
        action: 'ALERT_RESOLVED',
        entity: 'Alert',
        entityId: alertId,
        companyId,
        userId,
        details: { status: 'RESOLVED' },
      });
    }
    return updated;
  }

  async createMaintenanceWindow(data: {
    companyId: string;
    name: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    affectedServices: string[];
  }): Promise<unknown> {
    return this.prisma.runAsSystem(async (tx) =>
      tx.maintenanceWindow.create({
        data: {
          companyId: data.companyId,
          name: data.name,
          description: data.description || null,
          startTime: data.startTime,
          endTime: data.endTime,
          affectedServices: data.affectedServices,
          isActive: true,
        },
      }),
    );
  }

  async createEscalationPolicy(data: {
    companyId: string;
    name: string;
    severity: string;
    steps: Record<string, unknown>[];
  }): Promise<unknown> {
    return this.prisma.runAsSystem(async (tx) =>
      tx.alertEscalationPolicy.create({
        data: {
          companyId: data.companyId,
          name: data.name,
          severity: data.severity,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          steps: data.steps as object[],
          isActive: true,
        },
      }),
    );
  }
}
