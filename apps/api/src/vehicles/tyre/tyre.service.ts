import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TyreService {
  constructor(private readonly prisma: PrismaService) {}

  async fitTyre(companyId: string, vehicleId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.create({
        data: {
          companyId,
          vehicleId,
          position: data.position,
          serialNo: data.serialNo,
          brand: data.brand,
          fittedAtKm: data.fittedAtKm,
          expectedLifeKm: data.expectedLifeKm || 100000,
          cost: data.cost,
          status: 'ACTIVE',
        },
      });
      return tyre;
    });
  }

  async removeTyre(companyId: string, tyreId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tyre = await tx.tyre.update({
        where: { id: tyreId, companyId },
        data: {
          status: 'REMOVED',
          removedAtKm: data.removedAtKm,
        },
      });
      return tyre;
    });
  }

  async getVehicleTyres(companyId: string, vehicleId: string, currentKm: number) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId, companyId } });
      if (!vehicle) throw new NotFoundException('Vehicle not found');

      const tyres = await tx.tyre.findMany({
        where: { vehicleId, companyId, status: 'ACTIVE' },
      });

      return tyres.map(tyre => {
        // Assume fallback for UI if currentKm is not provided or is lower than fittedAtKm
        const actualCurrentKm = (!currentKm || currentKm < tyre.fittedAtKm) 
            ? tyre.fittedAtKm + 5000 
            : currentKm;
            
        const kmDriven = actualCurrentKm - tyre.fittedAtKm;
        const lifeUsedPct = (kmDriven / tyre.expectedLifeKm) * 100;
        const costPerKm = kmDriven > 0 ? tyre.cost / kmDriven : 0;

        return {
          ...tyre,
          kmDriven,
          lifeUsedPct: Number(lifeUsedPct.toFixed(1)),
          costPerKm: Number(costPerKm.toFixed(2)),
        };
      });
    });
  }
}
