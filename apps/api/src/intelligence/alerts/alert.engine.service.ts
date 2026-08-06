import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../../platform/events/event.service';

@Injectable()
export class AlertEngineService {
  private readonly logger = new Logger(AlertEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  @OnEvent('GpsPing.Received')
  async evaluateGpsPing(event: any) {
    const { tenantId, payload, timestamp } = event;
    const { vehicleId, speed, fuelLevel } = payload;

    const rules = await this.prisma.runAsSystem(async (tx) =>
      tx.alertRule.findMany({
        where: { companyId: tenantId, isActive: true },
      }),
    );

    for (const rule of rules) {
      if (rule.type === 'SPEEDING' && speed !== undefined) {
        if (rule.condition === 'EXCEEDS' && speed > rule.threshold) {
          await this.triggerAlert(tenantId, rule, vehicleId, timestamp, {
            speed,
          });
        }
      } else if (rule.type === 'LOW_FUEL' && fuelLevel !== undefined) {
        if (rule.condition === 'LESS_THAN' && fuelLevel < rule.threshold) {
          await this.triggerAlert(tenantId, rule, vehicleId, timestamp, {
            fuelLevel,
          });
        }
      }
    }
  }

  private async triggerAlert(
    companyId: string,
    rule: any,
    vehicleId: string,
    timestamp: string,
    metadata: any,
  ) {
    // Deduplication: Don't trigger if there's already an active (NEW/ACKNOWLEDGED) alert for this rule & vehicle
    const activeAlert = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.findFirst({
        where: {
          companyId,
          ruleId: rule.id,
          vehicleId,
          status: { in: ['NEW', 'ACKNOWLEDGED'] },
        },
      }),
    );

    if (activeAlert) return; // Prevent alert spam

    const alert = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.alert.create({
        data: {
          companyId,
          ruleId: rule.id,
          vehicleId,
          severity: rule.severity,
          message: `Alert: ${rule.name} triggered.`,
          timestamp: new Date(timestamp),
          metadata,
        },
      }),
    );

    this.logger.warn(
      `Alert Generated [${rule.severity}]: ${rule.name} for Vehicle ${vehicleId}`,
    );

    this.eventService.publish('Alert.Triggered', {
      tenantId: companyId,
      userId: 'SYSTEM',
      correlationId: `alert-${alert.id}`,
      payload: { alertId: alert.id, ruleType: rule.type },
      timestamp: new Date(timestamp),
    });
  }
}
