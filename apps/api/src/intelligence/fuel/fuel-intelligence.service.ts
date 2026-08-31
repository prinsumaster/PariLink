import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FuelIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnomalies(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);
      
      const entries = await tx.fuelEntry.findMany({
        where: { companyId, filledAt: { gte: recentDate } },
        include: {
          vehicle: { select: { id: true, licensePlate: true, type: true } },
          driver: { select: { id: true, firstName: true, lastName: true } },
          trip: { select: { id: true, tripNumber: true } }
        }
      });

      const anomalies: any[] = [];

      entries.forEach((entry: any) => {
        if (entry.variancePct > 25) {
          anomalies.push({
            entityType: 'TRIP',
            entityId: entry.tripId,
            entityName: `Trip ${entry.trip?.tripNumber || 'Unknown'}`,
            variancePct: Number(entry.variancePct.toFixed(1)),
            cause: 'INVESTIGATE',
            description: `Trip ${entry.trip?.tripNumber} used ${entry.variancePct.toFixed(1)}% over expected fuel.`,
            severity: 'HIGH'
          });
        }
      });

      const truckMap = new Map();
      const driverMap = new Map();

      entries.forEach((entry: any) => {
        if (!entry.vehicleId || !entry.driverId) return;

        if (!truckMap.has(entry.vehicleId)) {
          truckMap.set(entry.vehicleId, {
            name: entry.vehicle?.licensePlate || entry.vehicleId,
            variances: [],
            drivers: new Set()
          });
        }
        truckMap.get(entry.vehicleId).variances.push(entry.variancePct);
        truckMap.get(entry.vehicleId).drivers.add(entry.driverId);

        if (!driverMap.has(entry.driverId)) {
          driverMap.set(entry.driverId, {
            name: `${entry.driver?.firstName || ''} ${entry.driver?.lastName || ''}`.trim() || entry.driverId,
            variances: [],
            trucks: new Set()
          });
        }
        driverMap.get(entry.driverId).variances.push(entry.variancePct);
        driverMap.get(entry.driverId).trucks.add(entry.vehicleId);
      });

      truckMap.forEach((data, vehicleId) => {
        const avgVariance = data.variances.reduce((a: number, b: number) => a + b, 0) / data.variances.length;
        if (avgVariance > 15 && data.drivers.size > 0) {
          anomalies.push({
            entityType: 'TRUCK',
            entityId: vehicleId,
            entityName: data.name,
            variancePct: Number(avgVariance.toFixed(1)),
            cause: 'MECHANICAL',
            description: `Truck ${data.name} used ${avgVariance.toFixed(1)}% over expected across ${data.variances.length} trips (different drivers). Likely mechanical.`,
            severity: avgVariance > 25 ? 'HIGH' : 'MEDIUM'
          });
        }
      });

      driverMap.forEach((data, driverId) => {
        const avgVariance = data.variances.reduce((a: number, b: number) => a + b, 0) / data.variances.length;
        if (avgVariance > 15 && data.trucks.size > 0) {
          anomalies.push({
            entityType: 'DRIVER',
            entityId: driverId,
            entityName: data.name,
            variancePct: Number(avgVariance.toFixed(1)),
            cause: 'DRIVER PILFERAGE',
            description: `Driver ${data.name} used ${avgVariance.toFixed(1)}% over expected across ${data.variances.length} trips. Potential pilferage.`,
            severity: avgVariance > 25 ? 'HIGH' : 'MEDIUM'
          });
        }
      });

      anomalies.sort((a: any, b: any) => b.variancePct - a.variancePct);

      return anomalies;
    });
  }

  async getSummary(companyId: string) {
    const anomalies = await this.getAnomalies(companyId);
    
    const worstTrucks = anomalies.filter((a: any) => a.entityType === 'TRUCK').slice(0, 5);
    const worstDrivers = anomalies.filter((a: any) => a.entityType === 'DRIVER').slice(0, 5);
    const criticalTrips = anomalies.filter((a: any) => a.entityType === 'TRIP').slice(0, 5);

    return {
      worstTrucks,
      worstDrivers,
      criticalTrips,
      totalAnomalies: anomalies.length
    };
  }
}
