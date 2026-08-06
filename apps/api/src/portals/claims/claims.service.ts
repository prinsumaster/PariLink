import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClaimsService {
  private readonly logger = new Logger(ClaimsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createClaim(
    companyId: string,
    customerId: string,
    data: { loadId?: string; amount: number; reason: string },
  ) {
    this.logger.log(
      `Creating claim for customer ${customerId} (amount: ${data.amount})`,
    );

    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      return tx.claim.create({
        data: {
          companyId,
          customerId,
          loadId: data.loadId,
          amount: data.amount,
          reason: data.reason,
          status: 'PENDING',
        },
      });
    });
  }

  async getClaimsByCustomer(companyId: string, customerId: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      return tx.claim.findMany({
        where: { companyId, customerId },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async getClaimDetails(companyId: string, claimId: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      const claim = await tx.claim.findUnique({
        where: { id: claimId, companyId },
      });
      if (!claim) {
        throw new NotFoundException(`Claim ${claimId} not found`);
      }
      return claim;
    });
  }

  async updateClaimStatus(companyId: string, claimId: string, status: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      return tx.claim.update({
        where: { id: claimId, companyId },
        data: { status },
      });
    });
  }
}
