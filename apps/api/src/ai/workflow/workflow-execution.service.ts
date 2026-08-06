import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmManagerService } from '../platform/llm-manager.service';
import { AiObservabilityService } from '../observability/observability.service';

export type WorkflowStepStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED'
  | 'ROLLED_BACK';

export interface WorkflowStep {
  stepId: string;
  name: string;
  description: string;
  requiresApproval: boolean;
  approverRole?: string;
  status: WorkflowStepStatus;
  output?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface WorkflowExecution {
  executionId: string;
  workflowName: string;
  companyId: string;
  initiatedBy: string;
  steps: WorkflowStep[];
  status: WorkflowStepStatus;
  createdAt: Date;
  completedAt?: Date;
  rollbackReason?: string;
}

// In-memory execution store (production: use Redis/Prisma)
const executions = new Map<string, WorkflowExecution>();

@Injectable()
export class WorkflowExecutionService {
  private readonly logger = new Logger(WorkflowExecutionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmManager: LlmManagerService,
    private readonly observability: AiObservabilityService,
  ) {}

  /**
   * Start a workflow execution. Creates steps from the workflow definition,
   * runs non-approval steps automatically, pauses at approval gates.
   */
  async executeWorkflow(
    workflowName: string,
    companyId: string,
    input: Record<string, any>,
    initiatedBy: string,
  ): Promise<WorkflowExecution> {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Define workflow steps from known workflow templates
    const steps = this.buildWorkflowSteps(workflowName, input);

    const execution: WorkflowExecution = {
      executionId,
      workflowName,
      companyId,
      initiatedBy,
      steps,
      status: 'RUNNING',
      createdAt: new Date(),
    };

    executions.set(executionId, execution);

    this.logger.log(
      `Workflow started: ${workflowName} [${executionId}] by ${initiatedBy}`,
    );

    // Run workflow steps until hitting an approval gate
    await this.processWorkflow(executionId, input);

    return executions.get(executionId)!;
  }

  private async processWorkflow(
    executionId: string,
    input: Record<string, any>,
  ) {
    const execution = executions.get(executionId);
    if (!execution) return;

    for (const step of execution.steps) {
      if (step.status !== 'PENDING') continue;

      step.status = 'RUNNING';
      this.logger.log(`Executing step: ${step.name} [${executionId}]`);

      try {
        // Generate AI output for this step
        const output = await this.llmManager.generateResponse(
          `You are executing step "${step.name}" of the "${execution.workflowName}" workflow.
           Step Description: ${step.description}
           Provide a concise execution result for this step.`,
          `Input context: ${JSON.stringify(input, null, 2)}`,
          {},
          undefined,
          'logistics_analyst',
        );
        step.output = output;

        if (step.requiresApproval) {
          step.status = 'AWAITING_APPROVAL';
          execution.status = 'AWAITING_APPROVAL';
          this.logger.log(
            `Step "${step.name}" paused — awaiting human approval (${step.approverRole || 'any manager'})`,
          );
          // Log to audit trail
          await this.logWorkflowAudit(execution, step, 'AWAITING_APPROVAL');
          return; // Pause until approved
        }

        step.status = 'COMPLETED';
        await this.logWorkflowAudit(execution, step, 'COMPLETED');
      } catch (error: any) {
        step.status = 'FAILED';
        execution.status = 'FAILED';
        this.logger.error(`Step failed: ${step.name} — ${error.message}`);
        await this.logWorkflowAudit(execution, step, 'FAILED');
        return;
      }
    }

    // All steps completed
    if (execution.steps.every((s) => s.status === 'COMPLETED')) {
      execution.status = 'COMPLETED';
      execution.completedAt = new Date();
      this.logger.log(
        `Workflow completed: ${execution.workflowName} [${executionId}]`,
      );
    }
  }

  /**
   * Human approves a pending workflow step — resumes execution
   */
  async approveWorkflow(
    executionId: string,
    stepId: string,
    approvedBy: string,
  ): Promise<WorkflowExecution> {
    const execution = executions.get(executionId);
    if (!execution)
      throw new NotFoundException(`Execution ${executionId} not found`);

    const step = execution.steps.find((s) => s.stepId === stepId);
    if (!step) throw new NotFoundException(`Step ${stepId} not found`);
    if (step.status !== 'AWAITING_APPROVAL') {
      throw new Error(
        `Step ${stepId} is not awaiting approval (status: ${step.status})`,
      );
    }

    step.status = 'APPROVED';
    step.approvedBy = approvedBy;
    step.approvedAt = new Date();
    execution.status = 'RUNNING';

    this.logger.log(
      `Step "${step.name}" approved by ${approvedBy} — resuming workflow`,
    );
    await this.logWorkflowAudit(execution, step, 'APPROVED');

    // Resume execution
    await this.processWorkflow(executionId, {});

    return executions.get(executionId)!;
  }

  /**
   * Human rejects a pending workflow step — triggers escalation
   */
  async rejectWorkflow(
    executionId: string,
    stepId: string,
    rejectedBy: string,
    reason: string,
  ): Promise<WorkflowExecution> {
    const execution = executions.get(executionId);
    if (!execution)
      throw new NotFoundException(`Execution ${executionId} not found`);

    const step = execution.steps.find((s) => s.stepId === stepId);
    if (!step) throw new NotFoundException(`Step ${stepId} not found`);

    step.status = 'REJECTED';
    execution.status = 'REJECTED';
    execution.rollbackReason = reason;

    this.logger.warn(
      `Workflow "${execution.workflowName}" rejected by ${rejectedBy}: ${reason}`,
    );
    await this.logWorkflowAudit(execution, step, 'REJECTED', reason);

    return execution;
  }

  /**
   * List all active executions for a company
   */
  getExecutions(companyId: string): WorkflowExecution[] {
    return Array.from(executions.values()).filter(
      (e) => e.companyId === companyId,
    );
  }

  /**
   * Get a specific execution by ID
   */
  getExecution(executionId: string): WorkflowExecution {
    const execution = executions.get(executionId);
    if (!execution)
      throw new NotFoundException(`Execution ${executionId} not found`);
    return execution;
  }

  /**
   * Build workflow steps from a named template
   */
  private buildWorkflowSteps(
    workflowName: string,
    _input: Record<string, any>,
  ): WorkflowStep[] {
    const templates: Record<string, WorkflowStep[]> = {
      shipment_delay_analysis: [
        {
          stepId: 'step_1',
          name: 'Gather Delay Context',
          description:
            'Collect shipment location, estimated delay, and contributing factors',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_2',
          name: 'Root Cause Analysis',
          description: 'Identify primary and secondary causes of the delay',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_3',
          name: 'Mitigation Recommendation',
          description: 'Generate rerouting and notification recommendations',
          requiresApproval: true,
          approverRole: 'DISPATCHER',
          status: 'PENDING',
        },
        {
          stepId: 'step_4',
          name: 'Customer Notification',
          description:
            'Draft and send proactive delay notification to customer',
          requiresApproval: true,
          approverRole: 'MANAGER',
          status: 'PENDING',
        },
      ],
      exception_handling: [
        {
          stepId: 'step_1',
          name: 'Exception Classification',
          description: 'Classify the exception type and severity level',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_2',
          name: 'Impact Assessment',
          description:
            'Assess operational and financial impact of the exception',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_3',
          name: 'Resolution Plan',
          description: 'Generate resolution steps and timeline',
          requiresApproval: true,
          approverRole: 'SUPERVISOR',
          status: 'PENDING',
        },
      ],
      invoice_review: [
        {
          stepId: 'step_1',
          name: 'Invoice Validation',
          description:
            'Validate invoice amounts, line items, and billing codes',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_2',
          name: 'Anomaly Detection',
          description: 'Flag any billing discrepancies or unusual charges',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_3',
          name: 'Approval Decision',
          description: 'Recommend approve, dispute, or hold for review',
          requiresApproval: true,
          approverRole: 'FINANCE_MANAGER',
          status: 'PENDING',
        },
      ],
      support_triage: [
        {
          stepId: 'step_1',
          name: 'Issue Classification',
          description:
            'Classify support issue type, severity, and affected system',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_2',
          name: 'Knowledge Base Search',
          description: 'Search for existing solutions or known issues',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_3',
          name: 'Resolution Draft',
          description: 'Generate draft resolution or escalation path',
          requiresApproval: false,
          status: 'PENDING',
        },
      ],
      operational_summary: [
        {
          stepId: 'step_1',
          name: 'Data Collection',
          description:
            'Aggregate operational data across fleet, loads, and finance',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_2',
          name: 'KPI Analysis',
          description: 'Analyze KPI trends and flag anomalies',
          requiresApproval: false,
          status: 'PENDING',
        },
        {
          stepId: 'step_3',
          name: 'Executive Summary',
          description:
            'Generate executive operational summary with recommendations',
          requiresApproval: false,
          status: 'PENDING',
        },
      ],
    };

    return (
      templates[workflowName] || [
        {
          stepId: 'step_1',
          name: 'Analysis',
          description: `Execute custom workflow: ${workflowName}`,
          requiresApproval: true,
          approverRole: 'MANAGER',
          status: 'PENDING',
        },
      ]
    );
  }

  private async logWorkflowAudit(
    execution: WorkflowExecution,
    step: WorkflowStep,
    status: string,
    notes?: string,
  ) {
    try {
      const agentRecord = await this.prisma.runAsSystem(async (tx) =>
        tx.aiAgent.findFirst(),
      );
      if (agentRecord) {
        await this.prisma.runAsSystem(async (tx) =>
          tx.aiInteractionLog.create({
            data: {
              agentId: agentRecord.id,
              prompt: `Workflow: ${execution.workflowName} | Step: ${step.name}`,
              response: step.output || notes || status,
              userId: step.approvedBy || execution.initiatedBy,
              companyId: execution.companyId,
              sessionId: execution.executionId,
            },
          }),
        );
      }
    } catch {
      // Non-blocking — don't fail workflow for audit log errors
    }
  }
}
