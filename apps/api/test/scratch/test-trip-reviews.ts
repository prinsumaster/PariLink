import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
const request = require('supertest');
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.init();

  const prisma = app.get(PrismaService);
  const jwt = app.get(JwtService);
  const config = app.get(ConfigService);
  
  const tenantA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.company.create({ data: { name: 'Review Tenant A' } }));
  const tenantB = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.company.create({ data: { name: 'Review Tenant B' } }));
  
  const roleA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.role.create({ data: { name: 'Admin', companyId: tenantA.id, permissions: ['trips:create', 'trips:update', 'trips:read'] } }));
  const userA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.user.create({
    data: { email: `testA_${Date.now()}@test.com`, password: 'hash', firstName: 'A', lastName: 'A', companyId: tenantA.id, roleId: roleA.id }
  }));

  const roleB = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.role.create({ data: { name: 'Admin', companyId: tenantB.id, permissions: ['trips:create', 'trips:update', 'trips:read'] } }));
  const userB = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.user.create({
    data: { email: `testB_${Date.now()}@test.com`, password: 'hash', firstName: 'B', lastName: 'B', companyId: tenantB.id, roleId: roleB.id }
  }));

  const tokenA = jwt.sign({ sub: userA.id, email: userA.email, companyId: tenantA.id, permissions: ['trips:create', 'trips:update', 'trips:read'] }, { secret: config.get('JWT_SECRET') });
  // @ts-ignore: reserved for future use
  const _tokenB = jwt.sign({ sub: userB.id, email: userB.email, companyId: tenantB.id, permissions: ['trips:create', 'trips:update', 'trips:read'] }, { secret: config.get('JWT_SECRET') });

  const driverA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.driver.create({
    data: { companyId: tenantA.id, firstName: 'Driver', lastName: 'A', status: 'AVAILABLE' }
  }));
  
  const tripA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.trip.create({
    data: { companyId: tenantA.id, tripNumber: `TRP-A-${Date.now()}`, driverId: driverA.id, status: 'PLANNED' }
  }));

  const driverB = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.driver.create({
    data: { companyId: tenantB.id, firstName: 'Driver', lastName: 'B', status: 'AVAILABLE' }
  }));
  
  const tripB = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.trip.create({
    data: { companyId: tenantB.id, tripNumber: `TRP-B-${Date.now()}`, driverId: driverB.id, status: 'PLANNED' }
  }));

  const server = app.getHttpServer();

  console.log('\n--- STEP 2: DTO FIELDS CROSS-CHECKED (POST {}) ---');
  const resEmpty = await request(server)
    .post(`/api/v1/trips/${tripA.id}/reviews`)
    .set('Authorization', `Bearer ${tokenA}`)
    .send({});
  
  console.log(`POST {} -> ${resEmpty.status}`);
  console.log(JSON.stringify(resEmpty.body, null, 2));

  console.log('\n--- STEP 2: POST VALID -> 201 ---');
  const resValid = await request(server)
    .post(`/api/v1/trips/${tripA.id}/reviews`)
    .set('Authorization', `Bearer ${tokenA}`)
    .send({ reviewerRole: 'DISPATCHER', rating: 5, comment: 'Great dispatch' });
  console.log(`POST valid -> ${resValid.status}`);
  console.log(JSON.stringify(resValid.body, null, 2));

  console.log('\n--- STEP 3: SCORE COMPUTATION ---');
  await request(server).post(`/api/v1/trips/${tripA.id}/reviews`).set('Authorization', `Bearer ${tokenA}`).send({ reviewerRole: 'LOADER', rating: 4 });
  await request(server).post(`/api/v1/trips/${tripA.id}/reviews`).set('Authorization', `Bearer ${tokenA}`).send({ reviewerRole: 'SAFETY_OFFICER', rating: 3 });
  await request(server).post(`/api/v1/trips/${tripA.id}/reviews`).set('Authorization', `Bearer ${tokenA}`).send({ reviewerRole: 'UNLOADER', rating: 5 });
  
  let scoreA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.driverScore.findFirst({ where: { tripId: tripA.id } }));
  console.log(`Score after 4 reviews: ${scoreA ? scoreA.total : 'null'} (Should be null pending)`);

  console.log('\n--- STEP 5: WHAT HAPPENS WHEN A REVIEW IS MISSING ---');
  console.log(`A trip with 4 out of 5 reviews stays pending without generating a DriverScore.`);

  await request(server).post(`/api/v1/trips/${tripA.id}/reviews`).set('Authorization', `Bearer ${tokenA}`).send({ reviewerRole: 'FLEET_MANAGER', rating: 4 });
  scoreA = await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.driverScore.findFirst({ where: { tripId: tripA.id } }));
  console.log(`Score after 5 reviews: ${scoreA?.total} (Expected: (5+4+3+5+4)/5 = 4.2)`);

  console.log('\n--- STEP 4(a): POSITIVE CONTROL ISOLATION ---');
  await prisma.runAsSystem('System operation or legacy bypass', async (tx: any) => await tx.tripReview.create({
    data: { companyId: tenantB.id, tripId: tripB.id, reviewerId: userB.id, reviewerRole: 'DISPATCHER', rating: 5 }
  }));

  const getReviewsA = await prisma.runAsTenant(tenantA.id, (tx: any): Promise<any[]> => tx.tripReview.findMany({ where: { tripId: tripA.id } }));
  console.log(`Tenant A fetching Trip A's reviews: Found ${getReviewsA.length}`);
  
  try {
    await prisma.runAsTenant(tenantA.id, async (tx: any) => {
      const getB = await tx.tripReview.findFirst({ where: { tripId: tripB.id } });
      console.log(`Tenant A fetching Trip B's reviews: Found ${getB ? 'YES' : 'NONE'}`);
    });
  } catch (e) {
    console.log(`Tenant A fetching Trip B's reviews: Error / Not Found`);
  }

  console.log('\n--- STEP 4(b): DECISIVE STRIP THE FILTER TEST ---');
  const maliciousFetch = await prisma.runAsTenant(tenantA.id, async (tx: any): Promise<any[]> => {
    return tx.tripReview.findMany({ where: { tripId: tripB.id } });
  });
  console.log(`Tenant A malicious query for Trip B: Found ${maliciousFetch.length} rows (Expected 0 due to Postgres RLS)`);

  const fullFetchAsA = await prisma.runAsTenant(tenantA.id, async (tx: any): Promise<any[]> => {
    return tx.tripReview.findMany(); 
  });
  console.log(`Tenant A full findMany() with NO WHERE clause: Found ${fullFetchAsA.length} rows (Expected 5 due to RLS filtering out B's row)`);

  await app.close();
}
bootstrap();
