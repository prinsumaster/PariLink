import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

// Mock BullMQ completely so it doesn't crash ioredis-mock with Lua scripts
jest.mock('bullmq', () => ({
  Queue: class Queue {
    add() {
      return Promise.resolve();
    }
    on() {}
    close() {
      return Promise.resolve();
    }
  },
  Worker: class Worker {
    on() {}
    close() {
      return Promise.resolve();
    }
  },
  QueueEvents: class QueueEvents {
    on() {}
    close() {
      return Promise.resolve();
    }
  },
}));

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const mockPrisma = mockDeep<any>();
// Override runAsSystem and runAsTenant to pass the mock client back
mockPrisma.runAsSystem.mockImplementation(async (callback: any) => {
  return callback(mockPrisma);
});
mockPrisma.runAsTenant.mockImplementation(
  async (tenantId: any, callback: any) => {
    return callback(mockPrisma);
  },
);
mockPrisma.$transaction.mockImplementation(async (callback: any) => {
  if (Array.isArray(callback)) return Promise.all(callback);
  return callback(mockPrisma);
});
mockPrisma.updateWithOcc = jest.fn(async () => {
  return { id: 'trip-123', status: 'DISPATCHED', companyId: 'tenant-1' };
});

describe('Phase 3: Business Workflows Validation (Mocked E2E)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdTripId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    // Mock App Init Dependencies
    mockPrisma.aiModelConfig.findMany.mockResolvedValue([]);
    mockPrisma.integrationConnector.findMany.mockResolvedValue([]);
    mockPrisma.session.findMany.mockResolvedValue([]);
    mockPrisma.refreshToken.findMany.mockResolvedValue([]);
    mockPrisma.domainEvent.create.mockResolvedValue({ id: 'event-1' } as any);
    mockPrisma.domainEvent.findFirst.mockResolvedValue({ sequence: 1 } as any);
    mockPrisma.eventStore.create.mockResolvedValue({ id: 'event-1' } as any);
    mockPrisma.eventStore.findFirst.mockResolvedValue({ sequence: 1 } as any);
    mockPrisma.workflowRule.findMany.mockResolvedValue([]);
    mockPrisma.ruleExecutionHistory.findMany.mockResolvedValue([]);

    // Mock Roles for IAM Authorization
    mockPrisma.role.findUnique.mockResolvedValue({
      permissions: [
        'trips:create',
        'trips:read',
        'trips:update',
        'trips:delete',
        'trips:*',
      ],
    } as any);

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();

    // Mock User for Authentication
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('password', 10);

    // Auth service relies on finding the user
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'driver@parilink.com',
      password: hash,
      companyId: 'tenant-1',
      roleId: 'role-1',
      role: {
        name: 'Driver',
        permissions: ['trips:create', 'trips:read', 'trips:update'],
      },
      status: 'ACTIVE',
    });

    // 1. Authenticate to get token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'driver@parilink.com',
        password: 'password',
        companyId: 'tenant-1',
      });

    authToken = loginRes.body.access_token;

    // Basic verification that auth works with mocked DB
    expect(authToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Should create a new Trip (Workflow: Dispatch Initiation)', async () => {
    mockPrisma.trip.create.mockResolvedValue({
      id: 'trip-123',
      tripNo: 'TRP-2026-001',
      companyId: 'tenant-1',
      status: 'DRAFT',
      driverId: 'driver-1',
      vehicleId: 'veh-1',
    });

    mockPrisma.driver.findUnique.mockResolvedValue({ id: 'driver-1', status: 'AVAILABLE', companyId: 'tenant-1' });
    mockPrisma.vehicle.findUnique.mockResolvedValue({ id: 'veh-1', status: 'IN_SERVICE', companyId: 'tenant-1' });
    mockPrisma.driver.findFirst.mockResolvedValue({ id: 'driver-1', status: 'AVAILABLE', companyId: 'tenant-1' });
    mockPrisma.vehicle.findFirst.mockResolvedValue({ id: 'veh-1', status: 'IN_SERVICE', companyId: 'tenant-1' });

    const res = await request(app.getHttpServer())
      .post('/trips')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        driverId: 'driver-1',
        vehicleId: 'veh-1',
        origin: 'Mumbai Hub',
        destination: 'Delhi Hub',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe('trip-123');
    createdTripId = res.body.id;
  });

  it('2. Should update Trip Status to DISPATCHED (Workflow: Operations)', async () => {
    mockPrisma.trip.findFirst
      .mockResolvedValueOnce({
        id: createdTripId,
        status: 'DRAFT',
        companyId: 'tenant-1',
        updatedAt: new Date(),
      } as any)
      .mockResolvedValueOnce({
        id: createdTripId,
        status: 'DISPATCHED',
        companyId: 'tenant-1',
        updatedAt: new Date(),
      } as any);

    mockPrisma.trip.updateMany.mockResolvedValue({ count: 1 } as any);
    mockPrisma.trip.update.mockResolvedValue({
      id: createdTripId,
      status: 'DISPATCHED',
    } as any);

    const res = await request(app.getHttpServer())
      .patch(`/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'DISPATCHED',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('DISPATCHED');
  });
});
