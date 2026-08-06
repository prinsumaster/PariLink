const fs = require('fs');

const file = './apps/api/src/tracking/enterprise-telematics.service.spec.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace mockPrisma instances with mockImplementation mapping for runAsTenant
content = content.replace(/(mockPrisma\s*=\s*\{)/, "$1\n    runAsTenant: jest.fn().mockImplementation(async (companyId, cb) => cb(mockPrisma)),\n    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),");
// For the auth.service.spec.ts
const file2 = './apps/api/src/auth/auth.service.spec.ts';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/cb\(mockPrisma\)/g, "cb(mockPrismaService)");

fs.writeFileSync(file, content, 'utf8');
fs.writeFileSync(file2, content2, 'utf8');
