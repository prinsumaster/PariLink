import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { PredictionService } from '../prediction/prediction.service';
import { RiskService } from '../risk/risk.service';

@Injectable()
export class AiSchedulerService {
  private readonly logger = new Logger(AiSchedulerService.name);

  constructor(
    // @ts-ignore: DI dependency reserved for future use
    private _predictionService: PredictionService,
    // @ts-ignore: DI dependency reserved for future use
    private _riskService: RiskService,
  ) {}

  // Example Cron job that would run nightly to recalculate risk scores
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleNightlyRiskRecalculation() {
    this.logger.debug('Running nightly AI risk recalculations');
    // Batched logic here
  }
}
