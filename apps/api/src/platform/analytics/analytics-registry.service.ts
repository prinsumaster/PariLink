import { Injectable } from '@nestjs/common';

export interface IAnalyticsProvider {
  getDomainName(): string;
  getAnalytics(
    companyId: string,
    timeframe: string,
    ...args: unknown[]
  ): Promise<unknown>;
}

@Injectable()
export class AnalyticsRegistryService {
  private providers = new Map<string, IAnalyticsProvider>();

  register(provider: IAnalyticsProvider) {
    this.providers.set(provider.getDomainName(), provider);
  }

  getProvider(domain: string): IAnalyticsProvider | undefined {
    return this.providers.get(domain);
  }
}
