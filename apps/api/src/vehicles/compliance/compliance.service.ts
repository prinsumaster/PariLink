// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class ComplianceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly auditService: AuditService,
  ) {}

  async logHosViolation(companyId: string, data: any, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const violation = await tx.hosViolation.create({
        data: {
          companyId,
          driverId: data.driverId,
          rule: data.rule,
          violationTime: data.violationTime,
          durationMinutes: data.durationMinutes,
          severity: data.severity,
          status: 'OPEN',
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Compliance',
          entityType: 'HosViolation',
          entityId: violation.id,
          action: 'CREATE',
          details: { driverId: data.driverId, rule: data.rule },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamId: data.driverId,
        streamType: 'DRIVER',
        eventType: 'HosViolationLogged',
        payload: {
          rule: data.rule,
          severity: data.severity,
          violationTime: data.violationTime,
        },
        userId,
      });

      return violation;
    });
  }

  async getHosViolations(companyId: string, driverId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (driverId) where.driverId = driverId;
      return tx.hosViolation.findMany({
        where,
        orderBy: { violationTime: 'desc' },
      });
    });
  }

  async submitDvir(companyId: string, data: any, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const dvir = await tx.dvirLog.create({
        data: {
          companyId,
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          type: data.type,
          status: data.status,
          defects: data.defects || [],
          inspectorName: data.inspectorName,
          signature: data.signature,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Compliance',
          entityType: 'DvirLog',
          entityId: dvir.id,
          action: 'CREATE',
          details: {
            vehicleId: data.vehicleId,
            driverId: data.driverId,
            status: data.status,
          },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamId: dvir.id,
        streamType: 'COMPLIANCE',
        eventType: 'DvirSubmitted',
        payload: {
          vehicleId: data.vehicleId,
          driverId: data.driverId,
          status: data.status,
        },
        userId,
      });

      if (data.status === 'UNSAFE' || data.status === 'NEEDS_REPAIR') {
        // Tag vehicle status
        await tx.vehicle.update({
          where: { id: data.vehicleId },
          data: { status: 'MAINTENANCE_DUE' },
        });

        await this.eventStore.append({
          tenantId: companyId,
          streamId: data.vehicleId,
          streamType: 'VEHICLE',
          eventType: 'VehicleFlaggedForRepair',
          payload: { reason: 'DVIR_DEFECTS', defects: data.defects },
          userId,
        });
      }

      return dvir;
    });
  }

  async getDvirLogs(companyId: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (vehicleId) where.vehicleId = vehicleId;
      return tx.dvirLog.findMany({ where, orderBy: { createdAt: 'desc' } });
    });
  }

  async registerVehicle(
    companyId: string,
    vehicleId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const reg = await tx.vehicleRegistration.upsert({
        where: { vehicleId },
        update: {
          state: data.state,
          plateNumber: data.plateNumber,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate,
          documentUrl: data.documentUrl,
        },
        create: {
          companyId,
          vehicleId,
          state: data.state,
          plateNumber: data.plateNumber,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate,
          documentUrl: data.documentUrl,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Compliance',
          entityType: 'VehicleRegistration',
          entityId: reg.id,
          action: 'UPSERT',
          details: { vehicleId, plateNumber: data.plateNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamId: vehicleId,
        streamType: 'VEHICLE',
        eventType: 'VehicleRegistered',
        payload: {
          state: data.state,
          plateNumber: data.plateNumber,
          expiryDate: data.expiryDate,
        },
        userId,
      });

      return reg;
    });
  }

  async logInsurance(
    companyId: string,
    vehicleId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const ins = await tx.insuranceLog.create({
        data: {
          companyId,
          vehicleId,
          provider: data.provider,
          policyNumber: data.policyNumber,
          coverageType: data.coverageType,
          premiumAmount: data.premiumAmount,
          issueDate: data.issueDate,
          expiryDate: data.expiryDate,
          documentUrl: data.documentUrl,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Compliance',
          entityType: 'InsuranceLog',
          entityId: ins.id,
          action: 'CREATE',
          details: {
            vehicleId,
            provider: data.provider,
            policyNumber: data.policyNumber,
          },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamId: vehicleId,
        streamType: 'VEHICLE',
        eventType: 'VehicleInsuranceLogged',
        payload: {
          provider: data.provider,
          policyNumber: data.policyNumber,
          expiryDate: data.expiryDate,
        },
        userId,
      });

      return ins;
    });
  }
}
