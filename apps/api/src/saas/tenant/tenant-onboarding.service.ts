import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantOnboardingService {
  private readonly logger = new Logger(TenantOnboardingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async completeOnboarding(
    companyId: string,
    dto: {
      timezone: string;
      currency: string;
      language: string;
      fiscalYearStartMonth: number;
    },
  ) {
    this.logger.log(`Completing onboarding for company ${companyId}`);

    const config = await this.prisma.runAsSystem(async (tx) => {
      return tx.tenantConfiguration.upsert({
        where: { companyId },
        update: {
          timezone: dto.timezone,
          currency: dto.currency,
          language: dto.language,
          fiscalYearStartMonth: dto.fiscalYearStartMonth,
          onboardingCompleted: true,
        },
        create: {
          companyId,
          timezone: dto.timezone,
          currency: dto.currency,
          language: dto.language,
          fiscalYearStartMonth: dto.fiscalYearStartMonth,
          onboardingCompleted: true,
          settings: {},
          theme: {},
          policies: {},
        },
      });
    });

    return config;
  }

  async uploadLogo(companyId: string, logoUrl: string) {
    return this.prisma.runAsSystem((tx) =>
      tx.tenantConfiguration.update({
        where: { companyId },
        data: { logoUrl },
      }),
    );
  }
}
