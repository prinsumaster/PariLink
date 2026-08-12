const fs = require('fs');
const files = [
  'apps/api/src/billing/billing.service.spec.ts',
  'apps/api/src/drivers/drivers.service.spec.ts',
  'apps/api/src/trips/trips.service.spec.ts',
  'apps/api/src/dispatch/dispatch.service.spec.ts',
  'apps/api/src/communications/enterprise-notification.service.spec.ts'
];
files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import \{ EventStoreService \} from '\.\.\/platform\/events\/event-store\.service';/g, "import { EventStoreService } from '../platform/digital-twin/event-store.service';");
    fs.writeFileSync(f, content);
  }
});
console.log('Fixed EventStoreService import paths.');
