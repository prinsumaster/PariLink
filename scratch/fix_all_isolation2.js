const fs = require('fs');

function replaceInFile(file, regex, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
}

replaceInFile('apps/api/src/trips/trip-desks.controller.ts', /import\('@nestjs\/common'\)\.NotFoundException/g, 'NotFoundException');
replaceInFile('apps/api/src/trips/trips.controller.ts', /import\('@nestjs\/common'\)\.NotFoundException/g, 'NotFoundException');
replaceInFile('apps/api/src/drivers/drivers.controller.ts', /import\('@nestjs\/common'\)\.NotFoundException/g, 'NotFoundException');
replaceInFile('apps/api/src/vehicles/tyre/tyre.service.ts', /import\('@nestjs\/common'\)\.NotFoundException/g, 'NotFoundException');

// Fix jobs.controller.ts
replaceInFile('apps/api/src/maintenance/jobs.controller.ts', /import\('@nestjs\/common'\)\.NotFoundException/g, 'NotFoundException');
replaceInFile('apps/api/src/maintenance/jobs.controller.ts', /const tx = await import\('\.\.\/\.\.\/prisma\/prisma\.service'\)\.then\(m => new m\.PrismaService\(\)\);/, '');
replaceInFile('apps/api/src/maintenance/jobs.controller.ts', /const vehicle = await tx\.vehicle\.findUnique/, 'const { PrismaClient } = require("@prisma/client"); const prisma = new PrismaClient(); const vehicle = await prisma.vehicle.findUnique');
