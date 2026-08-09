import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class ExecutiveDashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('ceo')
  async getCeoMetrics(@Req() req: any) {
    const companyId = req.user.companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [revenue, expenses, activeTrips, idleTrucks] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.invoice.aggregate({
          _sum: { amount: true },
          where: {
            companyId,
            createdAt: { gte: today },
            status: { in: ['GENERATED', 'PAID'] },
          },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.expense.aggregate({
          _sum: { amount: true },
          where: { companyId, date: { gte: today } },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.count({
          where: { companyId, status: 'IN_TRANSIT' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.count({
          where: {
            companyId,
            status: 'ACTIVE',
            tripsVehicle: { none: { status: 'IN_TRANSIT' } },
          },
        }),
      ),
    ]);

    return {
      todaysRevenue: revenue._sum?.amount || 0,
      todaysExpenses: expenses._sum?.amount || 0,
      activeTrips,
      idleTrucks,
      cashPosition: (revenue._sum?.amount || 0) - (expenses._sum?.amount || 0),
    };
  }

  @Get('kpis')
  async getKPIs(@Req() req: any) {
    // Return structured default data mapped to KPIData interface until fully wired
    return {
      activeShipments: { value: 0, change: 0, trend: 'neutral' },
      deliveriesToday: { value: 0, change: 0, trend: 'neutral' },
      fleetUtilization: { value: 0, change: 0, trend: 'neutral' },
      delayedShipments: { value: 0, change: 0, trend: 'neutral' },
      revenue: { value: 0, change: 0, trend: 'neutral' },
      profitMargin: { value: 0, change: 0, trend: 'neutral' },
      fuelEfficiency: { value: 0, change: 0, trend: 'neutral' },
      maintenanceAlerts: { value: 0, change: 0, trend: 'neutral' },
      vehiclesOnline: { value: 0, total: 0 },
      driversOnline: { value: 0, total: 0 },
      averageEtaMinutes: { value: 0, change: 0, trend: 'neutral' },
      revenueToday: { value: 0, change: 0, trend: 'neutral' },
    };
  }

  @Get('vehicles')
  async getVehicles(@Req() req: any) {
    const companyId = req.user?.companyId;
    if (!companyId) return [];
    
    // Limit to 100 for safety, map to LiveVehicle
    const vehicles = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findMany({
        where: { companyId, status: 'ACTIVE' },
        take: 100,
      })
    );
    return vehicles.map(v => ({
      id: v.id,
      name: v.licensePlate || 'Unknown',
      lat: 0, // Fallback coordinates
      lng: 0,
      status: 'IDLE',
      heading: 0,
      speed: 0
    }));
  }

  @Get('alerts')
  async getAlerts(@Req() req: any) {
    return []; // Return empty array to prevent 404
  }

  @Get('ai/recommendations')
  async getAIRecommendations(@Req() req: any) {
    return []; // Return empty array to prevent 404
  }

  @Get('shipments')
  async getShipments(@Req() req: any) {
    const companyId = req.user?.companyId;
    if (!companyId) return [];
    
    // Fetch loads, map to ShipmentSummary
    const loads = await this.prisma.runAsTenant(companyId, async (tx) => 
      tx.load.findMany({
        where: { companyId },
        take: 50,
        orderBy: { createdAt: 'desc' }
      })
    );
    return loads.map(load => ({
      id: load.id,
      trackingNumber: load.referenceNumber || load.id.slice(0,8).toUpperCase(),
      status: load.status,
      origin: `${load.originCity}, ${load.originState}`,
      destination: `${load.destinationCity}, ${load.destinationState}`,
      eta: new Date().toISOString(),
      slaStatus: 'MET'
    }));
  }
}
