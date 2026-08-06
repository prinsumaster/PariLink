const fs = require('fs');

const ssoFile = 'apps/api/src/auth/sso/sso.service.ts';
let ssoContent = fs.readFileSync(ssoFile, 'utf-8');
ssoContent = ssoContent.replace('let user;', 'let user: any;');
fs.writeFileSync(ssoFile, ssoContent);

const aiOpsFile = 'apps/api/src/dispatch/engine/ai-operations.service.ts';
let aiOpsContent = fs.readFileSync(aiOpsFile, 'utf-8');
aiOpsContent = aiOpsContent.replace('entityId: trip.driver.id,', 'entityId: trip.driver?.id || "",');
aiOpsContent = aiOpsContent.replace('entityId: trip.vehicle.id,', 'entityId: trip.vehicle?.id || "",');
fs.writeFileSync(aiOpsFile, aiOpsContent);

const gpsFile = 'apps/api/src/intelligence/gps/gps.service.ts';
let gpsContent = fs.readFileSync(gpsFile, 'utf-8');
gpsContent = gpsContent.replace('driverId: activeTrip.driverId,', 'driverId: activeTrip.driverId as string,');
fs.writeFileSync(gpsFile, gpsContent);

const opsDashFile = 'apps/api/src/operations/dashboard/operations-dashboard.service.ts';
let opsDashContent = fs.readFileSync(opsDashFile, 'utf-8');
opsDashContent = opsDashContent.replace('id: item.companyId', 'id: item.companyId as string');
fs.writeFileSync(opsDashFile, opsDashContent);

const planningFile = 'apps/api/src/planning/planning-engine.service.ts';
let planningContent = fs.readFileSync(planningFile, 'utf-8');
planningContent = planningContent.replace('const planItems = [];', 'const planItems: any[] = [];');
fs.writeFileSync(planningFile, planningContent);

const fusionFile = 'apps/api/src/platform/digital-twin/data-fabric/fusion-engine.service.ts';
let fusionContent = fs.readFileSync(fusionFile, 'utf-8');
fusionContent = fusionContent.replace('latitude: event.latitude,', 'latitude: event.latitude as number,');
fusionContent = fusionContent.replace('longitude: event.longitude,', 'longitude: event.longitude as number,');
fusionContent = fusionContent.replace('twinId: event.vehicleId', 'twinId: event.vehicleId as string');
fs.writeFileSync(fusionFile, fusionContent);
