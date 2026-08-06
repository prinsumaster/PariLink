import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import * as xmlbuilder from 'xmlbuilder';

@Processor('tally-sync')
export class TallySyncProcessor {
  private readonly logger = new Logger(TallySyncProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('export-vouchers')
  async exportInvoicesToTally(job: Job) {
    const { companyId, dateRange } = job.data;
    this.logger.log(`Starting Tally Sync for company ${companyId}`);

    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: {
          companyId,
          status: 'GENERATED',
        },
        include: { customer: true },
      }),
    );

    if (invoices.length === 0) return { status: 'NO_DATA' };

    // Build Tally XML Envelope
    const root = xmlbuilder.create('ENVELOPE');
    const header = root.ele('HEADER');
    header.ele('TALLYREQUEST', 'Import Data');

    const body = root.ele('BODY').ele('IMPORTDATA').ele('REQUESTDATA');

    invoices.forEach((inv) => {
      const msg = body.ele('TALLYMESSAGE', { 'xmlns:UDF': 'TallyUDF' });
      const voucher = msg.ele('VOUCHER', {
        VCHTYPE: 'Sales',
        ACTION: 'Create',
      });

      voucher.ele(
        'DATE',
        inv.createdAt.toISOString().split('T')[0].replace(/-/g, ''),
      );
      voucher.ele('VOUCHERTYPENAME', 'Sales');
      voucher.ele('PARTYLEDGERNAME', inv.customer?.name || 'Cash');
      voucher.ele(
        'NARRATION',
        `Load: ${inv.loadId} | Auto-synced from PariLink`,
      );

      const ledger = voucher.ele('ALLLEDGERENTRIES.LIST');
      ledger.ele('CUSTOMER', (inv as any).customer.name);
      ledger.ele('AMOUNT', inv.amount);
      ledger.ele('DATE', inv.createdAt.toISOString());
    });

    const xmlPayload = root.end({ pretty: true });

    // In production, this posts to the Tally ERP 9 / Prime local server endpoint.
    // await this.httpService.post('http://localhost:9000', xmlPayload).toPromise();

    this.logger.log(
      `Successfully generated Tally XML for ${invoices.length} invoices`,
    );
    return { status: 'SUCCESS', count: invoices.length };
  }
}
