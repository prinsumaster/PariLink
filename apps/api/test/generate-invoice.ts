import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { BillingService } from '../src/billing/billing.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const billingService = app.get(BillingService);
  
  const tenantId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3';
  const customerId = 'f6367d26-8974-480d-a9b5-b12ca2437849';
  const tripIds = ['fb1ab85d-5113-4d49-b60b-fdc771063f78'];
  
  console.log('Generating invoice...');
  const invoice = await billingService.generateInvoiceFromTrips(tenantId, {
    customerId,
    tripIds
  });
  
  console.log('SUCCESS:', invoice.id);
  await app.close();
}
bootstrap();
