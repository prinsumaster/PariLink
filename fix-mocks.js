const fs = require('fs');

const eventStoreFiles = [
  'apps/api/src/billing/billing.service.spec.ts',
  'apps/api/src/drivers/drivers.service.spec.ts',
  'apps/api/src/trips/trips.service.spec.ts',
  'apps/api/src/dispatch/dispatch.service.spec.ts',
  'apps/api/src/communications/enterprise-notification.service.spec.ts'
];
eventStoreFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/\{ provide: EventStoreService, useValue: \{\} \}/g, "{ provide: EventStoreService, useValue: { append: jest.fn() } }");
    fs.writeFileSync(f, content);
  }
});

const notifFile = 'apps/api/src/communications/enterprise-notification.service.spec.ts';
if (fs.existsSync(notifFile)) {
  let content = fs.readFileSync(notifFile, 'utf8');
  if (!content.includes('notificationDelivery: {')) {
    content = content.replace(/runAsTenant: jest\.fn\(\)\.mockImplementation\(async \(tenantId, cb\) => await cb\(mockPrisma\)\),/g, 
    "runAsTenant: jest.fn().mockImplementation(async (tenantId, cb) => await cb(mockPrisma)),\n    notificationDelivery: { updateMany: jest.fn() },");
    fs.writeFileSync(notifFile, content);
  }
}

const telemFile = 'apps/api/src/tracking/enterprise-telematics.service.spec.ts';
if (fs.existsSync(telemFile)) {
  let content = fs.readFileSync(telemFile, 'utf8');
  if (!content.includes('updateMany: jest.fn()')) {
    content = content.replace(/update: jest\.fn\(\)\.mockResolvedValue\(\{\}\),/g, 
    "update: jest.fn().mockResolvedValue({}),\n      updateMany: jest.fn().mockResolvedValue({ count: 1 }),");
    fs.writeFileSync(telemFile, content);
  }
}

console.log('Mocks fixed.');
