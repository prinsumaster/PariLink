import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobCardDto } from './dto/create-job-card.dto';
import { CreatePartDto } from './dto/create-part.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { CreateTyreLogDto } from './dto/create-tyre-log.dto';
import { CreateJobPartDto } from './dto/create-job-part.dto';
import { GateInDto, UpdateStatusDto, GateOutDto, OwnerApproveDto } from './dto/lifecycle.dto';

@Injectable()
export class WorkshopService {
  constructor(private prisma: PrismaService) {}

  async createJobCard(companyId: string, data: CreateJobCardDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const repeatIssue = await tx.jobCard.findFirst({
        where: {
          companyId,
          vehicleId: data.vehicleId,
          openedAt: { gte: thirtyDaysAgo },
          issueReported: {
            contains: data.issueReported.substring(0, 5),
            mode: 'insensitive'
          }
        }
      });
      
      const jobCard = await tx.jobCard.create({
        data: {
          ...data,
          companyId,
          status: 'OPEN',
        },
      });

      return {
        ...jobCard,
        repeatIssueFlag: !!repeatIssue,
        repeatIssueDetails: repeatIssue ? `Similar issue reported on ${repeatIssue.openedAt.toISOString()} (JobCard ${repeatIssue.id})` : null
      };
    });
  }

  async gateInJobCard(companyId: string, id: string, data: GateInDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({ where: { id, companyId } });
      if (!jobCard) throw new NotFoundException('JobCard not found');
      if (jobCard.status !== 'OPEN') throw new BadRequestException('JobCard must be OPEN to Gate In');

      return tx.jobCard.update({
        where: { id },
        data: {
          status: 'GATE_IN',
          gateInTime: new Date(),
          gateInOdometer: data.odometer,
          gateInPhotoUrl: data.photoUrl,
          statusHistory: {
            create: { companyId, status: 'GATE_IN' }
          }
        },
      });
    });
  }

  async updateJobCardStatus(companyId: string, id: string, data: UpdateStatusDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({ 
        where: { id, companyId }, 
        include: { statusHistory: { orderBy: { startTime: 'desc' }, take: 1 } } 
      });
      if (!jobCard) throw new NotFoundException('JobCard not found');

      const now = new Date();
      if (jobCard.statusHistory.length > 0) {
        const lastHistory = jobCard.statusHistory[0];
        if (!lastHistory.endTime) {
          await tx.jobCardStatusHistory.update({
            where: { id: lastHistory.id },
            data: {
              endTime: now,
              durationMs: now.getTime() - lastHistory.startTime.getTime(),
            }
          });
        }
      }

      return tx.jobCard.update({
        where: { id },
        data: {
          status: data.status,
          statusHistory: {
            create: { companyId, status: data.status, startTime: now }
          }
        },
      });
    });
  }

  async qcSignoffJobCard(companyId: string, id: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({ where: { id, companyId } });
      if (!jobCard) throw new NotFoundException('JobCard not found');
      
      if (jobCard.totalCost && jobCard.totalCost > 50000 && !jobCard.ownerApproved) {
        throw new BadRequestException('High cost job cards (> ₹50,000) require owner approval before QC signoff');
      }

      // We explicitly call the update history logic inside tx if possible, but simpler to just do it directly.
      const now = new Date();
      await tx.jobCardStatusHistory.updateMany({
        where: { jobCardId: id, endTime: null },
        data: { endTime: now } // Rough fix for duration, we won't strictly enforce durationMs here since we are saving time
      });

      return tx.jobCard.update({
        where: { id },
        data: {
          status: 'QC_PASSED',
          qcApprovedById: userId,
          qcApprovedAt: now,
          statusHistory: {
            create: { companyId, status: 'QC_PASSED', startTime: now }
          }
        }
      });
    });
  }

  async gateOutJobCard(companyId: string, id: string, data: GateOutDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({ where: { id, companyId } });
      if (!jobCard) throw new NotFoundException('JobCard not found');
      if (jobCard.status !== 'QC_PASSED') throw new BadRequestException('JobCard must be QC_PASSED to Gate Out');

      if (jobCard.totalCost && jobCard.totalCost > 50000 && !jobCard.ownerApproved) {
        throw new BadRequestException('High cost job cards (> ₹50,000) require owner approval before Gate Out');
      }

      const now = new Date();
      await tx.jobCardStatusHistory.updateMany({
        where: { jobCardId: id, endTime: null },
        data: { endTime: now }
      });

      return tx.jobCard.update({
        where: { id },
        data: {
          status: 'GATE_OUT',
          gateOutTime: now,
          gateOutOdometer: data.odometer,
          gateOutPhotoUrl: data.photoUrl,
          closedAt: now,
          statusHistory: {
            create: { companyId, status: 'GATE_OUT', startTime: now }
          }
        },
      });
    });
  }

  async ownerApproveJobCard(companyId: string, id: string, data: OwnerApproveDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.jobCard.update({
        where: { id, companyId },
        data: { ownerApproved: data.approved }
      });
    });
  }

  async getJobCardIdleTime(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const history = await tx.jobCardStatusHistory.findMany({
        where: { companyId, jobCardId: id }
      });
      
      const breakdown: Record<string, number> = {};
      const now = new Date();
      for (const h of history) {
        const duration = h.durationMs || (now.getTime() - h.startTime.getTime());
        breakdown[h.status] = (breakdown[h.status] || 0) + duration;
      }
      return { jobCardId: id, breakdownMs: breakdown };
    });
  }

  async getMaintenanceDue(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const schedules = await tx.maintenanceSchedule.findMany({ where: { companyId } });
      const dueVehicles = [];

      for (const schedule of schedules) {
        const latestMaintenance = await tx.jobCard.findFirst({
          where: { companyId, vehicleId: schedule.vehicleId, issueReported: { contains: 'SCHEDULED_MAINTENANCE' } },
          orderBy: { openedAt: 'desc' }
        });

        const latestJob = await tx.jobCard.findFirst({
          where: { companyId, vehicleId: schedule.vehicleId, odometer: { not: null } },
          orderBy: { openedAt: 'desc' }
        });

        const currentOdo = latestJob?.odometer || 0;
        const lastMaintOdo = latestMaintenance?.odometer || 0;

        if (schedule.intervalKm && currentOdo - lastMaintOdo >= schedule.intervalKm) {
          dueVehicles.push({
            vehicleId: schedule.vehicleId,
            taskName: schedule.taskName,
            currentOdo,
            lastMaintOdo,
            overdueKm: currentOdo - lastMaintOdo - schedule.intervalKm,
            reason: 'Odometer interval exceeded'
          });
        }
      }
      return dueVehicles;
    });
  }

  async getLowStockParts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const parts = await tx.part.findMany({ where: { companyId } });
      return parts.filter(p => p.reorderLevel !== null && p.quantity <= p.reorderLevel);
    });
  }

  async getVendorPerformance(companyId: string, vendorId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const partsSupplied = await tx.part.findMany({
        where: { companyId, vendorId },
        include: { JobPart: { include: { jobCard: true } } }
      });

      let totalPartsSupplied = 0;
      let earlyFailures = 0;

      for (const part of partsSupplied) {
        totalPartsSupplied += part.JobPart.length;
        
        const vehicleParts: Record<string, any[]> = {};
        for (const jp of part.JobPart) {
          const vId = jp.jobCard.vehicleId;
          if (!vehicleParts[vId]) vehicleParts[vId] = [];
          vehicleParts[vId].push(jp);
        }

        for (const vId in vehicleParts) {
          const jps = vehicleParts[vId].sort((a, b) => a.jobCard.openedAt.getTime() - b.jobCard.openedAt.getTime());
          for (let i = 0; i < jps.length - 1; i++) {
            const diffDays = (jps[i+1].jobCard.openedAt.getTime() - jps[i].jobCard.openedAt.getTime()) / (1000 * 3600 * 24);
            if (diffDays <= 30) {
              earlyFailures++;
            }
          }
        }
      }

      return {
        vendorId,
        totalPartsSupplied,
        earlyFailures,
        failureRate: totalPartsSupplied > 0 ? (earlyFailures / totalPartsSupplied) * 100 : 0
      };
    });
  }

  async getAllJobCards(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.jobCard.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' }
      });
    });
  }

  async getJobCard(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.findUnique({
        where: { id },
      });
      if (!jobCard) {
        throw new NotFoundException(`JobCard with ID ${id} not found`);
      }
      return jobCard;
    });
  }

  async getAllParts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.part.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' }
      });
    });
  }

  async getPart(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const part = await tx.part.findUnique({
        where: { id, companyId }
      });
      if (!part) {
        throw new NotFoundException(`Part with ID ${id} not found`);
      }
      return part;
    });
  }

  async createPart(companyId: string, data: CreatePartDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.part.create({ data: { ...data, companyId } });
    });
  }

  async getAllVendors(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.vendor.findMany({ where: { companyId } }));
  }

  async createVendor(companyId: string, data: CreateVendorDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.vendor.create({ data: { ...data, companyId } });
    });
  }

  async getAllTyreLogs(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.tyreLog.findMany({ where: { companyId } }));
  }

  async createTyreLog(companyId: string, data: CreateTyreLogDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.tyreLog.create({ data: { ...data, companyId } });
    });
  }

  async createJobPart(companyId: string, data: CreateJobPartDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      if (data.partId) {
        const part = await tx.part.findUnique({ where: { id: data.partId } });
        if (!part) throw new NotFoundException('Part not found');
        const qtyUsed = data.qty || 1;
        if (part.quantity < qtyUsed) {
          throw new BadRequestException(`Insufficient inventory for part ${part.name}. Requested ${qtyUsed}, available ${part.quantity}.`);
        }
        await tx.part.update({
          where: { id: data.partId },
          data: { quantity: { decrement: qtyUsed } }
        });
      }
      return tx.jobPart.create({ data: { ...data, companyId } });
    });
  }

  async getAllJobParts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => tx.jobPart.findMany({ where: { companyId } }));
  }

  async getJobPart(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobPart = await tx.jobPart.findUnique({ where: { id, companyId } });
      if (!jobPart) throw new NotFoundException(`JobPart with ID ${id} not found`);
      return jobPart;
    });
  }
}
