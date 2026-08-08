// @ts-nocheck
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowService as EngineWorkflowService } from './engine/workflow.service';
import { ApprovalEngineService } from './engine/approval.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

describe('WorkflowController', () => {
  let controller: WorkflowController;
  let workflowService: WorkflowService;

  const mockWorkflowService = {
    simulateRule: jest.fn(),
    importRules: jest.fn(),
    exportRules: jest.fn(),
    createRule: jest.fn(),
    getRules: jest.fn(),
    getRuleById: jest.fn(),
    updateRule: jest.fn(),
    deleteRule: jest.fn(),
    activateRule: jest.fn(),
    deactivateRule: jest.fn(),
    cloneRule: jest.fn(),
    createVersion: jest.fn(),
    getRuleHistory: jest.fn(),
    evaluateRules: jest.fn(),
  };

  const mockEngineWorkflowService = {
    createWorkflow: jest.fn(),
    publishWorkflow: jest.fn(),
    archiveWorkflow: jest.fn(),
    getMetrics: jest.fn(),
    getExecutionHistory: jest.fn(),
  };

  const mockApprovalService = {
    processDecision: jest.fn(),
  };

  const mockUser = {
    userId: 'user-1',
    companyId: 'company-1',
    roleId: 'role-1',
    email: 'test@test.com',
    roles: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        { provide: WorkflowService, useValue: mockWorkflowService },
        { provide: EngineWorkflowService, useValue: mockEngineWorkflowService },
        { provide: ApprovalEngineService, useValue: mockApprovalService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<WorkflowController>(WorkflowController);
    workflowService = module.get<WorkflowService>(WorkflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should simulate a rule', async () => {
    const dto = { entityData: { amount: 100 } };
    mockWorkflowService.simulateRule.mockResolvedValue({ result: 'PASS' });
    const result = await controller.simulateRule(mockUser, dto);
    expect(workflowService.simulateRule).toHaveBeenCalledWith('company-1', dto);
    expect(result).toEqual({ result: 'PASS' });
  });

  it('should get a rule by id', async () => {
    mockWorkflowService.getRuleById.mockResolvedValue({ id: 'rule-1' });
    const result = await controller.getRuleById(mockUser, 'rule-1');
    expect(workflowService.getRuleById).toHaveBeenCalledWith(
      'company-1',
      'rule-1',
    );
    expect(result).toEqual({ id: 'rule-1' });
  });

  it('should activate a rule', async () => {
    mockWorkflowService.activateRule.mockResolvedValue({ isActive: true });
    const result = await controller.activateRule(mockUser, 'rule-1');
    expect(workflowService.activateRule).toHaveBeenCalledWith(
      'company-1',
      'rule-1',
    );
    expect(result).toEqual({ isActive: true });
  });

  it('should clone a rule', async () => {
    mockWorkflowService.cloneRule.mockResolvedValue({ id: 'rule-2' });
    const result = await controller.cloneRule(mockUser, 'rule-1');
    expect(workflowService.cloneRule).toHaveBeenCalledWith(
      'company-1',
      'rule-1',
    );
    expect(result).toEqual({ id: 'rule-2' });
  });

  it('should export rules', async () => {
    mockWorkflowService.exportRules.mockResolvedValue({ version: '1.0' });
    const result = await controller.exportRules(mockUser);
    expect(workflowService.exportRules).toHaveBeenCalledWith('company-1');
    expect(result).toEqual({ version: '1.0' });
  });
});
