import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as requestSupertest from 'supertest';
const request = requestSupertest.default || requestSupertest;
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Workshop Lifecycle (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let mechanicToken: string;
  let mechanicUserId: string;
  let prisma: PrismaService;
  let companyId = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3'; // Company A
  let vehicleId: string;
  let workshopId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
    
    prisma = app.get(PrismaService);

    // Admin Login
    const loginAdmin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@parilink.com', password: 'password123' });
    adminToken = loginAdmin.body?.access_token;

    // Create a mechanic user and role
    mechanicUserId = require('crypto').randomUUID();
    const mechanicEmail = `mechanic_${mechanicUserId.substring(0,8)}@parilink.com`;
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('password123', 10);
    
    await prisma.runAsSystem('E2E Setup Lifecycle', async (tx) => {
      const role = await tx.role.create({
        data: {
          companyId,
          name: `E2E Mechanic ${mechanicUserId.substring(0,4)}`,
          permissions: ['workshop:mechanic', 'fleet:read']
        }
      });
      await tx.user.create({
        data: {
          id: mechanicUserId,
          email: mechanicEmail,
          password: hash,
          firstName: 'Bob',
          lastName: 'Mechanic',
          companyId,
          status: 'ACTIVE',
          roleId: role.id
        }
      });
    });

    const loginMech = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: mechanicEmail, password: 'password123' });
    mechanicToken = loginMech.body?.access_token;

    // Setup base data
    await prisma.runAsSystem('E2E Setup Base Data', async (tx) => {
      const v = await tx.vehicle.create({
        data: {
          companyId,
          make: 'TestMake',
          model: 'TestModel',
          licensePlate: `TEST-${Date.now()}`,
          type: 'TRUCK',
          status: 'IN_SERVICE'
        }
      });
      vehicleId = v.id;

      const w = await tx.workshop.create({
        data: { companyId, name: 'Main Workshop', type: 'INTERNAL' }
      });
      workshopId = w.id;
      
      // Setup Maintenance Schedule for A6
      await tx.maintenanceSchedule.create({
        data: { companyId, vehicleId, taskName: 'SCHEDULED_MAINTENANCE', intervalKm: 10000 }
      });
    });
  });

  afterAll(async () => {
    if (mechanicUserId) {
      await prisma.runAsSystem('E2E Teardown', async (tx) => {
        try { await tx.user.delete({ where: { id: mechanicUserId } }); } catch (e) {}
        try { await tx.role.deleteMany({ where: { name: { startsWith: 'E2E Mechanic' } } }); } catch (e) {}
        try { if (workshopId) await tx.workshop.delete({ where: { id: workshopId } }); } catch (e) {}
        try { if (vehicleId) await tx.vehicle.delete({ where: { id: vehicleId } }); } catch(e) {}
      });
    }
    await app.close();
  });

  describe('JobCard Lifecycle', () => {
    let jobCardId: string;

    it('should detect repeat issue (A7)', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/workshop/job-cards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ vehicleId, workshopId, issueReported: 'Brakes making noise' });

      const res = await request(app.getHttpServer())
        .post('/api/v1/workshop/job-cards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ vehicleId, workshopId, issueReported: 'Brakes squeaking' });

      expect(res.body.repeatIssueFlag).toBe(true);
      jobCardId = res.body.id;
    });

    it('should gate in successfully', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${jobCardId}/gate-in`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ odometer: 15000 })
        .expect(201);
    });

    it('mechanic can update status (A3)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${jobCardId}/status`)
        .set('Authorization', `Bearer ${mechanicToken}`)
        .send({ status: 'DIAGNOSING' })
        .expect(201);
    });

    it('mechanic cannot qc-signoff (A3 role enforcement)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${jobCardId}/qc-signoff`)
        .set('Authorization', `Bearer ${mechanicToken}`)
        .expect(403);
    });

    it('admin can qc-signoff (A3)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${jobCardId}/qc-signoff`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });

    it('admin can gate out (A3)', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${jobCardId}/gate-out`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ odometer: 15010 })
        .expect(201);
    });
  });

  describe('High Cost Approval (A9)', () => {
    let expensiveJobId: string;
    
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/workshop/job-cards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ vehicleId, workshopId, issueReported: 'Engine Replacement' });
      
      if (!res.body.id) {
        console.error('Failed to create expensive job card:', res.body);
      }
      expensiveJobId = res.body.id;

      await prisma.runAsSystem('Update cost', async (tx) => {
        await tx.jobCard.update({ where: { id: expensiveJobId }, data: { totalCost: 60000, status: 'IN_REPAIR' } });
      });
    });

    it('should block QC signoff for high cost without approval', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${expensiveJobId}/qc-signoff`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
    });

    it('should allow after owner approval', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${expensiveJobId}/owner-approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ approved: true })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/api/v1/workshop/job-cards/${expensiveJobId}/qc-signoff`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);
    });
  });

  describe('Computed Endpoints', () => {
    it('Low stock detection (A5)', async () => {
      const pRes = await request(app.getHttpServer())
        .post('/api/v1/workshop/parts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Oil Filter', unitCost: 100 });
      
      const partId = pRes.body.id;

      await prisma.runAsSystem('Update part', async (tx) => {
        await tx.part.update({ where: { id: partId }, data: { quantity: 10, reorderLevel: 5 } });
      });

      const jcRes = await request(app.getHttpServer())
        .post('/api/v1/workshop/job-cards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ vehicleId, workshopId, issueReported: 'Oil Change' });
      
      let maintJobId;
      await prisma.runAsSystem('Seed Maint Job', async (tx) => {
        const mj = await tx.maintenanceJob.create({
          data: { companyId, vehicleId, type: 'SCHEDULED', status: 'COMPLETED', openedAt: new Date() }
        });
        maintJobId = mj.id;
      });

      await request(app.getHttpServer())
        .post('/api/v1/workshop/job-parts')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ 
          maintenanceJobId: maintJobId, 
          jobCardId: jcRes.body.id, 
          partId, 
          name: 'Oil Filter', 
          qty: 6, 
          unitCost: 100, 
          amount: 600 
        })
        .expect(201);

      const lsRes = await request(app.getHttpServer())
        .get('/api/v1/workshop/parts/low-stock')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = lsRes.body.find((p: any) => p.id === partId);
      expect(found).toBeDefined();
      expect(found.quantity).toBe(4);
    });

    it('Maintenance Due detection (A6)', async () => {
      await prisma.runAsSystem('Seed Maint', async (tx) => {
        await tx.jobCard.create({
          data: { companyId, vehicleId, workshopId, issueReported: 'SCHEDULED_MAINTENANCE', odometer: 10000, status: 'CLOSED' }
        });
        
        await tx.jobCard.create({
          data: { companyId, vehicleId, workshopId, issueReported: 'Regular Check', odometer: 21000, status: 'OPEN' }
        });
      });

      const res = await request(app.getHttpServer())
        .get('/api/v1/workshop/maintenance-due')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const due = res.body.find((d: any) => d.vehicleId === vehicleId);
      expect(due).toBeDefined();
      expect(due.overdueKm).toBe(1000);
    });
  });
});
