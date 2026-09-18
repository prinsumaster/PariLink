// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { DispatchAiService } from './dispatch-ai.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';

// Mock the GoogleGenAI SDK
jest.mock('@google/genai', () => {
  return {
    Type: {
      ARRAY: 'array',
      OBJECT: 'object',
      STRING: 'string',
      INTEGER: 'integer'
    },
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: jest.fn().mockResolvedValue({
          text: JSON.stringify([
            {
              tripId: 'trip-1',
              tripNumber: 'T-1',
              vehicleId: 'veh-1',
              vehicleName: 'ABC-123',
              driverId: 'drv-1',
              driverName: 'John Doe',
              confidenceScore: 98,
              reasoning: 'AI matched based on location.'
            }
          ])
        })
      }
    }))
  };
});

describe('DispatchAiService', () => {
  let service: DispatchAiService;
  let prisma: PrismaService;
  let queueMock: any;

  beforeEach(async () => {
    queueMock = {
      add: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DispatchAiService,
        {
          provide: PrismaService,
          useValue: {
            runAsTenant: jest.fn().mockImplementation(function (companyId, cb) {
              return cb(this);
            }),
            load: { findUnique: jest.fn() },
            aiRecommendation: { create: jest.fn() },
            trip: { findMany: jest.fn().mockResolvedValue([]) },
            vehicle: { findMany: jest.fn().mockResolvedValue([]) },
            driver: { findMany: jest.fn().mockResolvedValue([]) },
          },
        },
        {
          provide: getQueueToken('ai-inference'),
          useValue: queueMock,
        },
      ],
    }).compile();

    service = module.get<DispatchAiService>(DispatchAiService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if load not found', async () => {
    jest.spyOn(prisma.load, 'findUnique').mockResolvedValue(null);
    await expect(
      service.requestRecommendation('company-id', 'invalid-load', 'user-id'),
    ).rejects.toThrow('Load not found');
  });

  it('should create recommendation and enqueue job', async () => {
    const mockLoad = { id: 'load-id', companyId: 'company-id' };
    const mockRec = { id: 'rec-id', status: 'PENDING' };

    jest.spyOn(prisma.load, 'findUnique').mockResolvedValue(mockLoad as any);
    jest
      .spyOn(prisma.aiRecommendation, 'create')
      .mockResolvedValue(mockRec as any);

    const result = await service.requestRecommendation(
      'company-id',
      'load-id',
      'user-id',
    );

    expect(result.id).toBe('rec-id');
    expect(queueMock.add).toHaveBeenCalledWith('dispatch-match', {
      companyId: 'company-id',
      loadId: 'load-id',
      recommendationId: 'rec-id',
      userId: 'user-id',
    });
  });

  describe('getOptimalAssignments', () => {
    it('should query trips, vehicles, and drivers with strict companyId assertion and parse AI output', async () => {
      const companyId = 'test-company-id';

      jest.spyOn(prisma.trip, 'findMany').mockResolvedValue([{ id: 'trip-1', tripNumber: 'T-1' }] as any);
      jest.spyOn(prisma.vehicle, 'findMany').mockResolvedValue([{ id: 'veh-1', licensePlate: 'ABC-123' }] as any);
      jest.spyOn(prisma.driver, 'findMany').mockResolvedValue([{ id: 'drv-1', firstName: 'John', lastName: 'Doe' }] as any);

      const assignments = await service.getOptimalAssignments(companyId);

      expect(prisma.trip.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            companyId,
            status: 'PENDING'
          })
        })
      );

      // It should call the mocked AI SDK and return the parsed JSON
      expect(assignments).toHaveLength(1);
      expect(assignments[0]).toMatchObject({
        tripId: 'trip-1',
        tripNumber: 'T-1',
        vehicleId: 'veh-1',
        vehicleName: 'ABC-123',
        driverId: 'drv-1',
        driverName: 'John Doe',
        confidenceScore: 98,
        reasoning: 'AI matched based on location.'
      });
      
      // Also verify it passed the prompt to the AI model
      expect(service['ai'].models.generateContent).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gemini-2.5-flash',
          contents: expect.stringContaining('T-1'),
          config: expect.objectContaining({
            responseMimeType: 'application/json'
          })
        })
      );
    });
  });
});
