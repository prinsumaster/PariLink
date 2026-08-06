import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum SensitivityLevel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED = 'RESTRICTED', // PII, PHI, Financial
}

export interface GovernancePolicy {
  classification: string;
  sensitivity: SensitivityLevel;
  retentionDays: number;
  legalHold: boolean;
}

@Injectable()
export class GovernanceService {
  private readonly logger = new Logger(GovernanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Evaluates if a given dataset can be exported based on its classification and sensitivity
   */
  canExport(policy: GovernancePolicy, userRole: string): boolean {
    if (policy.legalHold) {
      this.logger.warn('[Governance] Export blocked due to Legal Hold status');
      return false;
    }

    if (
      policy.sensitivity === SensitivityLevel.RESTRICTED &&
      userRole !== 'SUPER_ADMIN'
    ) {
      this.logger.warn(
        '[Governance] Export blocked for highly restricted data',
      );
      return false;
    }

    return true;
  }

  /**
   * Determines if a record is past its retention period and eligible for purging
   */
  isEligibleForPurge(createdAt: Date, policy: GovernancePolicy): boolean {
    if (policy.legalHold) return false;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - policy.retentionDays);

    return createdAt < cutoffDate;
  }
}
