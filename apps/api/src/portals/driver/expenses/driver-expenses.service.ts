import { Injectable, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DriverExpensesService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private prisma: PrismaService) {}

  async submitExpense(
    companyId: string,
    driverId: string,
    tripId: string,
    type: string,
    amount: number,
    date: string,
    _documentUrl?: string,
  ) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.expense.create({
        data: {
          companyId,
          tripId,
          driverId,
          type,
          amount,
          date: new Date(date),
          status: 'PENDING',
        },
      }),
    );
  }

  async getExpenses(companyId: string, driverId: string) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.expense.findMany({
        where: { companyId, driverId },
        orderBy: { date: 'desc' },
        take: 50,
      }),
    );
  }
}
