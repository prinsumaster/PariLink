import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma, Contract } from '@prisma/client';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new Customer or Carrier contract
   */
  async createContract(companyId: string, data: any): Promise<Contract> {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.create({
        data: {
          ...data,
          companyId,
          status: 'DRAFT',
        },
      }),
    );
  }

  /**
   * Activates a contract
   */
  async activateContract(
    companyId: string,
    contractId: string,
  ): Promise<Contract> {
    const contract = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.findUnique({
        where: { id: contractId, companyId },
      }),
    );

    if (!contract) throw new NotFoundException('Contract not found');

    // If activating a customer contract, we should probably expire old active ones
    // But for V1, we just set status
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.update({
        where: { id: contractId },
        data: { status: 'ACTIVE' },
      }),
    );
  }

  /**
   * Gets the currently active SLA terms for a customer
   */
  async getActiveCustomerSla(
    companyId: string,
    customerId: string,
  ): Promise<Contract | null> {
    const now = new Date();

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.findFirst({
        where: {
          companyId,
          customerId,
          type: 'MSA',
          status: 'ACTIVE',
          OR: [
            { startDate: null, endDate: null },
            { startDate: { lte: now }, endDate: { gte: now } },
            { startDate: { lte: now }, endDate: null },
          ],
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  /**
   * Evaluates expired contracts and updates their status
   * Could be called via a daily cron job
   */
  async expireOldContracts(companyId: string) {
    const now = new Date();

    const expired = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.contract.updateMany({
        where: {
          companyId,
          status: 'ACTIVE',
          endDate: { lt: now },
        },
        data: {
          status: 'EXPIRED',
        },
      }),
    );

    this.logger.log(
      `Expired ${expired.count} contracts for company ${companyId}`,
    );
    return expired.count;
  }
}
