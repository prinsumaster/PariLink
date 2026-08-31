import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuelEntriesService {
  constructor(private prisma: PrismaService) {}

  async addFuel(companyId: string, tripId: string, dto: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId, companyId },
        include: { vehicle: true }
      });

      if (!trip) throw new NotFoundException('Trip not found');
      if (!trip.vehicleId || !trip.driverId) {
        throw new Error('Trip must have a vehicle and driver assigned to add fuel');
      }

      // Calculate expected vs actual
      const expectedMileage = 4.0; // Default km/L fallback
      const distance = trip.actualDistance || trip.estimatedDistance || 1000;
      const expectedLitres = distance / expectedMileage;
      
      const variancePct = ((dto.litres - expectedLitres) / expectedLitres) * 100;

      // Create fuel entry
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
        }
      });

      // Update trip expenses
      await tx.tripExpense.create({
        data: {
          companyId,
          tripId,
          category: 'FUEL',
          amount: dto.amount,
          note: `Fuel fill: ${dto.litres}L at ${dto.pump || 'Pump'} (Slip: ${dto.slipNo || 'N/A'})`,
        }
      });

      const updatedFuelExpenses = (trip.fuelExpenses || 0) + dto.amount;

      await tx.trip.update({
        where: { id: tripId },
        data: { fuelExpenses: updatedFuelExpenses }
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
        orderBy: { filledAt: 'asc' }
      });

      const totalLitres = entries.reduce((sum, e) => sum + e.litres, 0);
      const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
      const totalExpected = entries.reduce((sum, e) => sum + (e.expectedLitres || 0), 0);
      
      const overallVariancePct = totalExpected > 0 
        ? ((totalLitres - totalExpected) / totalExpected) * 100 
        : null;

      return {
        entries,
        totals: {
          totalLitres,
          totalAmount,
          overallVariancePct
        }
      };
    });
  }
}
