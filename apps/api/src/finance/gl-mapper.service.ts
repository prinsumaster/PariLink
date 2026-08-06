import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GlMapperService {
  private readonly logger = new Logger(GlMapperService.name);

  mapToGl(transactionType: string, amount: number): any {
    this.logger.log(
      `Mapping ${transactionType} of amount ${amount} to General Ledger...`,
    );
    // Scaffolded: Map internal events to GL accounts
    const accountMap: Record<string, string> = {
      FREIGHT_CHARGE: '4000-REVENUE-FREIGHT',
      FUEL_SURCHARGE: '4010-REVENUE-FSC',
      DRIVER_PAY: '5000-EXPENSE-DRIVER',
      TOLL_FEE: '5020-EXPENSE-TOLL',
    };

    return {
      glAccount: accountMap[transactionType] || '9999-UNCLASSIFIED',
      amount,
      status: 'MAPPED',
    };
  }
}
