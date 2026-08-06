import { Test, TestingModule } from '@nestjs/testing';
import { DispatchAiService } from './dispatch-ai.service';
import { PrismaService } from '../../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';

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
});
