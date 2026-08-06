import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreateComplianceRequirementDto,
  EntityComplianceStatus,
} from '../dto/document.dto';

@Injectable()
export class DocumentComplianceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createRequirement(
    companyId: string,
    userId: string,
    dto: CreateComplianceRequirementDto,
  ) {
    const req = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.complianceRequirement.create({
        data: {
          companyId,
          entityType: dto.entityType,
          docType: dto.docType,
          name: dto.name,
          description: dto.description || null,
          isMandatory: dto.isMandatory !== undefined ? dto.isMandatory : true,
          validityDays: dto.validityDays || null,
          warningDays: dto.warningDays || 30,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:compliance_req:create',
      entity: 'ComplianceRequirement',
      entityId: req.id,
      userId,
      companyId,
      details: {
        entityType: req.entityType,
        docType: req.docType,
        name: req.name,
      },
    });

    return req;
  }

  async getRequirements(companyId: string, entityType?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.complianceRequirement.findMany({
        where: {
          companyId,
          entityType: entityType || undefined,
        },
        orderBy: { entityType: 'asc' },
      }),
    );
  }

  async deleteRequirement(companyId: string, id: string, userId: string) {
    const req = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.complianceRequirement.findUnique({ where: { id } }),
    );
    if (!req || req.companyId !== companyId) {
      throw new NotFoundException('Compliance requirement not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.complianceRequirement.delete({ where: { id } }),
    );

    await this.audit.logEvent({
      action: 'document:compliance_req:delete',
      entity: 'ComplianceRequirement',
      entityId: id,
      userId,
      companyId,
      details: { name: req.name },
    });

    return { success: true, id };
  }

  async evaluateEntityCompliance(
    companyId: string,
    entityType: string,
    entityId: string,
  ) {
    const requirements = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.complianceRequirement.findMany({
        where: { companyId, entityType },
      }),
    );

    const documents = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findMany({
        where: {
          companyId,
          entityType,
          entityId,
          status: 'ACTIVE',
        },
        orderBy: { createdAt: 'desc' },
      }),
    );

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const docMap = new Map<string, any>();
    documents.forEach((doc) => {
      if (!docMap.has(doc.type)) {
        docMap.set(doc.type, doc);
      }
    });

    const evaluations: any[] = [];
    let hasExpiredOrMissingMandatory = false;
    let hasExpiringSoon = false;

    for (const req of requirements) {
      const doc = docMap.get(req.docType);
      let status = EntityComplianceStatus.COMPLIANT;
      let reason = 'Valid document on file';
      let expiresAt: Date | null = null;

      if (!doc) {
        if (req.isMandatory) {
          status = EntityComplianceStatus.NON_COMPLIANT;
          reason = 'Mandatory document missing';
          hasExpiredOrMissingMandatory = true;
        } else {
          status = EntityComplianceStatus.COMPLIANT;
          reason = 'Optional document not provided';
        }
      } else {
        expiresAt = doc.expiresAt;
        if (doc.expiresAt) {
          const expDate = new Date(doc.expiresAt);
          if (expDate <= now) {
            status = EntityComplianceStatus.NON_COMPLIANT;
            reason = 'Document has expired';
            if (req.isMandatory) hasExpiredOrMissingMandatory = true;
          } else {
            const warningDate = new Date();
            warningDate.setDate(now.getDate() + req.warningDays);
            if (expDate <= warningDate) {
              status = EntityComplianceStatus.EXPIRING_SOON;
              reason = `Document expires in less than ${req.warningDays} days`;
              hasExpiringSoon = true;
            }
          }
        }
      }

      evaluations.push({
        requirementId: req.id,
        docType: req.docType,
        requirementName: req.name,
        isMandatory: req.isMandatory,
        documentId: doc ? doc.id : null,
        expiresAt,
        status,
        reason,
      });
    }

    let overallStatus = EntityComplianceStatus.COMPLIANT;
    if (hasExpiredOrMissingMandatory) {
      overallStatus = EntityComplianceStatus.NON_COMPLIANT;
    } else if (hasExpiringSoon) {
      overallStatus = EntityComplianceStatus.EXPIRING_SOON;
    }

    return {
      companyId,
      entityType,
      entityId,
      overallStatus,
      evaluatedAt: now.toISOString(),
      requirementsCount: requirements.length,
      evaluations,
    };
  }

  async scanExpiringDocuments(companyId: string) {
    const now = new Date();
    const warningThreshold = new Date();
    warningThreshold.setDate(now.getDate() + 30);

    const expiringDocs = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findMany({
        where: {
          companyId,
          status: 'ACTIVE',
          expiresAt: {
            lte: warningThreshold,
            gte: now,
          },
        },
        include: {
          uploadedBy: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { expiresAt: 'asc' },
      }),
    );

    const expiredDocs = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findMany({
        where: {
          companyId,
          status: 'ACTIVE',
          expiresAt: {
            lt: now,
          },
        },
        include: {
          uploadedBy: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { expiresAt: 'asc' },
      }),
    );

    return {
      companyId,
      scannedAt: now.toISOString(),
      expiringCount: expiringDocs.length,
      expiredCount: expiredDocs.length,
      expiringWithin30Days: expiringDocs,
      expired: expiredDocs,
    };
  }
}
