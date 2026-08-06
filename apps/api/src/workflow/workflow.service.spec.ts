import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConditionEngineService } from './engine/condition.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    runAsSystem: jest
      .fn()
      .mockImplementation(async (cb) => cb(mockPrismaService)),
    runAsTenant: jest.fn((companyId, callback) => callback(mockTx)),
  };

  const mockTx = {
    workflowRule: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    ruleExecutionHistory: {
      create: jest.fn(),
    },
  };

  const mockConditionEngine = {
    evaluate: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ConditionEngineService,
          useValue: mockConditionEngine,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRule', () => {
    it('should create a workflow rule with priority', async () => {
      const companyId = 'test-company';
      const dto = {
        name: 'Test Rule',
        entityType: 'LOAD',
        trigger: 'CREATED',
        conditions: { operator: 'EQUALS' },
        actions: [{ type: 'EMAIL', to: 'test@example.com' }],
        priority: 10,
      };

      const expectedResult = { id: 'rule-1', ...dto, companyId, version: 1 };
      mockTx.workflowRule.create.mockResolvedValue(expectedResult);

      const result = await service.createRule(companyId, dto);

      expect(mockPrismaService.runAsTenant).toHaveBeenCalledWith(
        companyId,
        expect.any(Function),
      );
      expect(mockTx.workflowRule.create).toHaveBeenCalledWith({
        data: {
          companyId,
          name: dto.name,
          entityType: dto.entityType,
          trigger: dto.trigger,
          conditions: dto.conditions,
          actions: dto.actions,
          priority: 10,
          version: 1,
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('evaluateRules', () => {
    it('should evaluate rules, return triggered actions, and log history', async () => {
      const companyId = 'test-company';
      const dto = {
        entityType: 'LOAD',
        trigger: 'CREATED',
        entityData: { id: 'load-1', status: 'PENDING', amount: 100 },
      };

      const mockRules = [
        {
          id: 'rule-1',
          name: 'Rule 1',
          entityType: 'LOAD',
          trigger: 'CREATED',
          isActive: true,
          conditions: { operator: 'EQUALS' },
          actions: [{ type: 'NOTIFY' }],
        },
      ];

      mockTx.workflowRule.findMany.mockResolvedValue(mockRules);
      mockConditionEngine.evaluate.mockReturnValue(true); // Simulate condition passing

      const result = await service.evaluateRules(companyId, dto);

      expect(mockTx.workflowRule.findMany).toHaveBeenCalledWith({
        where: {
          entityType: dto.entityType,
          trigger: dto.trigger,
          isActive: true,
        },
        orderBy: { priority: 'desc' },
      });
      expect(result).toEqual({
        triggeredActions: [{ type: 'NOTIFY' }],
      });
      expect(mockTx.ruleExecutionHistory.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          companyId,
          ruleId: 'rule-1',
          entityId: 'load-1',
          entityType: 'LOAD',
          result: 'PASS',
        }),
      });
    });
  });
});
