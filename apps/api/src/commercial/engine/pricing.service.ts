import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma, RateCard } from '@prisma/client';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new Rate Card or a new version of an existing Rate Card
   */
  async createRateCard(companyId: string, data: any) {
    // If updating an existing route/customer, we should mark older versions as inactive or EXPIRED
    if (data.customerId && data.originCity && data.destinationCity) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.rateCard.updateMany({
          where: {
            companyId,
            customerId: data.customerId,
            originCity: data.originCity,
            destinationCity: data.destinationCity,
            status: 'APPROVED',
          },
          data: {
            status: 'EXPIRED',
            active: false,
          },
        }),
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.rateCard.create({
        data: {
          ...data,
          companyId,
          status: 'APPROVED',
          active: true,
        },
      }),
    );
  }

  /**
   * Evaluates the best available rate for a specific shipment context
   */
  async evaluateRate(
    companyId: string,
    customerId: string,
    originCity: string,
    destinationCity: string,
    equipmentType?: string,
  ): Promise<RateCard | null> {
    const now = new Date();

    // Look for exact match (route + customer)
    const rateCard = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.rateCard.findFirst({
        where: {
          companyId,
          customerId,
          originCity,
          destinationCity,
          status: 'APPROVED',
          active: true,
          OR: [
            { validFrom: null, validTo: null },
            { validFrom: { lte: now }, validTo: { gte: now } },
            { validFrom: { lte: now }, validTo: null },
          ],
          ...(equipmentType ? { equipmentType } : {}),
        },
        orderBy: { createdAt: 'desc' },
      }),
    );

    return rateCard;
  }

  /**
   * Creates a Quotation
   */
  async createQuotation(companyId: string, customerId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.quotation.create({
        data: {
          ...data,
          companyId,
          customerId,
          status: 'DRAFT',
        },
      }),
    );
  }

  /**
   * Submits a Quotation to the customer
   */
  async submitQuotation(companyId: string, quotationId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.quotation.update({
        where: { id: quotationId, companyId },
        data: { status: 'SUBMITTED' },
      }),
    );
  }

  /**
   * Approves a Quotation and converts it into a Rate Card
   */
  async convertQuotationToRateCard(companyId: string, quotationId: string) {
    const quote = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.quotation.findUnique({
        where: { id: quotationId, companyId },
      }),
    );

    if (!quote) throw new NotFoundException('Quotation not found');
    if (quote.status !== 'SUBMITTED')
      throw new BadRequestException('Only SUBMITTED quotes can be approved');

    return this.prisma.$transaction(async (tx) => {
      // 1. Mark quote as APPROVED and CONVERTED
      await tx.quotation.update({
        where: { id: quotationId },
        data: { status: 'CONVERTED' },
      });

      // 2. Generate a Rate Card from the Quote (assumes notes contains metadata or we just use totalAmount)
      // In reality, Quotation would have QuotationLineItems, but for V1 we use the totalAmount as a flat rate.
      const rateCard = await tx.rateCard.create({
        data: {
          companyId,
          customerId: quote.customerId,
          type: 'FLAT',
          rate: quote.totalAmount,
          currency: quote.currency,
          active: true,
          status: 'APPROVED',
          validFrom: new Date(),
          validTo: quote.validUntil,
        },
      });

      return rateCard;
    });
  }
}
