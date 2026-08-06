const fs = require('fs');
const path = require('path');
const file = 'apps/api/build_errors.log';
const content = fs.readFileSync(file, 'utf-8');
const regex = /src\/(operations|intelligence)[a-zA-Z0-9_./-]+\.ts/g;
const matches = [...new Set(content.match(regex))];

for (const match of matches) {
  const filePath = path.join('apps/api', match);
  if (fs.existsSync(filePath)) {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    // Replace runAsTenant(companyId, async (tx) => ...) with runAsSystem(async (tx) => ...)
    // Because these are system services that can query across tenants
    fileContent = fileContent.replace(/this\.prisma\.runAsTenant\(companyId, async \(tx\) =>/g, 'this.prisma.runAsSystem(async (tx) =>');
    fs.writeFileSync(filePath, fileContent);
    console.log('Fixed', filePath);
  }
}
