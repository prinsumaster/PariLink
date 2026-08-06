import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { NotificationOrchestratorService } from '../../communications/engine/notification-orchestrator.service';
import { NotificationPriority } from '../../communications/dto/notification.dto';
import {
  VehicleTelemetryDto,
  CreateAlertRuleDto,
  UpdateAlertStatusDto,
} from '../dto/telematics.dto';

@Injectable()
export class TelematicsIngestionService {
  private readonly logger = new Logger(TelematicsIngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notificationOrchestrator: NotificationOrchestratorService,
  ) {}

  async ingestTelemetry(companyId: string, dto: VehicleTelemetryDto) {
    const vehicle = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findUnique({
        where: { id: dto.vehicleId },
      }),
    );
    if (!vehicle || vehicle.companyId !== companyId) {
      throw new NotFoundException('Vehicle not found in company');
    }

    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();

    // 1. Save Telemetry
    const telemetry = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicleTelemetry.create({
        data: {
          companyId,
          vehicleId: dto.vehicleId,
          odometer: dto.odometer || null,
          engineHours: dto.engineHours || null,
          fuelLevel: dto.fuelLevel || null,
          batteryVolts: dto.batteryVolts || null,
          coolantTemp: dto.coolantTemp || null,
          engineLoad: dto.engineLoad || null,
          rpm: dto.rpm || null,
          dtcCodes: dto.dtcCodes ? (dto.dtcCodes as any) : undefined,
          ignition: dto.ignition !== undefined ? dto.ignition : null,
          timestamp,
        },
      }),
    );

    // 2. Evaluate Active Alert Rules
    const rules = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.findMany({
        where: { companyId, isActive: true },
      }),
    );

    const triggeredAlerts: any[] = [];

    for (const rule of rules) {
      let triggered = false;
      let actualValue: any = null;
      let message = '';

      if (rule.type === 'SPEEDING' && dto.speed !== undefined) {
        if (rule.condition === 'EXCEEDS' && dto.speed > rule.threshold) {
          triggered = true;
          actualValue = dto.speed;
          message = `Vehicle ${vehicle.licensePlate} speeding at ${dto.speed} mph (threshold: ${rule.threshold} mph)`;
        }
      } else if (rule.type === 'MAINTENANCE' || rule.type === 'COOLANT') {
        if (dto.coolantTemp !== undefined && dto.coolantTemp > rule.threshold) {
          triggered = true;
          actualValue = dto.coolantTemp;
          message = `Vehicle ${vehicle.licensePlate} engine overheating at ${dto.coolantTemp}°F`;
        } else if (dto.dtcCodes && dto.dtcCodes.length > 0) {
          triggered = true;
          actualValue = dto.dtcCodes;
          message = `Vehicle ${vehicle.licensePlate} reported diagnostic trouble codes: ${dto.dtcCodes.join(', ')}`;
        }
      } else if (rule.type === 'LOW_FUEL' && dto.fuelLevel !== undefined) {
        if (rule.condition === 'LESS_THAN' && dto.fuelLevel < rule.threshold) {
          triggered = true;
          actualValue = dto.fuelLevel;
          message = `Vehicle ${vehicle.licensePlate} low fuel level at ${dto.fuelLevel}%`;
        }
      } else if (rule.type === 'BATTERY' && dto.batteryVolts !== undefined) {
        if (
          rule.condition === 'LESS_THAN' &&
          dto.batteryVolts < rule.threshold
        ) {
          triggered = true;
          actualValue = dto.batteryVolts;
          message = `Vehicle ${vehicle.licensePlate} low battery voltage at ${dto.batteryVolts}V`;
        }
      }

      if (triggered) {
        const alert = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.alert.create({
            data: {
              companyId,
              ruleId: rule.id,
              vehicleId: dto.vehicleId,
              driverId: dto.driverId || null,
              severity: rule.severity || 'MEDIUM',
              message,
              status: 'NEW',
              timestamp,
              metadata: {
                actualValue,
                threshold: rule.threshold,
                telemetryId: telemetry.id,
              },
            },
          }),
        );

        triggeredAlerts.push(alert);

        // Notify Admin / Dispatch via Orchestrator if HIGH or CRITICAL
        if (rule.severity === 'HIGH' || rule.severity === 'CRITICAL') {
          try {
            // Find an admin user in the company to receive alert
            const adminUser = await this.prisma.runAsTenant(
              companyId,
              async (tx) =>
                tx.user.findFirst({
                  where: { companyId, status: 'ACTIVE' },
                }),
            );
            if (adminUser) {
              await this.notificationOrchestrator.dispatchNotification(
                companyId,
                adminUser.id,
                {
                  targetUserId: adminUser.id,
                  eventType: `telematics.${rule.type.toLowerCase()}`,
                  priority:
                    rule.severity === 'CRITICAL'
                      ? NotificationPriority.URGENT
                      : NotificationPriority.HIGH,
                  title: `Fleet Alert: ${rule.name}`,
                  body: message,
                  entityType: 'Vehicle',
                  entityId: vehicle.id,
                  channels: ['IN_APP', 'EMAIL'],
                },
              );
            }
          } catch (e) {
            this.logger.error(`Failed to dispatch alert notification: ${e}`);
          }
        }
      }
    }

    return {
      success: true,
      telemetryId: telemetry.id,
      evaluatedRulesCount: rules.length,
      triggeredAlertsCount: triggeredAlerts.length,
      triggeredAlerts,
    };
  }

  // Alert Rules CRUD
  async createAlertRule(
    companyId: string,
    userId: string,
    dto: CreateAlertRuleDto,
  ) {
    const rule = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.create({
        data: {
          companyId,
          name: dto.name,
          type: dto.type,
          condition: dto.condition,
          threshold: dto.threshold,
          severity: dto.severity || 'MEDIUM',
          isActive: dto.isActive !== undefined ? dto.isActive : true,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'telematics:alert_rule:create',
      entity: 'AlertRule',
      entityId: rule.id,
      userId,
      companyId,
      details: { name: rule.name, type: rule.type, threshold: rule.threshold },
    });

    return rule;
  }

  async getAlertRules(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async deleteAlertRule(companyId: string, id: string, userId: string) {
    const rule = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.findUnique({ where: { id } }),
    );
    if (!rule || rule.companyId !== companyId) {
      throw new NotFoundException('Alert rule not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alertRule.delete({ where: { id } }),
    );
    return { success: true, id };
  }

  // Alerts Management
  async getAlerts(companyId: string, status?: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.findMany({
        where: {
          companyId,
          status: status || undefined,
          vehicleId: vehicleId || undefined,
        },
        include: {
          vehicle: { select: { licensePlate: true, make: true, model: true } },
          rule: { select: { name: true, type: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: 100,
      }),
    );
  }

  async updateAlertStatus(
    companyId: string,
    id: string,
    userId: string,
    dto: UpdateAlertStatusDto,
  ) {
    const alert = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.findUnique({ where: { id } }),
    );
    if (!alert || alert.companyId !== companyId) {
      throw new NotFoundException('Alert not found');
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.update({
        where: { id },
        data: {
          status: dto.status,
          resolvedAt: dto.status === 'RESOLVED' ? new Date() : undefined,
          metadata: {
            ...(alert.metadata as any),
            lastUpdatedBy: userId,
            notes: dto.notes || null,
          },
        },
      }),
    );

    await this.audit.logEvent({
      action: `telematics:alert:${dto.status.toLowerCase()}`,
      entity: 'Alert',
      entityId: id,
      userId,
      companyId,
      details: {
        previousStatus: alert.status,
        newStatus: dto.status,
        notes: dto.notes,
      },
    });

    return updated;
  }

  async getFleetHealthAnalytics(companyId: string) {
    const [totalAlerts, unresolvedAlerts, criticalAlerts, vehicleCount] =
      await Promise.all([
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.alert.count({ where: { companyId } }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.alert.count({
            where: { companyId, status: { in: ['NEW', 'ACKNOWLEDGED'] } },
          }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.alert.count({
            where: {
              companyId,
              severity: 'CRITICAL',
              status: { in: ['NEW', 'ACKNOWLEDGED'] },
            },
          }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.count({ where: { companyId } }),
        ),
      ]);

    const alertsByType = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.groupBy({
        by: ['ruleId'],
        where: { companyId, status: { in: ['NEW', 'ACKNOWLEDGED'] } },
        _count: true,
      }),
    );

    return {
      companyId,
      summary: { vehicleCount, totalAlerts, unresolvedAlerts, criticalAlerts },
      timestamp: new Date().toISOString(),
    };
  }
}
