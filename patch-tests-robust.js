const fs = require('fs');

function patchFile(filePath, importStmt, providerClassName) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (content.includes(`provide: ${providerClassName}`)) return;
  
  // 1. Add import
  if (!content.includes(importStmt)) {
    content = importStmt + '\n' + content;
  }

  // 2. Add provider
  // Replace string mocks we added earlier if they exist
  content = content.replace(new RegExp(`\\{\\s*provide:\\s*["']${providerClassName}["']\\s*,\\s*useValue:\\s*\\{\\}\\s*\\},\\n?\\s*`, 'g'), '');
  
  content = content.replace(/providers: \[/, `providers: [\n        { provide: ${providerClassName}, useValue: {} },`);
  fs.writeFileSync(filePath, content);
}

// 1. BillingService
patchFile('apps/api/src/billing/billing.service.spec.ts', "import { EventStoreService } from '../platform/events/event-store.service';", 'EventStoreService');

// 2. DispatchService (needs TwilioService)
patchFile('apps/api/src/dispatch/dispatch.service.spec.ts', "import { TwilioService } from '../integrations/twilio.service';", 'TwilioService');

// 3. DriversService
patchFile('apps/api/src/drivers/drivers.service.spec.ts', "import { EventStoreService } from '../platform/events/event-store.service';", 'EventStoreService');

// 4. NotificationOrchestratorService
patchFile('apps/api/src/communications/enterprise-notification.service.spec.ts', "import { EventStoreService } from '../platform/events/event-store.service';", 'EventStoreService');

// 5. TripsService
patchFile('apps/api/src/trips/trips.service.spec.ts', "import { EventStoreService } from '../platform/events/event-store.service';", 'EventStoreService');


console.log('Robust patch complete.');
