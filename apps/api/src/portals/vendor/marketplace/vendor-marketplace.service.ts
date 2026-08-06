import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VendorMarketplaceService {
  private readonly logger = new Logger(VendorMarketplaceService.name);

  constructor(private prisma: PrismaService) {}

  async getOpenTenders(companyId: string, vendorId: string) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tender.findMany({
        where: {
          companyId,
          status: 'OPEN',
        },
        include: {
          bids: {
            where: { vendorId },
            select: { bidAmount: true, status: true, createdAt: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async submitBid(
    companyId: string,
    vendorId: string,
    tenderId: string,
    amount: number,
  ) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenderBid.create({
        data: {
          tenderId,
          vendorId,
          bidAmount: amount,
          status: 'SUBMITTED',
        },
      }),
    );
  }
}
