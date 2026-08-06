import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AnalyticsETLService } from './analytics-etl.service';

@Processor('analytics_etl', { concurrency: 5 })
export class AnalyticsETLProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsETLProcessor.name);

  constructor(private readonly etlService: AnalyticsETLService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { name, data } = job;
    this.logger.log(`Processing ETL Job ${name}`);

    if (name === 'DAILY_AGGREGATION') {
      await this.etlService.runDailyAggregation(data.companyId);
    }
  }
}
