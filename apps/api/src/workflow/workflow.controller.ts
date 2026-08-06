import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import {
  CreateWorkflowRuleDto,
  EvaluateWorkflowDto,
  UpdateWorkflowRuleDto,
  SimulateRuleDto,
  ImportRulesDto,
} from './dto/workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService as EngineWorkflowService } from './engine/workflow.service';
import { ApprovalEngineService } from './engine/approval.service';

@ApiTags('workflow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('workflow')
export class WorkflowController {
  constructor(
    private readonly workflowService: WorkflowService,
    private readonly engineWorkflowService: EngineWorkflowService,
    private readonly approvalService: ApprovalEngineService,
  ) {}

  // ==========================================
  // RULES ENGINE (V2) - CRUD & MANAGEMENT
  // ==========================================

  @Post('rules/simulate')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Simulate a rule without side effects' })
  simulateRule(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: SimulateRuleDto,
  ) {
    return this.workflowService.simulateRule(user.companyId, dto);
  }

  @Post('rules/import')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Import rules from JSON' })
  importRules(@GetUser() user: AuthenticatedUser, @Body() dto: ImportRulesDto) {
    return this.workflowService.importRules(user.companyId, dto);
  }

  @Get('rules/export')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Export all rules to JSON' })
  exportRules(@GetUser() user: AuthenticatedUser) {
    return this.workflowService.exportRules(user.companyId);
  }

  @Post('rules')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Create a new workflow rule' })
  createRule(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkflowRuleDto,
  ) {
    return this.workflowService.createRule(user.companyId, dto);
  }

  @Get('rules')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get all workflow rules' })
  getRules(@GetUser() user: AuthenticatedUser) {
    return this.workflowService.getRules(user.companyId);
  }

  @Get('rules/:id')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get a specific workflow rule by ID' })
  getRuleById(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.getRuleById(user.companyId, id);
  }

  @Patch('rules/:id')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Update a workflow rule' })
  updateRule(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowRuleDto,
  ) {
    return this.workflowService.updateRule(user.companyId, id, dto);
  }

  @Delete('rules/:id')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Delete a workflow rule' })
  deleteRule(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.deleteRule(user.companyId, id);
  }

  @Post('rules/:id/activate')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Activate a workflow rule' })
  activateRule(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.activateRule(user.companyId, id);
  }

  @Post('rules/:id/deactivate')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Deactivate a workflow rule' })
  deactivateRule(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.deactivateRule(user.companyId, id);
  }

  @Post('rules/:id/clone')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Clone a workflow rule' })
  cloneRule(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.cloneRule(user.companyId, id);
  }

  @Post('rules/:id/version')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Create a new version of a workflow rule' })
  createVersion(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.createVersion(user.companyId, id);
  }

  @Get('rules/:id/history')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get execution history of a workflow rule' })
  getRuleHistory(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workflowService.getRuleHistory(user.companyId, id);
  }

  @Post('evaluate')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Evaluate data against active workflow rules' })
  evaluateRules(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: EvaluateWorkflowDto,
  ) {
    return this.workflowService.evaluateRules(user.companyId, dto);
  }

  // ==========================================
  // AUTOMATION ENGINE (V1) - GRAPH WORKFLOWS
  // ==========================================

  @Post('v2/definitions')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Create a new workflow definition (Graph)' })
  createWorkflow(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.engineWorkflowService.createWorkflow(
      user.companyId,
      data,
      user.userId,
    );
  }

  @Post('v2/definitions/:id/publish')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Publish workflow definition' })
  publishWorkflow(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.engineWorkflowService.publishWorkflow(
      user.companyId,
      id,
      user.userId,
    );
  }

  @Post('v2/definitions/:id/archive')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Archive workflow definition' })
  archiveWorkflow(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.engineWorkflowService.archiveWorkflow(
      user.companyId,
      id,
      user.userId,
    );
  }

  @Get('v2/metrics')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get workflow metrics' })
  getMetrics(@GetUser() user: AuthenticatedUser) {
    return this.engineWorkflowService.getMetrics(user.companyId);
  }

  @Get('v2/definitions/:id/history')
  @RequirePermissions('workflow:read')
  @ApiOperation({ summary: 'Get workflow execution history' })
  getExecutionHistory(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.engineWorkflowService.getExecutionHistory(user.companyId, id);
  }

  @Post('v2/approvals/requests/:requestId/steps/:stepId')
  @RequirePermissions('workflow:write')
  @ApiOperation({ summary: 'Process approval decision' })
  processApprovalDecision(
    @GetUser() user: AuthenticatedUser,
    @Param('requestId') requestId: string,
    @Param('stepId') stepId: string,
    @Body() data: { decision: 'APPROVED' | 'REJECTED'; comments?: string },
  ) {
    return this.approvalService.processDecision(
      user.companyId,
      requestId,
      stepId,
      user.userId,
      data.decision,
      data.comments,
    );
  }
}
