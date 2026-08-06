import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DispatchKpiService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(companyId: string, fromDate?: Date, toDate?: Date) {
    const dateFilter = {
      createdAt: {
        ...(fromDate ? { gte: fromDate } : {}),
        ...(toDate ? { lte: toDate } : {}),
      },
    };

    const [
      totalPlans,
      assignedPlans,
      cancelledPlans,
      rejectedPlans,
      manualOverrides,
      violationBreakdown,
    ] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchPlan.count({ where: { companyId, ...dateFilter } }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchPlan.count({
          where: { companyId, status: 'ASSIGNED', ...dateFilter },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchPlan.count({
          where: { companyId, status: 'CANCELLED', ...dateFilter },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchPlan.count({
          where: { companyId, status: 'REJECTED', ...dateFilter },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.dispatchPlan.count({
          where: { companyId, overrideReason: { not: null }, ...dateFilter },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.constraintViolation.groupBy({
          by: ['constraint'],
          where: { companyId },
          _count: { constraint: true },
          orderBy: { _count: { constraint: 'desc' } },
          take: 10,
        }),
      ),
    ]);

    const assignmentRate =
      totalPlans > 0 ? ((assignedPlans / totalPlans) * 100).toFixed(1) : '0';
    const manualOverrideRate =
      assignedPlans > 0
        ? ((manualOverrides / assignedPlans) * 100).toFixed(1)
        : '0';

    return {
      period: { from: fromDate, to: toDate },
      totalPlans,
      assignedPlans,
      cancelledPlans,
      rejectedPlans,
      assignmentRatePct: parseFloat(assignmentRate),
      manualOverrideRatePct: parseFloat(manualOverrideRate),
      topConstraintViolations: violationBreakdown.map(
        (v: { constraint: string; _count: { constraint: number } }) => ({
          constraint: v.constraint,
          count: v._count.constraint,
        }),
      ),
    };
  }
}
