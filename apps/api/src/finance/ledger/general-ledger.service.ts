import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GeneralLedgerService {
  private readonly logger = new Logger(GeneralLedgerService.name);

  constructor(private prisma: PrismaService) {}

  async createJournalEntry(
    companyId: string,
    payload: {
      description: string;
      referenceType: string;
      referenceId?: string;
      lines: Array<{
        accountId: string;
        debit: number;
        credit: number;
        description?: string;
      }>;
    },
  ) {
    // Validate Double-Entry Accounting Principle (Debits == Credits)
    const totalDebits = payload.lines.reduce(
      (sum, line) => sum + line.debit,
      0,
    );
    const totalCredits = payload.lines.reduce(
      (sum, line) => sum + line.credit,
      0,
    );

    if (totalDebits !== totalCredits) {
      throw new BadRequestException('Total debits must equal total credits');
    }

    // Wrap in ACID transaction
    return this.prisma.$transaction(async (tx: any) => {
      const entry = await tx.journalEntry.create({
        data: {
          companyId,
          description: payload.description,
          referenceType: payload.referenceType,
          referenceId: payload.referenceId,
          status: 'POSTED',
          lines: {
            create: payload.lines.map((line) => ({
              companyId,
              accountId: line.accountId,
              debit: line.debit,
              credit: line.credit,
              description: line.description,
            })),
          },
        },
      });
      return entry;
    });
  }

  async getJournalEntries(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.journalEntry.findMany({
        where: { companyId },
        include: {
          lines: {
            include: { account: { select: { name: true, code: true } } },
          },
        },
        orderBy: { date: 'desc' },
        take: 50,
      }),
    );
  }
}
