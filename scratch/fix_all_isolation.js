const fs = require('fs');

function replaceInFile(file, regex, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
}

// 1. trips/trip-desks.controller.ts - /trips/:id/desks
replaceInFile(
  'apps/api/src/trips/trip-desks.controller.ts',
  /const trip = await this\.tripsService\.findOne\(user\.companyId, id\);\n    if \(\!trip\) throw new NotFoundException\('Trip not found'\);\n    return this\.tripDesksService\.getDesksForTrip\(user\.companyId, id\);/g,
  `return this.tripDesksService.getDesksForTrip(user.companyId, id);` // Revert first to start clean
);
replaceInFile(
  'apps/api/src/trips/trip-desks.controller.ts',
  /return this\.tripDesksService\.getDesksForTrip\(user\.companyId, id\);/g,
  `const data = await this.tripDesksService.getDesksForTrip(user.companyId, id);
    const trip = await this.tripsService.findOne(user.companyId, id).catch(() => null);
    if (!trip) throw new import('@nestjs/common').NotFoundException('Trip not found');
    return data;`
);

// 2. trips/trips.controller.ts - /trips/:id/fuel
replaceInFile(
  'apps/api/src/trips/trips.controller.ts',
  /return this\.tripsService\.getFuelForTrip\(user\.companyId, id\);/g,
  `const trip = await this.tripsService.findOne(user.companyId, id).catch(() => null);
    if (!trip) throw new import('@nestjs/common').NotFoundException('Trip not found');
    return this.tripsService.getFuelForTrip(user.companyId, id);`
);

// 3. maintenance/jobs.controller.ts - /vehicles/:id/jobs
replaceInFile(
  'apps/api/src/maintenance/jobs.controller.ts',
  /const vehicle = await this\.jobsService\.getJobsByVehicle\(user\.companyId, vehicleId\); return vehicle; \/\/ Already checks isolation/g,
  `// First verify vehicle ownership
    const tx = await import('../../prisma/prisma.service').then(m => new m.PrismaService());
    const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId, companyId: user.companyId } });
    if (!vehicle) throw new import('@nestjs/common').NotFoundException('Vehicle not found');
    return this.jobsService.getJobsByVehicle(user.companyId, vehicleId);`
);

// 4. maintenance/tyres.controller.ts (or wherever /vehicles/:id/tyres is)
// We need to find where /vehicles/:id/tyres is. It might be in maintenance.controller.ts or tyres.controller.ts.
