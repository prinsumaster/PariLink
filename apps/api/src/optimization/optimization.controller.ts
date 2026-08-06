import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { HeuristicOptimizerService } from './engine/heuristic-optimizer.service';
import { OrchestrationService } from './engine/orchestration.service';
import {
  SimulationService,
  SimulationTrigger,
} from './engine/simulation.service';
import { OptimizationAnalyticsService } from './analytics/optimization-analytics.service';
import { Body } from '@nestjs/common';

@ApiTags('optimization')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('optimization')
export class OptimizationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly optimizer: HeuristicOptimizerService,
    private readonly orchestration: OrchestrationService,
    private readonly simulationService: SimulationService,
    private readonly analyticsService: OptimizationAnalyticsService,
  ) {}

  @Post('scenarios/generate')
  @RequirePermissions('dispatch:write')
  @ApiOperation({
    summary: 'Trigger heuristic optimization across the network state',
  })
  async generateScenarios(@GetUser() user: AuthenticatedUser) {
    const scenarioIds = await this.optimizer.generateScenarios(user.companyId);

    if (scenarioIds.length === 0) {
      throw new BadRequestException(
        'No feasible optimization scenarios could be generated. Ensure there are OPEN loads and AVAILABLE vehicles.',
      );
    }

    return this.prisma.runAsSystem(async (tx) =>
      tx.optimizationScenario.findMany({
        where: { id: { in: scenarioIds }, companyId: user.companyId },
        include: { recommendations: true },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  @Get('scenarios')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'List all generated optimization scenarios' })
  async listScenarios(@GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.optimizationScenario.findMany({
        where: { companyId: user.companyId },
        include: { _count: { select: { recommendations: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    );
  }

  @Get('scenarios/:id')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get details of a specific optimization scenario' })
  async getScenario(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.optimizationScenario.findUnique({
        where: { id, companyId: user.companyId },
        include: { recommendations: true },
      }),
    );
  }

  @Post('scenarios/:id/accept')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Accept a scenario and orchestrate dispatch plans' })
  async acceptScenario(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.orchestration.acceptScenario(user.companyId, id, user.userId);
  }

  @Post('scenarios/simulate')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Run a what-if simulation' })
  async simulateWhatIf(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { trigger: SimulationTrigger; parameters: any },
  ) {
    return this.simulationService.simulateWhatIf(
      user.companyId,
      body.trigger,
      body.parameters,
    );
  }

  @Get('analytics/executive')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get executive dashboard metrics' })
  async getExecutiveMetrics(@GetUser() user: AuthenticatedUser) {
    return this.analyticsService.getExecutiveDashboardMetrics(user.companyId);
  }
}
