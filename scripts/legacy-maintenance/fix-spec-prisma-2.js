const fs = require('fs');
const glob = require('glob');

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
for (const file of specFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('runAsSystem: jest.fn()')) {
    // We already added it, let's fix the variable name inside cb()
    // It could be mockPrismaService, or prisma.
    content = content.replace(/(const|let)\s+(mockPrisma|prisma|mockPrismaService)\s*=\s*\{([\s\S]*?)cb\(mockPrisma\)([\s\S]*?)cb\(mockPrisma\)/, "$1 $2 = {$3cb($2)$4cb($2)");
    // Sometimes it's deep so just replace all cb(mockPrisma) with cb(actualVar) within the block
    let match = content.match(/(const|let)\s+(mockPrisma|prisma|mockPrismaService)\s*=\s*\{/);
    if (match) {
        let varName = match[2];
        if (varName !== 'mockPrisma') {
            content = content.replace(/cb\(mockPrisma\)/g, `cb(${varName})`);
        }
    }
    fs.writeFileSync(file, content, 'utf8');
  }
}
console.log(`Updated spec files for variable names`);
