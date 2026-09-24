import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuelService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getFuelLogs(companyId: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (status) where.status = status;
      
      return tx.fuelEntry.findMany({
        where,
        include: {
          vehicle: true,
          driver: true,
          trip: true,
        },
        orderBy: { filledAt: 'desc' }
      });
    });
  }

  async createFuelLog(companyId: string, dto: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Validate references
      if (dto.tripId) {
        const trip = await tx.trip.findFirst({ where: { id: dto.tripId, companyId } });
        if (!trip) throw new NotFoundException('Trip not found');
      }

      const fuelLog = await tx.fuelEntry.create({
        data: {
          companyId,
          vehicleId: dto.vehicleId,
          driverId: dto.driverId,
          tripId: dto.tripId,
          litres: dto.litres,
          amount: dto.amount,
          pump: dto.pump,
          slipNo: dto.slipNo,
          billingCustomerId: dto.billingCustomerId,
          status: 'PENDING',
        }
      });

      return fuelLog;
    });
  }

  async updateFuelLogStatus(companyId: string, id: string, status: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fuelLog = await tx.fuelEntry.findFirst({
        where: { id, companyId }
      });

      if (!fuelLog) {
        throw new NotFoundException('Fuel log not found');
      }

      if (fuelLog.status === status) {
        return fuelLog;
      }

      const updated = await tx.fuelEntry.update({
        where: { id },
        data: { status }
      });

      // If approved and has billingCustomerId, create an unbilled invoice line item
      // But wait! InvoiceLineItem requires an invoiceId!
      // The prompt says: "it should create an unbilled line-item in a hypothetical pool (or immediately draft an invoice if you prefer, but a queue/pool is better). If that's too complex, just implement the basic CRUD + Approval workflow for now."
      // Since unbilled pool doesn't exist, we will just stick to CRUD + Approval for now to keep it robust and within time.

      return updated;
    });
  }
}
