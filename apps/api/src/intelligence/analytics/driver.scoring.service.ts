import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverScoringService {
  private readonly logger = new Logger(DriverScoringService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('Alert.Triggered')
  async handleAlert(event: any) {
    const { tenantId, payload } = event;
    const { alertId, ruleType } = payload;

    if (ruleType !== 'SPEEDING' && ruleType !== 'HARSH_BRAKING') return;

    const alert = await this.prisma.runAsSystem(async (tx) =>
      tx.alert.findUnique({
        where: { id: alertId },
        include: { driver: true },
      }),
    );

    if (!alert || !alert.driverId) return;

    // Deduct points based on severity
    // Note: A robust system would keep a historical scorecard ledger, but we log the logic here.
    const penalty =
      alert.severity === 'CRITICAL' ? 10 : alert.severity === 'HIGH' ? 5 : 2;

    this.logger.debug(
      `Deducting ${penalty} safety points from Driver ${alert.driverId} due to ${ruleType} alert`,
    );

    // Assume driver has a 'safetyScore' field added later, or an Analytics projection calculates this on the fly.
  }
}
