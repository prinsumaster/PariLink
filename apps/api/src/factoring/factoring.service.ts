import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitFactoringDto } from './dto/submit-factoring.dto';

@Injectable()
export class FactoringService {
  constructor(private prisma: PrismaService) {}

  async submitInvoiceForFactoring(
    companyId: string,
    userId: string,
    dto: SubmitFactoringDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Verify customer exists
      const customer = await tx.customer.findFirst({
        where: { id: dto.customerId },
      });
      if (!customer) throw new BadRequestException('Customer not found');

      // Create Invoice with Factoring status
      const invoice = await tx.invoice.create({
        data: {
          companyId,
          customerId: dto.customerId,
          loadId: dto.loadId,
          invoiceNumber: dto.invoiceNumber,
          amount: dto.amount,
          status: 'FACTORING_PENDING',
          notes: 'Submitted for QuickPay Factoring',
          lineItems: {
            create: [
              {
                description: 'Freight Haul Factoring',
                amount: dto.amount,
                unitPrice: dto.amount,
                type: 'LINE_HAUL',
              },
            ],
          },
        },
      });

      // Create Document (BOL)
      const document = await tx.document.create({
        data: {
          companyId,
          loadId: dto.loadId,
          type: 'BOL',
          fileUrl: dto.bolFileUrl,
          fileName: dto.bolFileName,
          uploadedById: userId,
        },
      });

      return { invoice, document };
    });
  }

  async getFactoringDashboard(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Get limited list of recent invoices for UI display
      const invoices = await tx.invoice.findMany({
        where: {
          status: {
            in: [
              'FACTORING_PENDING',
              'FACTORING_APPROVED',
              'FACTORING_FUNDED',
              'FACTORING_REJECTED',
            ],
          },
        },
        include: {
          customer: true,
          load: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Prevent OOM by limiting list view
      });

      // 2. Perform DB-level aggregations for metrics
      const pendingAgg = await tx.invoice.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where: { status: { in: ['FACTORING_PENDING', 'FACTORING_APPROVED'] } },
      });

      const fundedAgg = await tx.invoice.aggregate({
        _sum: { amount: true },
        _count: { id: true },
        where: { status: 'FACTORING_FUNDED' },
      });

      const rejectedCount = await tx.invoice.count({
        where: { status: 'FACTORING_REJECTED' },
      });

      return {
        invoices,
        metrics: {
          pendingAmount: pendingAgg._sum.amount || 0,
          fundedAmount: fundedAgg._sum.amount || 0,
          totalSubmitted:
            pendingAgg._count.id + fundedAgg._count.id + rejectedCount,
        },
      };
    });
  }

  async connectStripe(companyId: string) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new ServiceUnavailableException(
        'Stripe integration is not configured for Factoring.',
      );
    }
    // In production, initialize Stripe and create an onboarding link
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    // const accountLink = await stripe.accountLinks.create({ ... });
    // return { url: accountLink.url, message: 'Redirecting to Stripe...' };

    return {
      url: `/dashboard/factoring/setup?session=${Date.now()}`,
      message: 'Redirecting to Factoring setup...',
    };
  }
}
