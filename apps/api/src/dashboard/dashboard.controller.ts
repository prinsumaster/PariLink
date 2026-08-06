import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class ExecutiveDashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('ceo')
  @Throttle({ default: { limit: 500, ttl: 60000 } }) // Prevent DDoS on heavy read-replica queries (500 requests per minute)
  async getCeoMetrics(@Req() req: any) {
    const companyId = req.user.companyId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Run parallel aggregation queries optimized for read-replicas
    const [revenue, expenses, activeTrips, idleTrucks] = await Promise.all([
      // Today's Revenue (Generated Invoices)
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
      // Today's Expenses (Fuel, Toll, Cash)
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.expense.aggregate({
          _sum: { amount: true },
          where: { companyId, date: { gte: today } },
        }),
      ),
      // Active Trips Count
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.count({
          where: { companyId, status: 'IN_TRANSIT' },
        }),
      ),
      // Idle Trucks Count (Assuming no active trip means idle)
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
}
