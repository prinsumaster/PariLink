const fs = require('fs');
const file = 'apps/api/src/admin/enterprise-admin.service.spec.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('vehicle: { count: jest.fn().mockResolvedValue(10) }')) {
  content = content.replace(/    user: \{/g, '    vehicle: { count: jest.fn().mockResolvedValue(10) },\n    driver: { count: jest.fn().mockResolvedValue(10) },\n    trip: { count: jest.fn().mockResolvedValue(10) },\n    load: { count: jest.fn().mockResolvedValue(10) },\n    auditLog: { count: jest.fn().mockResolvedValue(10) },\n    user: {');
  fs.writeFileSync(file, content);
}
console.log('Added missing mocks to admin test.');
