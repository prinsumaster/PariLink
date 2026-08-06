import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenderService {
  private readonly logger = new Logger(TenderService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new Tender for carrier bidding
   */
  async createTender(companyId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tender.create({
        data: {
          ...data,
          companyId,
          status: 'OPEN',
        },
      }),
    );
  }

  /**
   * Submits a bid from a carrier/vendor for an open tender
   */
  async submitBid(
    companyId: string,
    tenderId: string,
    vendorId: string,
    data: any,
  ) {
    const tender = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tender.findUnique({
        where: { id: tenderId, companyId },
      }),
    );

    if (!tender) throw new NotFoundException('Tender not found');
    if (tender.status !== 'OPEN')
      throw new BadRequestException('Tender is not OPEN');

    // Check if past deadline
    if (tender.submissionDeadline && new Date() > tender.submissionDeadline) {
      throw new BadRequestException('Tender submission deadline has passed');
    }

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tenderBid.create({
        data: {
          ...data,
          tenderId,
          vendorId,
          status: 'SUBMITTED',
        },
      }),
    );
  }

  /**
   * Awards the tender to a specific bid and closes the tender
   */
  async awardTender(companyId: string, tenderId: string, winningBidId: string) {
    const tender = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tender.findUnique({
        where: { id: tenderId, companyId },
        include: { bids: true },
      }),
    );

    if (!tender) throw new NotFoundException('Tender not found');
    if (tender.status !== 'OPEN')
      throw new BadRequestException('Tender is not OPEN');

    const winningBid = tender.bids.find((b) => b.id === winningBidId);
    if (!winningBid)
      throw new NotFoundException('Winning bid not found in tender');

    return this.prisma.$transaction(async (tx) => {
      // 1. Mark winning bid as ACCEPTED
      await tx.tenderBid.update({
        where: { id: winningBidId },
        data: { status: 'ACCEPTED' },
      });

      // 2. Mark other bids as REJECTED
      const losingBidIds = tender.bids
        .filter((b) => b.id !== winningBidId)
        .map((b) => b.id);
      if (losingBidIds.length > 0) {
        await tx.tenderBid.updateMany({
          where: { id: { in: losingBidIds } },
          data: { status: 'REJECTED' },
        });
      }

      // 3. Mark tender as AWARDED
      await tx.tender.update({
        where: { id: tenderId },
        data: { status: 'AWARDED' },
      });

      // 4. Optionally: Auto-generate a Contract / Carrier Agreement here
      const contract = await tx.contract.create({
        data: {
          companyId,
          vendorId: winningBid.vendorId,
          type: 'CARRIER_AGREEMENT',
          status: 'ACTIVE',
          startDate: new Date(),
          paymentTerms: 'NET30',
        },
      });

      return contract;
    });
  }
}
