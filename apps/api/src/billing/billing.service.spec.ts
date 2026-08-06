import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { AuditService } from '../platform/audit/audit.service';

describe('BillingService', () => {
  let service: BillingService;
  let prisma: jest.Mocked<PrismaService>;

  const mockTx = {
    load: { findFirst: jest.fn() },
    invoice: { findFirst: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
    rateCard: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
    account: { upsert: jest.fn() },
    journalEntry: { create: jest.fn() },
  };

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest.fn((companyId: string, cb: (tx: any) => any) =>
      cb(mockTx),
    ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockWorkflowService = {
      evaluateRules: jest.fn().mockResolvedValue({ triggeredActions: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WorkflowService, useValue: mockWorkflowService },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
      ],
    }).compile();
    service = module.get<BillingService>(BillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateInvoice', () => {
    it('should throw NotFoundException when load does not exist', async () => {
      mockTx.load.findFirst.mockResolvedValue(null);
      await expect(
        service.generateInvoice('company-1', { loadId: 'load-999' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when load is not DELIVERED', async () => {
      mockTx.load.findFirst.mockResolvedValue({
        id: 'load-1',
        status: 'IN_TRANSIT',
        customerId: 'customer-1',
        customer: { name: 'Test Customer' },
        rate: 1000,
      });
      await expect(
        service.generateInvoice('company-1', { loadId: 'load-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when invoice already exists', async () => {
      mockTx.load.findFirst.mockResolvedValue({
        id: 'load-1',
        status: 'DELIVERED',
        customerId: 'customer-1',
        customer: { name: 'Test Customer' },
        referenceNumber: 'REF-001',
        rate: 1000,
      });
      mockTx.invoice.findFirst.mockResolvedValue({ id: 'existing-invoice' });
      await expect(
        service.generateInvoice('company-1', { loadId: 'load-1' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create invoice with load rate when no manual amount or rate card', async () => {
      const mockLoad = {
        id: 'load-1',
        status: 'DELIVERED',
        customerId: 'customer-1',
        customer: { name: 'Test Customer' },
        referenceNumber: 'REF-001',
        rate: 1500,
      };
      mockTx.load.findFirst.mockResolvedValue(mockLoad);
      mockTx.invoice.findFirst.mockResolvedValue(null);
      mockTx.invoice.create.mockResolvedValue({
        id: 'new-invoice',
        amount: 1500,
        lineItems: [],
      });

      const result = await service.generateInvoice('company-1', {
        loadId: 'load-1',
      });

      expect(result).toBeDefined();
      expect(mockTx.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            amount: 1500,
            status: 'DRAFT',
            companyId: 'company-1',
          }),
        }),
      );
    });

    it('should use manual amount when provided', async () => {
      const mockLoad = {
        id: 'load-1',
        status: 'DELIVERED',
        customerId: 'customer-1',
        customer: { name: 'Test Customer' },
        referenceNumber: 'REF-001',
        rate: 1500,
      };
      mockTx.load.findFirst.mockResolvedValue(mockLoad);
      mockTx.invoice.findFirst.mockResolvedValue(null);
      mockTx.invoice.create.mockResolvedValue({
        id: 'new-invoice',
        amount: 2500,
        lineItems: [],
      });

      await service.generateInvoice('company-1', {
        loadId: 'load-1',
        manualAmount: 2500,
      });

      expect(mockTx.invoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 2500 }),
        }),
      );
    });
  });

  describe('approveInvoice', () => {
    it('should throw NotFoundException when invoice does not exist', async () => {
      mockTx.invoice.findFirst.mockResolvedValue(null);
      await expect(
        service.approveInvoice('company-1', 'invoice-999'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when invoice is not DRAFT', async () => {
      mockTx.invoice.findFirst.mockResolvedValue({
        id: 'invoice-1',
        status: 'SENT',
        companyId: 'company-1',
        customer: { name: 'Test' },
        amount: 1000,
        invoiceNumber: 'INV-001',
      });
      await expect(
        service.approveInvoice('company-1', 'invoice-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should approve a DRAFT invoice and post a journal entry', async () => {
      const mockInvoice = {
        id: 'invoice-1',
        status: 'DRAFT',
        companyId: 'company-1',
        customer: { name: 'Test Customer' },
        amount: 1000,
        invoiceNumber: 'INV-001',
      };
      mockTx.invoice.findFirst.mockResolvedValue(mockInvoice);
      mockTx.invoice.updateMany.mockResolvedValue({ count: 1 });
      mockTx.account.upsert.mockResolvedValue({ id: 'account-1' });
      mockTx.journalEntry.create.mockResolvedValue({ id: 'je-1' });

      const result = await service.approveInvoice('company-1', 'invoice-1');

      expect(result.status).toBe('SENT');
      expect(mockTx.journalEntry.create).toHaveBeenCalledTimes(1);
      expect(mockTx.account.upsert).toHaveBeenCalledTimes(2);
    });
  });
});
