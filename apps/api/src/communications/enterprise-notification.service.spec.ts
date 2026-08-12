import { EventStoreService } from '../platform/digital-twin/event-store.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { TemplateService } from './engine/template.service';
import { SseService } from './realtime/sse.service';
import { NotificationOrchestratorService } from './engine/notification-orchestrator.service';
import { NotificationPriority } from './dto/notification.dto';

describe('Enterprise Notification Orchestrator Service', () => {
  let orchestrator: NotificationOrchestratorService;
  let templateService: TemplateService;

  const mockQueue: any = {
    add: jest.fn().mockResolvedValue({ id: 'job-1' }),
    addBulk: jest.fn().mockResolvedValue([{ id: 'job-1' }]),
  };

  const mockPrisma: any = {
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => await cb(mockPrisma)),
    runAsSystem: jest
      .fn()
      .mockImplementation(async (cb) => await cb(mockPrisma)),
    notificationTemplate: {
      findFirst: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'tpl-1',
          name: 'Test Tpl',
          eventType: 'test.evt',
          channel: 'EMAIL',
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'tpl-1',
        companyId: 'comp-1',
        name: 'Test Tpl',
        eventType: 'test.evt',
        channel: 'EMAIL',
        subject: 'Hello {{name}}',
        body: 'Body {{val}}',
      }),
      create: jest.fn().mockResolvedValue({
        id: 'tpl-1',
        name: 'New Tpl',
        eventType: 'test.evt',
        channel: 'EMAIL',
      }),
      update: jest.fn().mockResolvedValue({ id: 'tpl-1', name: 'Updated Tpl' }),
      delete: jest.fn().mockResolvedValue({ id: 'tpl-1' }),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'usr-1',
        companyId: 'comp-1',
        email: 'user@parilink.com',
        phoneNumber: '+15550001111',
      }),
    },
    notificationPreference: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'pref-1',
        userId: 'usr-1',
        companyId: 'comp-1',
        channels: { email: true, inApp: true, sms: false },
      }),
      create: jest.fn().mockResolvedValue({
        id: 'pref-1',
        userId: 'usr-1',
        companyId: 'comp-1',
        channels: { email: true, inApp: true, sms: false },
      }),
    },
    notification: {
      create: jest
        .fn()
        .mockResolvedValue({ id: 'notif-1', title: 'Test', body: 'Body' }),
    },
    notificationDelivery: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      count: jest.fn().mockResolvedValue(2), // Below rate limit
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'deliv-1', status: 'FAILED' }]),
      create: jest.fn().mockResolvedValue({
        id: 'deliv-1',
        status: 'PENDING',
        channel: 'EMAIL',
      }),
      update: jest.fn().mockResolvedValue({ id: 'deliv-1', status: 'PENDING' }),
      groupBy: jest
        .fn()
        .mockResolvedValue([
          { channel: 'EMAIL', status: 'DELIVERED', _count: 10 },
        ]),
    },
  };

  const mockAudit: any = {
    logEvent: jest.fn().mockResolvedValue({}),
  };

  const mockSse: any = {
    emitToUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: EventStoreService, useValue: { append: jest.fn() } },
        NotificationOrchestratorService,
        TemplateService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
        { provide: SseService, useValue: mockSse },
        { provide: 'BullQueue_notification-delivery', useValue: mockQueue },
      ],
    }).compile();

    orchestrator = module.get<NotificationOrchestratorService>(
      NotificationOrchestratorService,
    );
    templateService = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(orchestrator).toBeDefined();
    expect(templateService).toBeDefined();
  });

  describe('Template Management', () => {
    it('should create a notification template', async () => {
      const res = await orchestrator.createTemplate('comp-1', 'usr-1', {
        name: 'New Tpl',
        eventType: 'test.evt',
        channel: 'EMAIL',
        body: 'Hello',
      });
      expect(res.name).toBe('New Tpl');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });

    it('should get templates', async () => {
      const tpls = await orchestrator.getTemplates('comp-1');
      expect(tpls).toHaveLength(1);
    });
  });

  describe('Multi-Channel Dispatch & Rate Limiting', () => {
    it('should dispatch notification to target user across enabled channels', async () => {
      mockPrisma.notificationTemplate.findFirst.mockResolvedValueOnce({
        id: 'tpl-1',
        subject: 'Alert {{driver}}',
        body: 'Load {{loadNumber}} ready',
        isActive: true,
      });

      const res = await orchestrator.dispatchNotification('comp-1', 'admin-1', {
        targetUserId: 'usr-1',
        eventType: 'load.ready',
        priority: NotificationPriority.HIGH,
        templateData: { driver: 'John', loadNumber: 'LD-100' },
      });

      expect(res.success).toBe(true);
      expect(res.results.length).toBeGreaterThanOrEqual(1);
      expect(mockSse.emitToUser).toHaveBeenCalled();
    });
  });

  describe('Metrics & Resilience', () => {
    it('should get delivery metrics breakdown', async () => {
      const metrics = await orchestrator.getDeliveryMetrics('comp-1');
      expect(metrics.summary.delivered).toBeDefined();
      expect(metrics.channelBreakdown).toHaveLength(1);
    });

    it('should retry failed notification deliveries', async () => {
      const retry = await orchestrator.retryFailedDeliveries(
        'comp-1',
        'admin-1',
      );
      expect(retry.requeuedCount).toBe(1);
      expect(mockQueue.add).toHaveBeenCalled();
    });
  });
});
