import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';

export interface DigitalTwinRule {
  id: string;
  condition: (twinState: any) => boolean;
  action: (twinId: string, state: any) => void;
}

@Injectable()
export class RuleEngineService {
  private readonly logger = new Logger(RuleEngineService.name);
  private rules: DigitalTwinRule[] = [];

  constructor(private readonly prisma: PrismaService) {
    this.registerDefaultRules();
  }

  private registerDefaultRules() {
    // Example declarative rule reacting to twin state
    this.rules.push({
      id: 'maintenance-overdue',
      condition: (state: any) =>
        state.odometer > 100000 && !state.maintenanceRequested,
      action: (twinId, state) => {
        this.logger.warn(
          `Twin [${twinId}]: Maintenance Overdue! (Odometer: ${state.odometer})`,
        );
        // Emit Alert or create MaintenanceJob via EventStore
      },
    });
  }

  @OnEvent('DomainEvent.*.*')
  async evaluateRules(event: any) {
    const { tenantId, payload } = event;
    const { streamId } = payload;

    // In a pure Event Sourced system, we fetch the latest snapshot
    const snapshot = await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.findFirst({
        where: { companyId: tenantId, twinId: streamId },
      }),
    );

    if (!snapshot) return;

    for (const rule of this.rules) {
      if (rule.condition(snapshot.state)) {
        rule.action(streamId, snapshot.state);
      }
    }
  }
}
