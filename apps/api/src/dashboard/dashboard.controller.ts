import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { TenantCacheInterceptor } from '../interceptors/tenant-cache.interceptor';
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
            status: { in: ['ISSUED', 'OVERDUE', 'PAID'] },
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
  @UseInterceptors(TenantCacheInterceptor)
  @CacheKey('dashboard_kpis')
  @CacheTTL(60000)
  async getKPIs(@Req() req: any) {
    const companyId = req.user.companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      revenueTodayRes,
      outstandingRes,
      activeVehicles,
      topClientsAgg,
      recentLoads,
    ] = await this.prisma.runAsTenant(companyId, async (tx) => {
      return Promise.all([
        tx.load.count({ where: { companyId, deletedAt: null } }),
        tx.invoice.aggregate({
          _sum: { amount: true },
          where: { companyId, createdAt: { gte: today } },
        }),
        tx.invoice.aggregate({
          _sum: { amount: true },
          where: { companyId, status: { not: 'PAID' } },
        }),
        tx.vehicle.count({ where: { companyId, status: 'IN_SERVICE' } }),
        tx.invoice.groupBy({
          by: ['customerId'],
          _sum: { amount: true },
          where: { companyId },
          orderBy: { _sum: { amount: 'desc' } },
          take: 5,
        }),
        tx.load.findMany({
          where: { companyId, deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            lorryReceipts: { select: { lrNumber: true }, take: 1 }
          }
        })
      ]);
    });

    const topClientIds = topClientsAgg.map(c => c.customerId);
    const customers = await this.prisma.runAsTenant(companyId, async (tx) => 
      tx.customer.findMany({ where: { id: { in: topClientIds } }, select: { id: true, name: true } })
    );
    
    const topClients = topClientsAgg.map(tc => {
       const customer = customers.find(c => c.id === tc.customerId);
       return {
         id: tc.customerId,
         name: customer?.name || 'Unknown',
         amount: tc._sum.amount || 0
       };
    });

    const recentBookings = recentLoads.map(load => ({
      id: load.id,
      lrNumber: load.lorryReceipts?.[0]?.lrNumber || null,
      originCity: load.originCity,
      destinationCity: load.destinationCity,
      rate: load.rate,
      status: load.status,
      createdAt: load.createdAt,
    }));

    return {
      totalBookings,
      revenueToday: revenueTodayRes._sum?.amount || 0,
      outstanding: outstandingRes._sum?.amount || 0,
      activeVehicles,
      topClients,
      recentBookings
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
  async getAlerts(@Req() _req: any) {
    return []; // Return empty array to prevent 404
  }

  @Get('ai/recommendations')
  async getAIRecommendations(@Req() _req: any) {
    return []; // Return empty array to prevent 404
  }

  @Get('shipments')
  async getShipments(@Req() req: any) {
    const companyId = req.user?.companyId;
    if (!companyId) return [];
    
    // Fetch trips instead of loads to match the KPI tile "Live trips in progress"
    const trips = await this.prisma.runAsTenant(companyId, async (tx) => 
      tx.trip.findMany({
        where: { companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } },
        include: { loads: true },
        take: 50,
        orderBy: { createdAt: 'desc' }
      })
    );
    return trips.map(trip => {
      const load = trip.loads?.[0];
      return {
        id: trip.id,
        trackingNumber: trip.tripNumber,
        status: trip.status,
        origin: load ? `${load.originCity}, ${load.originState}` : 'TBD',
        destination: load ? `${load.destinationCity}, ${load.destinationState}` : 'TBD',
        eta: trip.eta ? new Date(trip.eta).toISOString() : new Date().toISOString(),
        slaStatus: 'MET'
      };
    });
  }
}
