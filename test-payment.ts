import { PrismaClient } from '@prisma/client';
import { PaymentsService } from './apps/api/src/payments/payments.service';

const prisma = new PrismaClient();
const paymentsService = new PaymentsService(prisma as any);

async function main() {
  const payment = await paymentsService.recordPayment('1eed6ef2-1179-456d-b128-6898ac6d22be', {
    invoiceId: 'b043204f-7bcb-48d0-9584-7ea12407a3c1',
    amount: 1250,
    method: 'BANK_TRANSFER',
    referenceNumber: 'TXN-' + Date.now(),
    paymentDate: new Date().toISOString(),
    notes: 'Test Payment'
  });
  console.log('Payment recorded:', payment.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
