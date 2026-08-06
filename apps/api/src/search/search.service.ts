import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(companyId: string, query: string) {
    if (!query || query.length < 2) {
      return { results: [] };
    }

    const searchQuery = `%${query}%`;

    // Perform parallel searches across domains
    const [loads, trips, customers, vehicles, drivers, invoices, documents] =
      await Promise.all([
        // 1. Loads
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.load.findMany({
            where: {
              companyId,
              OR: [
                { referenceNumber: { contains: query, mode: 'insensitive' } },
                { originCity: { contains: query, mode: 'insensitive' } },
                { destinationCity: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: {
              id: true,
              referenceNumber: true,
              originCity: true,
              destinationCity: true,
              status: true,
            },
          }),
        ),
        // 2. Trips
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.findMany({
            where: {
              companyId,
              tripNumber: { contains: query, mode: 'insensitive' },
            },
            take: 5,
            select: { id: true, tripNumber: true, status: true },
          }),
        ),
        // 3. Customers
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.customer.findMany({
            where: {
              companyId,
              name: { contains: query, mode: 'insensitive' },
            },
            take: 5,
            select: { id: true, name: true, email: true },
          }),
        ),
        // 4. Vehicles
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.findMany({
            where: {
              companyId,
              OR: [
                { licensePlate: { contains: query, mode: 'insensitive' } },
                { make: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: { id: true, licensePlate: true, make: true, model: true },
          }),
        ),
        // 5. Drivers
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.driver.findMany({
            where: {
              companyId,
              OR: [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
              ],
            },
            take: 5,
            select: { id: true, firstName: true, lastName: true },
          }),
        ),
        // 6. Invoices
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.invoice.findMany({
            where: {
              companyId,
              invoiceNumber: { contains: query, mode: 'insensitive' },
            },
            take: 5,
            select: {
              id: true,
              invoiceNumber: true,
              status: true,
              amount: true,
            },
          }),
        ),
        // 7. Documents
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.document.findMany({
            where: {
              companyId,
              fileName: { contains: query, mode: 'insensitive' },
            },
            take: 5,
            select: { id: true, fileName: true, type: true },
          }),
        ),
      ]);

    // Format the results uniformly
    const results = [
      ...loads.map((item) => ({
        type: 'load',
        id: item.id,
        title: `Load ${item.referenceNumber}`,
        description: `${item.originCity} → ${item.destinationCity}`,
        status: item.status,
        url: `/loads/${item.id}`,
      })),
      ...trips.map((item) => ({
        type: 'trip',
        id: item.id,
        title: `Trip ${item.tripNumber}`,
        description: 'Trip Route',
        status: item.status,
        url: `/trips/${item.id}`,
      })),
      ...customers.map((item) => ({
        type: 'customer',
        id: item.id,
        title: item.name,
        description: item.email || 'Customer',
        url: `/customers/${item.id}`,
      })),
      ...vehicles.map((item) => ({
        type: 'vehicle',
        id: item.id,
        title: item.licensePlate,
        description: `${item.make || ''} ${item.model || ''}`,
        url: `/fleet/vehicles/${item.id}`,
      })),
      ...drivers.map((item) => ({
        type: 'driver',
        id: item.id,
        title: `${item.firstName} ${item.lastName}`,
        description: 'Driver',
        url: `/fleet/drivers/${item.id}`,
      })),
      ...invoices.map((item) => ({
        type: 'invoice',
        id: item.id,
        title: `Invoice ${item.invoiceNumber}`,
        description: `$${item.amount}`,
        status: item.status,
        url: `/billing/${item.id}`,
      })),
      ...documents.map((item) => ({
        type: 'document',
        id: item.id,
        title: item.fileName,
        description: item.type,
        url: `/documents/${item.id}`,
      })),
    ];

    return { results };
  }
}
