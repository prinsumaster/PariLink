import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VendorOperationsService {
  private readonly logger = new Logger(VendorOperationsService.name);

  constructor(private prisma: PrismaService) {}

  async getAssignedTenders(companyId: string, vendorId: string) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    // An assigned load/tender is one where the vendor's bid was ACCEPTED
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenderBid.findMany({
        where: {
          vendorId,
          status: 'ACCEPTED',
          tender: {
            companyId,
          },
        },
        include: {
          tender: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
    );
  }

  async uploadPod(
    companyId: string,
    vendorId: string,
    tenderBidId: string,
    documentUrl: string,
  ) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    const bid = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenderBid.findUnique({
        where: { id: tenderBidId, vendorId },
      }),
    );

    if (!bid) {
      throw new UnauthorizedException('Bid not found or access denied');
    }

    // Since we don't have a direct POD table, we'd theoretically create a Document here.
    // We'll update the bid's note as a placeholder if there's no Document relation on TenderBid.
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenderBid.update({
        where: { id: tenderBidId },
        data: {
          notes: `POD Uploaded: ${documentUrl}`,
        },
      }),
    );
  }
}
