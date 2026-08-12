const fs = require('fs');

function patchProviders(filePath, newProviderStr) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(newProviderStr)) return;
  content = content.replace(/providers: \[/, `providers: [\n        ${newProviderStr},`);
  fs.writeFileSync(filePath, content);
}

patchProviders('apps/api/src/saas/billing/billing.service.spec.ts', '{ provide: "EventStoreService", useValue: {} }');
patchProviders('apps/api/src/dispatch/dispatch.service.spec.ts', '{ provide: "TwilioService", useValue: {} }');
patchProviders('apps/api/src/drivers/drivers.service.spec.ts', '{ provide: "EventStoreService", useValue: {} }');
patchProviders('apps/api/src/communications/enterprise-notification.service.spec.ts', '{ provide: "EventStoreService", useValue: {} }');
patchProviders('apps/api/src/trips/trips.service.spec.ts', '{ provide: "EventStoreService", useValue: {} }');

// Patch Enterprise Admin Test
const adminTestFile = 'apps/api/src/admin/enterprise-admin.service.spec.ts';
if (fs.existsSync(adminTestFile)) {
  let adminContent = fs.readFileSync(adminTestFile, 'utf8');
  if (!adminContent.includes('user: { count')) {
    adminContent = adminContent.replace(/runAsSystem: jest\.fn\(\)\.mockImplementation\(async function \(cb\) \{/g, `
            user: { count: jest.fn().mockResolvedValue(5) },
            runAsSystem: jest.fn().mockImplementation(async function (cb) {`);
    fs.writeFileSync(adminTestFile, adminContent);
  }
}

// Patch Enterprise Telematics Test
const telematicsTestFile = 'apps/api/src/tracking/enterprise-telematics.service.spec.ts';
if (fs.existsSync(telematicsTestFile)) {
  let tContent = fs.readFileSync(telematicsTestFile, 'utf8');
  if (!tContent.includes('alert: { findFirst')) {
    tContent = tContent.replace(/runAsTenant: jest\.fn\(\)\.mockImplementation\(async function \(tenantId, cb\) \{/g, `
            alert: { findFirst: jest.fn().mockResolvedValue({ id: 'alert-123', companyId: 'company-123' }), update: jest.fn() },
            runAsTenant: jest.fn().mockImplementation(async function (tenantId, cb) {`);
    fs.writeFileSync(telematicsTestFile, tContent);
  }
}

console.log('Tests patched successfully.');
