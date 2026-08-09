import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class UniversalSearchController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async globalSearch(@Query('q') query: string, @Req() req: any) {
    if (!query || query.length < 2) return [];

    const companyId = req.user.companyId;

    // Execute parallel fuzzy searches across core tables using Postgres partial matching.
    // In production, this would route to ElasticSearch or Typesense.
    const [vehicles, drivers, invoices, customers] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.findMany({
          where: {
            companyId,
            licensePlate: { contains: query, mode: 'insensitive' },
          },
          take: 5,
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.driver.findMany({
          where: {
            companyId,
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query } },
            ],
          },
          take: 5,
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.invoice.findMany({
          where: { companyId, id: { contains: query, mode: 'insensitive' } },
          take: 5,
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.customer.findMany({
          where: { companyId, name: { contains: query, mode: 'insensitive' } },
          take: 5,
        }),
      ),
    ]);

    // Format for the frontend CMD+K palette
    return [
      ...vehicles.map((v: any) => ({
        type: 'Vehicle',
        id: v.id,
        label: v.licensePlate,
      })),
      ...drivers.map((d: any) => ({
        type: 'Driver',
        id: d.id,
        label: `${d.firstName} (${d.phone})`,
      })),
      ...invoices.map((i: any) => ({ type: 'Invoice', id: i.id, label: i.id })),
      ...customers.map((c: any) => ({
        type: 'Customer',
        id: c.id,
        label: c.name,
      })),
    ];
  }
}
