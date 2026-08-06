import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';

@Injectable()
export class ComplianceEngine {
  private readonly logger = new Logger(ComplianceEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
  ) {}

  /**
   * Evaluates document expiry for Fleet Assets (Vehicles/Drivers).
   */
  async evaluateDocumentCompliance(
    companyId: string,
    assetType: 'VEHICLE' | 'DRIVER',
    assetId: string,
    documents: any[],
  ) {
    this.logger.log(`Evaluating compliance for ${assetType} ${assetId}`);

    const now = new Date();
    const expiryThreshold = new Date();
    expiryThreshold.setDate(now.getDate() + 30); // Alert 30 days prior

    let isCompliant = true;
    let criticalExpiry = false;

    for (const doc of documents) {
      if (doc.expiryDate) {
        const expiry = new Date(doc.expiryDate);

        if (expiry < now) {
          isCompliant = false;
          criticalExpiry = true;
          this.logger.error(
            `Critical Compliance Failure: ${doc.type} expired on ${assetType} ${assetId}`,
          );

          await this.eventStore.append({
            tenantId: companyId,
            streamId: assetId,
            streamType: assetType,
            eventType: 'DocumentExpired',
            payload: { type: doc.type, expiry: doc.expiryDate },
            userId: 'SYSTEM',
          });
        } else if (expiry < expiryThreshold) {
          // Warning threshold
          this.logger.warn(
            `Compliance Warning: ${doc.type} expiring soon on ${assetType} ${assetId}`,
          );

          await this.eventStore.append({
            tenantId: companyId,
            streamId: assetId,
            streamType: assetType,
            eventType: 'DocumentExpiring',
            payload: { type: doc.type, expiry: doc.expiryDate },
            userId: 'SYSTEM',
          });
        }
      }
    }

    // Auto-block asset if critically non-compliant
    if (criticalExpiry) {
      try {
        const model = (this.prisma as any)[assetType.toLowerCase()];
        const asset = await model.findUnique({
          where: { id: assetId },
          select: { status: true },
        });

        if (asset && asset.status === 'ACTIVE') {
          await this.lifecycle.transitionState({
            companyId,
            entityType: assetType === 'VEHICLE' ? 'Vehicle' : 'Driver',
            entityId: assetId,
            fromState: asset.status,
            toState: 'BLOCKED',
            userId: 'SYSTEM',
            reason: 'Auto-blocked due to expired critical compliance documents',
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(
          `Failed to auto-block non-compliant asset: ${errorMessage}`,
        );
      }
    }

    return isCompliant;
  }
}
