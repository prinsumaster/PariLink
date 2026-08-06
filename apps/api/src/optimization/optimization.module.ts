import { Module } from '@nestjs/common';
import { OptimizationController } from './optimization.controller';
import { NetworkStateService } from './engine/network-state.service';
import { CostEstimatorService } from './engine/cost-estimator.service';
import { HeuristicOptimizerService } from './engine/heuristic-optimizer.service';
import { OrchestrationService } from './engine/orchestration.service';
import { DispatchModule } from '../dispatch/dispatch.module';
import { VrpSolverService } from './engine/vrp-solver.service';
import { ScoringService } from './engine/scoring.service';
import { SimulationService } from './engine/simulation.service';
import { FeedbackService } from './feedback/feedback.service';
import { FeedbackController } from './feedback/feedback.controller';
import { OptimizationAnalyticsService } from './analytics/optimization-analytics.service';

@Module({
  imports: [DispatchModule],
  controllers: [OptimizationController, FeedbackController],
  providers: [
    NetworkStateService,
    CostEstimatorService,
    HeuristicOptimizerService,
    OrchestrationService,
    VrpSolverService,
    ScoringService,
    SimulationService,
    FeedbackService,
    OptimizationAnalyticsService,
  ],
  exports: [
    HeuristicOptimizerService,
    OrchestrationService,
    SimulationService,
    OptimizationAnalyticsService,
  ],
})
export class OptimizationModule {}
