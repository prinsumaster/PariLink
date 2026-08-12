const fs = require('fs');

const adminFile = 'apps/api/src/admin/enterprise-admin.service.spec.ts';
let adminContent = fs.readFileSync(adminFile, 'utf8');
adminContent = adminContent.replace(/    user: \{ count: jest\.fn\(\)\.mockResolvedValue\(5\) \},\n/g, '');
adminContent = adminContent.replace(/    vehicle: \{ count: jest\.fn\(\)\.mockResolvedValue\(10\) \},\n/g, '');
adminContent = adminContent.replace(/    driver: \{ count: jest\.fn\(\)\.mockResolvedValue\(15\) \},\n/g, '');
adminContent = adminContent.replace(/    trip: \{ count: jest\.fn\(\)\.mockResolvedValue\(20\) \},\n/g, '');
adminContent = adminContent.replace(/    load: \{ count: jest\.fn\(\)\.mockResolvedValue\(25\) \},\n/g, '');

adminContent = adminContent.replace(/user: \{/g, 'user: {\n      count: jest.fn().mockResolvedValue(5),');
adminContent = adminContent.replace(/vehicle: \{/g, 'vehicle: {\n      count: jest.fn().mockResolvedValue(10),');
adminContent = adminContent.replace(/driver: \{/g, 'driver: {\n      count: jest.fn().mockResolvedValue(15),');
adminContent = adminContent.replace(/trip: \{/g, 'trip: {\n      count: jest.fn().mockResolvedValue(20),');
adminContent = adminContent.replace(/load: \{/g, 'load: {\n      count: jest.fn().mockResolvedValue(25),');

fs.writeFileSync(adminFile, adminContent);
console.log('Fixed admin duplicates');
