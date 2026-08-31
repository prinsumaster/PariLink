import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(companyId: string, vehicleId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const job = await tx.maintenanceJob.create({
        data: {
          companyId,
          vehicleId,
          type: data.type || 'PREVENTIVE',
          vendorId: data.vendorId,
          odometer: data.odometer,
          labourCost: data.labourCost || 0,
          status: 'OPEN',
        },
      });
      return job;
    });
  }

  async addPart(companyId: string, jobId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const job = await tx.maintenanceJob.findUnique({
        where: { id: jobId, companyId },
      });
      if (!job) throw new NotFoundException('Job not found');
      if (job.status === 'CLOSED') throw new Error('Cannot add parts to a closed job');

      const qty = data.qty || 1;
      const unitCost = data.unitCost || 0;
      const amount = qty * unitCost;

      const part = await tx.jobPart.create({
        data: {
          companyId,
          maintenanceJobId: jobId,
          name: data.name,
          qty,
          unitCost,
          amount,
        },
      });
      return part;
    });
  }

  async closeJob(companyId: string, jobId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const job = await tx.maintenanceJob.findUnique({
        where: { id: jobId, companyId },
        include: { parts: true },
      });
      if (!job) throw new NotFoundException('Job not found');

      const partsTotal = job.parts.reduce((sum, p) => sum + p.amount, 0);
      const totalCost = job.labourCost + partsTotal;

      const updatedJob = await tx.maintenanceJob.update({
        where: { id: jobId },
        data: {
          status: 'CLOSED',
          closedAt: new Date(),
        },
      });

      // Feed to per-truck P&L
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      await tx.truckProfitability.upsert({
        where: {
          companyId_vehicleId_month: {
            companyId,
            vehicleId: job.vehicleId,
            month: startOfMonth,
          },
        },
        update: {
          maintCost: { increment: totalCost },
        },
        create: {
          companyId,
          vehicleId: job.vehicleId,
          month: startOfMonth,
          maintCost: totalCost,
        },
      });

      return { ...updatedJob, totalCost };
    });
  }

  async getJobsByVehicle(companyId: string, vehicleId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId, companyId } });
      if (!vehicle) throw new NotFoundException('Vehicle not found');

      const jobs = await tx.maintenanceJob.findMany({
        where: { vehicleId, companyId },
        include: { parts: true },
        orderBy: { openedAt: 'desc' },
      });

      return jobs.map(job => {
        const partsTotal = job.parts.reduce((sum, p) => sum + p.amount, 0);
        return {
          ...job,
          totalCost: job.labourCost + partsTotal,
        };
      });
    });
  }
}
