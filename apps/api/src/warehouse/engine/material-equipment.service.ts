import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class MaterialEquipmentService {
  private readonly logger = new Logger(MaterialEquipmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Register new equipment
   */
  async registerEquipment(
    companyId: string,
    warehouseId: string,
    data: { code: string; type: string },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.materialEquipment.create({
        data: {
          companyId,
          warehouseId,
          code: data.code,
          type: data.type,
        },
      }),
    );
  }

  /**
   * Assign equipment to a user / task
   */
  async checkoutEquipment(
    companyId: string,
    equipmentId: string,
    userId: string,
  ) {
    const eq = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.materialEquipment.update({
        where: { id: equipmentId, companyId },
        data: { status: 'IN_USE' },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'EQUIPMENT',
      streamId: equipmentId,
      eventType: 'EquipmentCheckedOut',
      payload: { type: eq.type, code: eq.code },
      userId,
    });

    return eq;
  }

  /**
   * Return equipment to pool
   */
  async returnEquipment(
    companyId: string,
    equipmentId: string,
    userId: string,
  ) {
    const eq = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.materialEquipment.update({
        where: { id: equipmentId, companyId },
        data: { status: 'AVAILABLE' },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'EQUIPMENT',
      streamId: equipmentId,
      eventType: 'EquipmentReturned',
      payload: { type: eq.type, code: eq.code },
      userId,
    });

    return eq;
  }
}
