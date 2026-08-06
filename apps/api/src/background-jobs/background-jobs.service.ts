import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackgroundJobsService {
  private readonly logger = new Logger(BackgroundJobsService.name);

  constructor(private prisma: PrismaService) {}

  async createJob(
    companyId: string,
    userId: string,
    type: string,
    metadata: any = {},
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.create({
        data: {
          companyId,
          userId,
          type,
          status: 'PENDING',
          progress: 0,
          metadata,
        },
      }),
    );
  }

  async getJobs(companyId: string, userId: string, limit: number = 20) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.findMany({
        where: { companyId, userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    );
  }

  async getActiveJobs(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.findMany({
        where: {
          companyId,
          userId,
          status: { in: ['PENDING', 'PROCESSING'] },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async updateJobProgress(
    jobId: string,
    progress: number,
    status: string = 'PROCESSING',
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.backgroundJob.update({
        where: { id: jobId },
        data: {
          progress,
          status,
          ...(status === 'PROCESSING' && progress === 0
            ? { startedAt: new Date() }
            : {}),
        },
      }),
    );
  }

  async completeJob(jobId: string, result: any = {}) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.backgroundJob.update({
        where: { id: jobId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date(),
          result,
        },
      }),
    );
  }

  async failJob(jobId: string, error: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.backgroundJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          completedAt: new Date(),
          error,
        },
      }),
    );
  }

  async cancelJob(jobId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.backgroundJob.update({
        where: { id: jobId },
        data: {
          status: 'CANCELLED',
          completedAt: new Date(),
        },
      }),
    );
  }
}
