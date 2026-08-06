import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionEngineService } from './execution.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ActionEngineService } from './action.service';
import { ApprovalEngineService } from './approval.service';
import { ConditionEngineService } from './condition.service';
import { SchedulerEngineService } from './scheduler.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('ExecutionEngineService', () => {
  let service: ExecutionEngineService;
  let prismaService: PrismaService;
  let workflowQueue: any;

  const mockPrismaService = {
    runAsSystem: jest
      .fn()
      .mockImplementation(async (cb) => cb(mockPrismaService)),
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => cb(mockPrismaService)),
    workflowExecution: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    workflowExecutionStep: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockQueue = {
    addBulk: jest.fn(),
  };

  const mockConditionEngine = {
    evaluate: jest.fn().mockReturnValue(true),
  };

  const mockActionEngine = {
    executeAction: jest.fn().mockResolvedValue('success'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutionEngineService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ActionEngineService,
          useValue: mockActionEngine,
        },
        {
          provide: ConditionEngineService,
          useValue: mockConditionEngine,
        },
        {
          provide: ApprovalEngineService,
          useValue: {},
        },
        {
          provide: SchedulerEngineService,
          useValue: {},
        },
        {
          provide: getQueueToken('workflow_execution'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<ExecutionEngineService>(ExecutionEngineService);
    prismaService = module.get<PrismaService>(PrismaService);
    workflowQueue = module.get(getQueueToken('workflow_execution'));

    // Manual onModuleInit trigger
    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startExecution', () => {
    it('should create an execution and process the first node', async () => {
      const companyId = 'test-company';
      const workflowId = 'wf-1';
      const triggerPayload = { amount: 100 };
      const graph = {
        nodes: [
          { id: 'node-1', type: 'TRIGGER' },
          { id: 'node-2', type: 'ACTION' },
        ],
        edges: [{ source: 'node-1', target: 'node-2' }],
      };

      const mockExecution = {
        id: 'exec-1',
        companyId,
        workflowId,
        context: triggerPayload,
        status: 'RUNNING',
      };

      mockPrismaService.workflowExecution.create.mockResolvedValue(
        mockExecution,
      );

      await service.startExecution(
        companyId,
        workflowId,
        triggerPayload,
        graph,
      );

      expect(mockPrismaService.workflowExecution.create).toHaveBeenCalled();
      expect(mockQueue.addBulk).toHaveBeenCalledWith([
        {
          name: 'EXECUTE_NODE',
          data: {
            companyId,
            executionId: 'exec-1',
            node: graph.nodes[1],
            graph,
            context: triggerPayload,
          },
          opts: expect.any(Object),
        },
      ]);
    });
  });
});
