const fs = require('fs');

function patchFile(file, regex, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(file, content);
}

// 1. profitability.service.ts - vehiclePnl
patchFile(
  'apps/api/src/profitability/profitability.service.ts',
  /const trips = await tx.trip.findMany\(\{/,
  `const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId, companyId } });
      if (!vehicle) throw new NotFoundException('Vehicle not found');
      
      const trips = await tx.trip.findMany({`
);

// 2. trips/trip-desks.controller.ts - /trips/:id/desks
patchFile(
  'apps/api/src/trips/trip-desks.controller.ts',
  /return this.tripDesksService.getDesksForTrip\(user.companyId, id\);/,
  `const trip = await this.tripsService.findOne(user.companyId, id);
    if (!trip) throw new NotFoundException('Trip not found');
    return this.tripDesksService.getDesksForTrip(user.companyId, id);`
);

// 3. vehicles/vehicles.controller.ts - /vehicles/:id/jobs, /vehicles/:id/tyres
patchFile(
  'apps/api/src/vehicles/vehicles.controller.ts',
  /return this.vehiclesService.getJobs\(user.companyId, id\);/,
  `const vehicle = await this.vehiclesService.findOne(user.companyId, id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return this.vehiclesService.getJobs(user.companyId, id);`
);
patchFile(
  'apps/api/src/vehicles/vehicles.controller.ts',
  /return this.vehiclesService.getTyres\(user.companyId, id\);/,
  `const vehicle = await this.vehiclesService.findOne(user.companyId, id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return this.vehiclesService.getTyres(user.companyId, id);`
);

// 4. trips/trips.controller.ts - /trips/:id/fuel
patchFile(
  'apps/api/src/trips/trips.controller.ts',
  /return this.tripsService.getFuelForTrip\(user.companyId, id\);/,
  `const trip = await this.tripsService.findOne(user.companyId, id);
    if (!trip) throw new NotFoundException('Trip not found');
    return this.tripsService.getFuelForTrip(user.companyId, id);`
);

// 5. drivers/drivers.controller.ts - /drivers/:id/score
patchFile(
  'apps/api/src/drivers/drivers.controller.ts',
  /return this.driversService.getScore\(user.companyId, id\);/,
  `const driver = await this.driversService.findOne(user.companyId, id);
    if (!driver) throw new NotFoundException('Driver not found');
    return this.driversService.getScore(user.companyId, id);`
);

