const fs = require('fs');
const files = [
  'apps/api/src/vendors/vendors.service.ts',
  'apps/api/src/drivers/drivers.service.ts',
  'apps/api/src/roles/roles.service.ts',
  'apps/api/src/users/users.service.ts',
  'apps/api/src/vehicles/vehicles.service.ts',
  'apps/api/src/branches/branches.service.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/where: Prisma\.(\w+)WhereInput = \{\};/g, 'where: Prisma.$1WhereInput = { companyId };');
  fs.writeFileSync(file, content);
  console.log('Patched', file);
});
