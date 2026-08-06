import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { DocumentFolderService } from './services/document-folder.service';
import { DocumentVersionService } from './services/document-version.service';
import { DocumentSignatureService } from './services/document-signature.service';
import { DocumentComplianceService } from './services/document-compliance.service';
import { DocumentAiService } from './services/document-ai.service';
import { EntityComplianceStatus } from './dto/document.dto';

describe('Enterprise Document Management & Compliance Services', () => {
  let folderService: DocumentFolderService;
  let versionService: DocumentVersionService;
  let signatureService: DocumentSignatureService;
  let complianceService: DocumentComplianceService;
  let aiService: DocumentAiService;

  const mockPrisma: any = {
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => await cb(mockPrisma)),
    documentFolder: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'f-1',
        companyId: 'comp-1',
        name: 'Root Folder',
        parentId: null,
        subFolders: [],
        documents: [],
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'f-1',
          companyId: 'comp-1',
          name: 'Root Folder',
          parentId: null,
        },
      ]),
      create: jest.fn().mockResolvedValue({
        id: 'f-1',
        companyId: 'comp-1',
        name: 'New Folder',
        parentId: null,
      }),
      update: jest
        .fn()
        .mockResolvedValue({ id: 'f-1', name: 'Renamed Folder' }),
      delete: jest.fn().mockResolvedValue({ id: 'f-1' }),
    },
    document: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'doc-1',
        companyId: 'comp-1',
        type: 'BILL_OF_LADING',
        fileUrl: '/uploads/test.pdf',
        fileName: 'test.pdf',
        version: 1,
        isLocked: false,
        lockedById: null,
        expiresAt: new Date(Date.now() + 864000000), // 10 days in future
        status: 'ACTIVE',
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'doc-1',
          companyId: 'comp-1',
          type: 'BILL_OF_LADING',
          expiresAt: new Date(Date.now() + 864000000),
        },
      ]),
      create: jest.fn().mockResolvedValue({ id: 'doc-1' }),
      update: jest.fn().mockResolvedValue({ id: 'doc-1', isLocked: true }),
    },
    documentVersion: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'v-1',
          documentId: 'doc-1',
          version: 1,
          fileUrl: '/uploads/old.pdf',
        },
      ]),
      findFirst: jest.fn().mockResolvedValue({
        id: 'v-1',
        documentId: 'doc-1',
        version: 1,
        fileUrl: '/uploads/old.pdf',
      }),
      create: jest.fn().mockResolvedValue({ id: 'v-1' }),
    },
    documentSignature: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'sig-1',
        documentId: 'doc-1',
        companyId: 'comp-1',
        signerEmail: 'test@parilink.com',
        signerName: 'Test Signer',
        status: 'PENDING',
        document: {
          id: 'doc-1',
          fileName: 'test.pdf',
          version: 1,
          type: 'POD',
        },
        company: { name: 'PariLink Logistics' },
      }),
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'sig-1', status: 'PENDING' }]),
      create: jest.fn().mockResolvedValue({ id: 'sig-1', status: 'PENDING' }),
      update: jest.fn().mockResolvedValue({ id: 'sig-1', status: 'SIGNED' }),
    },
    complianceRequirement: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'req-1',
        companyId: 'comp-1',
        name: 'CDL Req',
        entityType: 'DRIVER',
        docType: 'CDL',
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'req-1',
          companyId: 'comp-1',
          name: 'CDL Req',
          entityType: 'DRIVER',
          docType: 'BILL_OF_LADING',
          isMandatory: true,
          warningDays: 30,
        },
      ]),
      create: jest.fn().mockResolvedValue({ id: 'req-1', name: 'CDL Req' }),
      delete: jest.fn().mockResolvedValue({ id: 'req-1' }),
    },
    $transaction: jest.fn((cb) => cb(mockPrisma)),
  };

  const mockAudit: any = {
    logEvent: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentFolderService,
        DocumentVersionService,
        DocumentSignatureService,
        DocumentComplianceService,
        DocumentAiService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    folderService = module.get<DocumentFolderService>(DocumentFolderService);
    versionService = module.get<DocumentVersionService>(DocumentVersionService);
    signatureService = module.get<DocumentSignatureService>(
      DocumentSignatureService,
    );
    complianceService = module.get<DocumentComplianceService>(
      DocumentComplianceService,
    );
    aiService = module.get<DocumentAiService>(DocumentAiService);
  });

  it('should be defined', () => {
    expect(folderService).toBeDefined();
    expect(versionService).toBeDefined();
    expect(signatureService).toBeDefined();
    expect(complianceService).toBeDefined();
    expect(aiService).toBeDefined();
  });

  describe('DocumentFolderService', () => {
    it('should create and list folders', async () => {
      const folder = await folderService.createFolder('comp-1', 'usr-1', {
        name: 'New Folder',
      });
      expect(folder.name).toBe('New Folder');
      const tree = await folderService.getFolderTree('comp-1');
      expect(tree).toHaveLength(1);
    });
  });

  describe('DocumentVersionService', () => {
    it('should checkout a document for editing', async () => {
      const doc = await versionService.checkout('comp-1', 'doc-1', 'usr-1', {
        lockReason: 'Edit',
      });
      expect(doc.isLocked).toBe(true);
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });

    it('should get version history', async () => {
      const history = await versionService.getVersionHistory('comp-1', 'doc-1');
      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[0].isCurrent).toBe(true);
    });
  });

  describe('DocumentSignatureService', () => {
    it('should create signature request and sign document', async () => {
      const req = await signatureService.requestSignature(
        'comp-1',
        'doc-1',
        'usr-1',
        {
          signerEmail: 'test@parilink.com',
          signerName: 'Test Signer',
        },
      );
      expect(req.status).toBe('PENDING');

      const signed = await signatureService.signDocument(
        'comp-1',
        'sig-1',
        { signatureUrl: 'data:img' },
        '1.2.3.4',
        'Mozilla/5.0',
      );
      expect(signed.status).toBe('SIGNED');
    });

    it('should generate digital verification certificate for signed docs', async () => {
      mockPrisma.documentSignature.findUnique.mockResolvedValueOnce({
        id: 'sig-1',
        documentId: 'doc-1',
        companyId: 'comp-1',
        signerEmail: 'test@parilink.com',
        signerName: 'Test Signer',
        status: 'SIGNED',
        signedAt: new Date(),
        documentHash: 'hash-123',
        document: {
          id: 'doc-1',
          fileName: 'test.pdf',
          version: 1,
          type: 'POD',
        },
        company: { name: 'PariLink Logistics' },
      });
      const cert = await signatureService.generateVerificationCertificate(
        'comp-1',
        'sig-1',
      );
      expect(cert.verificationStatus).toBe('VALID_AND_BINDING');
      expect(cert.certificateId).toBeDefined();
    });
  });

  describe('DocumentComplianceService', () => {
    it('should evaluate entity compliance status', async () => {
      const evalResult = await complianceService.evaluateEntityCompliance(
        'comp-1',
        'DRIVER',
        'drv-1',
      );
      expect(evalResult.overallStatus).toBe(
        EntityComplianceStatus.EXPIRING_SOON,
      );
    });

    it('should scan expiring and expired documents', async () => {
      const scan = await complianceService.scanExpiringDocuments('comp-1');
      expect(scan.expiringCount).toBe(1);
    });
  });

  describe('DocumentAiService', () => {
    it('should classify OCR text and extract metadata', async () => {
      const result = await aiService.classifyAndExtractMetadata(
        'comp-1',
        'doc-1',
        'usr-1',
        {
          ocrText:
            'BILL OF LADING LOAD # LD-5520 WEIGHT 44000 LBS DATE: 2026-07-27',
        },
      );
      expect(result.detectedType).toBe('BILL_OF_LADING');
      expect(result.extractedMetadata.loadNumber).toBe('LD-5520');
      expect(result.extractedMetadata.weight).toBe(44000);
    });
  });
});
