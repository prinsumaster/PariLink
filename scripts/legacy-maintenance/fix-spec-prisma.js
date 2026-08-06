const fs = require('fs');
const glob = require('glob');

// Use the local node_modules glob if available, or just standard fs traversing
function findSpecFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = dir + '/' + file;
    if (fs.statSync(filePath).isDirectory()) {
      findSpecFiles(filePath, fileList);
    } else if (filePath.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const specFiles = findSpecFiles('./apps/api/src');
let changed = 0;
for (const file of specFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('provide: PrismaService')) {
    // If it mocks Prisma, check if it implements runAsSystem
    if (!content.includes('runAsSystem:')) {
      // Find where the mock is defined. E.g. const mockPrisma = {
      content = content.replace(/(const (?:mockPrisma|prisma|mockPrismaService)\s*=\s*\{)/, "$1\n    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),\n    runAsTenant: jest.fn().mockImplementation(async (tenantId, cb) => cb(mockPrisma)),");
      
      // Also try to replace generic tx references inside the callback if the mock object is named differently
      content = content.replace(/(const (?:mockPrisma|prisma|mockPrismaService)\s*=\s*\{[\s\S]*?)runAsSystem: jest\.fn\(\)\.mockImplementation\(async \(cb\) => cb\((.*?)\)\)/g, (match, p1, p2) => match); // Just a sanity pattern
      
      // Another common pattern: let mockPrisma = {
      content = content.replace(/(let (?:mockPrisma|prisma|mockPrismaService)\s*=\s*\{)/, "$1\n    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),\n    runAsTenant: jest.fn().mockImplementation(async (tenantId, cb) => cb(mockPrisma)),");
      
      fs.writeFileSync(file, content, 'utf8');
      changed++;
    }
  }
}
console.log(`Updated ${changed} spec files`);
