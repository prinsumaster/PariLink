import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreateSignatureRequestDto,
  SignDocumentDto,
} from '../dto/document.dto';
import * as crypto from 'crypto';

@Injectable()
export class DocumentSignatureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async requestSignature(
    companyId: string,
    documentId: string,
    userId: string,
    dto: CreateSignatureRequestDto,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    const signatureRequest = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.documentSignature.create({
          data: {
            documentId,
            companyId,
            signerEmail: dto.signerEmail,
            signerName: dto.signerName,
            signerId: dto.signerId || null,
            status: 'PENDING',
          },
        }),
    );

    await this.audit.logEvent({
      action: 'document:signature:request',
      entity: 'DocumentSignature',
      entityId: signatureRequest.id,
      userId,
      companyId,
      details: {
        documentId,
        signerEmail: dto.signerEmail,
        signerName: dto.signerName,
      },
    });

    return signatureRequest;
  }

  async getDocumentSignatures(companyId: string, documentId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.findMany({
        where: { companyId, documentId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async signDocument(
    companyId: string,
    signatureId: string,
    dto: SignDocumentDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const sig = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.findUnique({ where: { id: signatureId } }),
    );
    if (!sig || sig.companyId !== companyId) {
      throw new NotFoundException('Signature request not found');
    }

    if (sig.status === 'SIGNED') {
      throw new BadRequestException(
        'This document has already been signed by this party',
      );
    }

    if (sig.status === 'REJECTED') {
      throw new BadRequestException('This signature request was rejected');
    }

    const signedAt = new Date();
    const documentHash =
      dto.documentHash ||
      crypto
        .createHash('sha256')
        .update(sig.documentId + signedAt.toISOString())
        .digest('hex');

    const updatedSig = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.update({
        where: { id: signatureId },
        data: {
          status: 'SIGNED',
          signatureUrl: dto.signatureUrl,
          ipAddress,
          userAgent,
          documentHash,
          signedAt,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:signature:complete',
      entity: 'DocumentSignature',
      entityId: signatureId,
      userId: sig.signerId || undefined,
      companyId,
      details: {
        documentId: sig.documentId,
        signerEmail: sig.signerEmail,
        ipAddress,
        documentHash,
      },
    });

    return updatedSig;
  }

  async rejectSignature(
    companyId: string,
    signatureId: string,
    reason?: string,
  ) {
    const sig = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.findUnique({ where: { id: signatureId } }),
    );
    if (!sig || sig.companyId !== companyId) {
      throw new NotFoundException('Signature request not found');
    }

    const updatedSig = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.update({
        where: { id: signatureId },
        data: { status: 'REJECTED' },
      }),
    );

    await this.audit.logEvent({
      action: 'document:signature:reject',
      entity: 'DocumentSignature',
      entityId: signatureId,
      userId: sig.signerId || undefined,
      companyId,
      details: {
        documentId: sig.documentId,
        signerEmail: sig.signerEmail,
        reason,
      },
    });

    return updatedSig;
  }

  async generateVerificationCertificate(
    companyId: string,
    signatureId: string,
  ) {
    const sig = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentSignature.findUnique({
        where: { id: signatureId },
        include: { document: true, company: { select: { name: true } } },
      }),
    );

    if (!sig || sig.companyId !== companyId) {
      throw new NotFoundException('Signature record not found');
    }

    if (sig.status !== 'SIGNED') {
      throw new BadRequestException(
        'Cannot generate verification certificate for an unsigned document',
      );
    }

    const certificateId =
      'cert_' +
      crypto
        .createHash('sha256')
        .update(sig.id + (sig.signedAt?.toISOString() || ''))
        .digest('hex')
        .substring(0, 16);

    return {
      certificateId,
      title: 'PariLink Enterprise Digital Signature Audit Certificate',
      companyName: sig.company.name,
      companyId: sig.companyId,
      document: {
        id: sig.document.id,
        fileName: sig.document.fileName,
        version: sig.document.version,
        type: sig.document.type,
      },
      signatureDetails: {
        signatureId: sig.id,
        signerName: sig.signerName,
        signerEmail: sig.signerEmail,
        status: sig.status,
        signedAt: sig.signedAt,
        ipAddress: sig.ipAddress || 'Not recorded',
        userAgent: sig.userAgent || 'Not recorded',
        cryptographicHash: sig.documentHash,
      },
      verificationStatus: 'VALID_AND_BINDING',
      issuedAt: new Date().toISOString(),
    };
  }
}
