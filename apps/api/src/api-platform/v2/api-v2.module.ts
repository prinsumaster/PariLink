import { Module } from '@nestjs/common';
import { LoadsModule } from '../../loads/loads.module';
import { TripsModule } from '../../trips/trips.module';
import { DriversModule } from '../../drivers/drivers.module';
import { VehiclesModule } from '../../vehicles/vehicles.module';
import { CustomersModule } from '../../customers/customers.module';
import { BillingModule } from '../../billing/billing.module';
import { WorkflowModule } from '../../workflow/workflow.module';
import { DispatchModule } from '../../dispatch/dispatch.module';
import { WebhookModule } from '../webhooks/webhook.module';
import { IamModule } from '../../iam/iam.module';

import { WebhooksV2Controller } from './controllers/webhooks-v2.controller';
import { LoadsV2Controller } from './controllers/loads-v2.controller';
// import { TripsV2Controller } from './controllers/trips-v2.controller';
// import { DriversV2Controller } from './controllers/drivers-v2.controller';
// import { VehiclesV2Controller } from './controllers/vehicles-v2.controller';
// import { CustomersV2Controller } from './controllers/customers-v2.controller';
// import { BillingV2Controller } from './controllers/billing-v2.controller';
// import { WorkflowV2Controller } from './controllers/workflow-v2.controller';

@Module({
  imports: [
    IamModule,
    LoadsModule,
    TripsModule,
    DriversModule,
    VehiclesModule,
    CustomersModule,
    BillingModule,
    WorkflowModule,
    DispatchModule,
    WebhookModule,
  ],
  controllers: [
    WebhooksV2Controller,
    LoadsV2Controller,
    // Add other controllers as they are implemented
  ],
})
export class ApiV2Module {}
