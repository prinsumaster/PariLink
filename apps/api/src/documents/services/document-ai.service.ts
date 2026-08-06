import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { ClassifyDocumentDto } from '../dto/document.dto';

@Injectable()
export class DocumentAiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async classifyAndExtractMetadata(
    companyId: string,
    documentId: string,
    userId: string,
    dto: ClassifyDocumentDto,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    const text = dto.ocrText.toUpperCase();
    let detectedType = doc.type;
    let confidence = 0.5;
    const extractedMetadata: Record<string, any> = {};

    // 1. Classification rules
    if (
      text.includes('BILL OF LADING') ||
      text.includes('BOL #') ||
      text.includes('B/L')
    ) {
      detectedType = 'BILL_OF_LADING';
      confidence = 0.95;
    } else if (
      text.includes('PROOF OF DELIVERY') ||
      text.includes('POD') ||
      text.includes('RECEIVED BY') ||
      text.includes('CONSIGNEE SIGNATURE')
    ) {
      detectedType = 'PROOF_OF_DELIVERY';
      confidence = 0.92;
    } else if (
      text.includes('COMMERCIAL DRIVER') ||
      text.includes('CDL') ||
      text.includes('DRIVER LICENSE') ||
      text.includes('CLASS A')
    ) {
      detectedType = 'DRIVER_LICENSE';
      confidence = 0.94;
    } else if (
      text.includes('CERTIFICATE OF LIABILITY INSURANCE') ||
      text.includes('ACORD') ||
      text.includes('INSURED') ||
      text.includes('POLICY NUMBER')
    ) {
      detectedType = 'INSURANCE_COI';
      confidence = 0.96;
    } else if (
      text.includes('RATE CONFIRMATION') ||
      text.includes('RATE CONF') ||
      text.includes('CARRIER PAY')
    ) {
      detectedType = 'RATE_CONFIRMATION';
      confidence = 0.9;
    } else if (
      text.includes('INVOICE') ||
      text.includes('AMOUNT DUE') ||
      text.includes('REMIT TO')
    ) {
      detectedType = 'INVOICE';
      confidence = 0.89;
    }

    // 2. Metadata extraction heuristics
    const loadMatch = text.match(
      /(?:LOAD|LD|TRIP|ORDER|BOL)\s*[#:]?\s*([A-Z0-9-]{4,15})/i,
    );
    if (loadMatch && loadMatch[1]) {
      extractedMetadata.loadNumber = loadMatch[1];
    }

    const weightMatch = text.match(/([0-9,]+)\s*(?:LBS|POUNDS|KG)/i);
    if (weightMatch && weightMatch[1]) {
      extractedMetadata.weight = parseInt(weightMatch[1].replace(/,/g, ''), 10);
    }

    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/);
    if (dateMatch && dateMatch[1]) {
      extractedMetadata.documentDate = dateMatch[1];
    }

    const amountMatch = text.match(
      /(?:\$|USD|TOTAL|AMOUNT)\s*([0-9,]+\.\d{2})/i,
    );
    if (amountMatch && amountMatch[1]) {
      extractedMetadata.totalAmount = parseFloat(
        amountMatch[1].replace(/,/g, ''),
      );
    }

    const policyMatch = text.match(
      /(?:POLICY|POL)\s*[#:]?\s*([A-Z0-9-]{6,20})/i,
    );
    if (policyMatch && policyMatch[1]) {
      extractedMetadata.policyNumber = policyMatch[1];
    }

    // Auto-filing folder matching
    let autoFolderId = doc.folderId;
    if (!autoFolderId) {
      const folders = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.documentFolder.findMany({ where: { companyId } }),
      );
      const matchingFolder = folders.find((f) =>
        f.name.toUpperCase().includes(detectedType.replace(/_/g, ' ')),
      );
      if (matchingFolder) {
        autoFolderId = matchingFolder.id;
      }
    }

    const updatedDoc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.update({
        where: { id: documentId },
        data: {
          type: detectedType,
          folderId: autoFolderId,
          metadata: {
            ...(typeof doc.metadata === 'object' && doc.metadata !== null
              ? doc.metadata
              : {}),
            ...extractedMetadata,
            aiClassification: {
              detectedType,
              confidence,
              processedAt: new Date().toISOString(),
            },
          },
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:ai:classify',
      entity: 'Document',
      entityId: documentId,
      userId,
      companyId,
      details: { detectedType, confidence, extractedMetadata, autoFolderId },
    });

    return {
      documentId: doc.id,
      originalType: doc.type,
      detectedType,
      confidence,
      extractedMetadata,
      autoFiledFolderId: autoFolderId,
      updatedDocument: updatedDoc,
    };
  }
}
