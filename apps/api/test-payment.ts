import { PrismaService } from './src/prisma/prisma.service';
import { PaymentsService } from './src/payments/payments.service';

async function main() {
  const prisma = new PrismaService();
  const paymentsService = new PaymentsService(prisma);
  
  try {
    const payment = await paymentsService.recordPayment('1eed6ef2-1179-456d-b128-6898ac6d22be', {
      invoiceId: 'b043204f-7bcb-48d0-9584-7ea12407a3c1',
      amount: 1250,
      method: 'BANK_TRANSFER',
      referenceNumber: 'TXN-' + Date.now(),
      paymentDate: new Date().toISOString(),
      notes: 'Test Payment'
    });
    console.log('Payment recorded successfully:', payment.id);
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
