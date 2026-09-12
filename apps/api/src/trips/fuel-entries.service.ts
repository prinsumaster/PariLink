import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFuelEntryDto } from './dto/create-fuel-entry.dto';

@Injectable()
export class FuelEntriesService {
  constructor(private prisma: PrismaService) {}

  async addFuel(companyId: string, tripId: string, dto: CreateFuelEntryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId, companyId },
        include: {
          vehicle: { select: { id: true } },
          loads: {
            select: { originCity: true, destinationCity: true },
            take: 1,
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!trip) throw new NotFoundException('Trip not found');
      if (!trip.vehicleId || !trip.driverId) {
        throw new Error('Trip must have a vehicle and driver assigned to add fuel');
      }

      // Route key: copied from first Load at write-time. Null if no Load attached.
      const firstLoad = (trip as any).loads?.[0];
      const originCity: string | null = firstLoad?.originCity ?? null;
      const destinationCity: string | null = firstLoad?.destinationCity ?? null;

      // Expected fuel calculation (4.0 km/L fallback — vehicle mileage rating not yet in schema)
      const expectedMileage = 4.0;
      const distance = trip.actualDistance || trip.estimatedDistance || 1000;
      const expectedLitres = distance / expectedMileage;

      const variancePct = ((dto.litres - expectedLitres) / expectedLitres) * 100;

      const fuelEntry = await tx.fuelEntry.create({
        data: {
          companyId,
          tripId,
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
          litres: dto.litres,
          amount: dto.amount,
          pump: dto.pump,
          slipNo: dto.slipNo,
          filledAt: dto.filledAt ? new Date(dto.filledAt) : new Date(),
          expectedLitres,
          variancePct,
          // Route key stored at write time — no join needed later
          originCity,
          destinationCity,
        },
      });

      // Mirror into TripExpense so the finance ledger stays consistent
      await tx.tripExpense.create({
        data: {
          companyId,
          tripId,
          category: 'FUEL',
          amount: dto.amount,
          note: `Fuel fill: ${dto.litres}L at ${dto.pump || 'Pump'} (Slip: ${dto.slipNo || 'N/A'})`,
        },
      });

      await tx.trip.update({
        where: { id: tripId },
        data: { fuelExpenses: (trip.fuelExpenses || 0) + dto.amount },
      });

      return fuelEntry;
    });
  }

  async getFuelByTrip(companyId: string, tripId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId, companyId } });
      if (!trip) throw new NotFoundException('Trip not found');

      const entries = await tx.fuelEntry.findMany({
        where: { tripId, companyId },
        orderBy: { filledAt: 'asc' },
      });

      const totalLitres = entries.reduce((sum, e) => sum + e.litres, 0);
      const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
      const totalExpected = entries.reduce((sum, e) => sum + (e.expectedLitres || 0), 0);

      const overallVariancePct =
        totalExpected > 0 ? ((totalLitres - totalExpected) / totalExpected) * 100 : null;

      return { entries, totals: { totalLitres, totalAmount, overallVariancePct } };
    });
  }
}
