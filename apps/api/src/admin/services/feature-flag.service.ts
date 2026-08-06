import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FeatureFlagService {
  private readonly logger = new Logger(FeatureFlagService.name);

  async isFeatureEnabled(
    tenantId: string,
    featureKey: string,
  ): Promise<boolean> {
    this.logger.log(
      `Checking feature flag ${featureKey} for tenant ${tenantId}`,
    );

    // Scaffolded: In a real environment, query LaunchDarkly or PostgreSQL FeatureFlags table
    // For scaffolding, we default to true to allow testing
    return true;
  }

  async getTenantFlags(tenantId: string) {
    return {
      ai_copilot: true,
      workflow_builder: true,
      warehouse_module: true,
      offline_mode: false,
    };
  }
}
