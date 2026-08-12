const fs = require('fs');
const file = 'apps/api/src/admin/enterprise-admin.service.spec.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('count: jest.fn().mockResolvedValue(10)')) {
  content = content.replace(/    company: \{/g, '    company: {\n      count: jest.fn().mockResolvedValue(10),');
  content = content.replace(/    user: \{/g, '    user: {\n      count: jest.fn().mockResolvedValue(15),');
  content = content.replace(/    vehicle: \{/g, '    vehicle: {\n      count: jest.fn().mockResolvedValue(20),');
  content = content.replace(/    driver: \{/g, '    driver: {\n      count: jest.fn().mockResolvedValue(25),');
  content = content.replace(/    trip: \{/g, '    trip: {\n      count: jest.fn().mockResolvedValue(30),');
  content = content.replace(/    load: \{/g, '    load: {\n      count: jest.fn().mockResolvedValue(35),');
  fs.writeFileSync(file, content);
}
console.log('Injected counts.');
