import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { TemplateService } from './template.service';
import { SseService } from '../realtime/sse.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  CreateNotificationTemplateDto,
  UpdateNotificationTemplateDto,
  DispatchNotificationDto,
  NotificationPriority,
} from '../dto/notification.dto';

@Injectable()
export class NotificationOrchestratorService {
  private readonly logger = new Logger(NotificationOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly templateService: TemplateService,
    private readonly sseService: SseService,
    @InjectQueue('notification-delivery') private readonly deliveryQueue: Queue,
  ) {}

  // 1. Template Management
  async createTemplate(
    companyId: string,
    userId: string,
    dto: CreateNotificationTemplateDto,
  ) {
    const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.findFirst({
        where: { companyId, eventType: dto.eventType, channel: dto.channel },
      }),
    );
    if (existing) {
      throw new BadRequestException(
        `Template already exists for event ${dto.eventType} on channel ${dto.channel}`,
      );
    }

    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.create({
        data: {
          companyId,
          name: dto.name,
          eventType: dto.eventType,
          channel: dto.channel,
          subject: dto.subject || null,
          body: dto.body,
          isActive: dto.isActive !== undefined ? dto.isActive : true,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'notification:template:create',
      entity: 'NotificationTemplate',
      entityId: template.id,
      userId,
      companyId,
      details: {
        name: template.name,
        eventType: template.eventType,
        channel: template.channel,
      },
    });

    return template;
  }

  async getTemplates(companyId: string, eventType?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.findMany({
        where: {
          OR: [{ companyId }, { companyId: null }],
          eventType: eventType || undefined,
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async updateTemplate(
    companyId: string,
    id: string,
    userId: string,
    dto: UpdateNotificationTemplateDto,
  ) {
    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.findUnique({ where: { id } }),
    );
    if (
      !template ||
      (template.companyId !== companyId && template.companyId !== null)
    ) {
      throw new NotFoundException('Template not found');
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.update({
        where: { id },
        data: {
          name: dto.name,
          subject: dto.subject,
          body: dto.body,
          isActive: dto.isActive,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'notification:template:update',
      entity: 'NotificationTemplate',
      entityId: id,
      userId,
      companyId,
      details: { updates: dto },
    });

    return updated;
  }

  async deleteTemplate(companyId: string, id: string, userId: string) {
    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.findUnique({ where: { id } }),
    );
    if (!template || template.companyId !== companyId) {
      throw new NotFoundException(
        'Template not found or global template cannot be deleted',
      );
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationTemplate.delete({ where: { id } }),
    );

    await this.audit.logEvent({
      action: 'notification:template:delete',
      entity: 'NotificationTemplate',
      entityId: id,
      userId,
      companyId,
      details: { name: template.name },
    });

    return { success: true, id };
  }

  // 2. Quiet Hours & Rate Limiting Heuristics
  private isInQuietHours(prefs: any): boolean {
    if (!prefs || !prefs.quietHoursStart || !prefs.quietHoursEnd) {
      return false;
    }

    try {
      const now = new Date();
      // Simple parse HH:mm in UTC/local
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [startH, startM] = prefs.quietHoursStart.split(':').map(Number);
      const [endH, endM] = prefs.quietHoursEnd.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes < endMinutes) {
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
      } else {
        // Crosses midnight (e.g. 22:00 to 08:00)
        return currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }
    } catch (e) {
      this.logger.warn(
        'Failed to parse quiet hours, skipping quiet hours check',
      );
      return false;
    }
  }

  private async checkRateLimit(
    userId: string,
    channel: string,
  ): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 3600000);
    const count = await this.prisma.runAsSystem(async (tx) =>
      tx.notificationDelivery.count({
        where: {
          userId,
          channel,
          createdAt: { gte: oneHourAgo },
        },
      }),
    );

    if (channel === 'SMS' && count >= 15) {
      this.logger.warn(
        `Rate limit exceeded for user ${userId} on SMS channel (${count}/hour)`,
      );
      return false; // Rate limited
    }
    if (channel === 'EMAIL' && count >= 50) {
      this.logger.warn(
        `Rate limit exceeded for user ${userId} on EMAIL channel (${count}/hour)`,
      );
      return false; // Rate limited
    }
    return true;
  }

  // 3. Multi-Channel Dispatch & Orchestration
  async dispatchNotification(
    companyId: string,
    senderId: string,
    dto: DispatchNotificationDto,
  ) {
    const targetUser = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.user.findUnique({ where: { id: dto.targetUserId } }),
    );
    if (!targetUser || targetUser.companyId !== companyId) {
      throw new NotFoundException('Target user not found in tenant');
    }

    let prefs = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.notificationPreference.findUnique({
        where: { userId: targetUser.id },
      }),
    );

    if (!prefs) {
      prefs = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationPreference.create({
          data: {
            userId: targetUser.id,
            companyId,
            channels: { email: true, inApp: true, sms: false },
          },
        }),
      );
    }

    const priority = dto.priority || NotificationPriority.NORMAL;
    const isQuiet = this.isInQuietHours(prefs);
    const shouldDeferForQuietHours =
      isQuiet &&
      priority !== NotificationPriority.URGENT &&
      priority !== NotificationPriority.HIGH;

    // Determine channels
    let targetChannels = dto.channels;
    if (!targetChannels || targetChannels.length === 0) {
      const prefChannels = prefs.channels as Record<string, boolean>;
      targetChannels = [];
      if (prefChannels?.inApp !== false) targetChannels.push('IN_APP');
      if (prefChannels?.email) targetChannels.push('EMAIL');
      if (prefChannels?.sms || priority === NotificationPriority.URGENT)
        targetChannels.push('SMS');
    }

    const results: any[] = [];
    let inAppNotificationId: string | null = null;

    // 1. IN_APP channel
    if (targetChannels.includes('IN_APP')) {
      const title = dto.title || `Notification: ${dto.eventType}`;
      const body = dto.body || `New event ${dto.eventType} occurred.`;

      const notification = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.notification.create({
            data: {
              companyId,
              userId: targetUser.id,
              type: dto.eventType,
              priority,
              title,
              body,
              entityType: dto.entityType || null,
              entityId: dto.entityId || null,
              actionUrl: dto.actionUrl || null,
            },
          }),
      );
      inAppNotificationId = notification.id;

      if (!shouldDeferForQuietHours) {
        this.sseService.emitToUser(targetUser.id, {
          type: 'NEW_NOTIFICATION',
          notification,
        });
      }

      results.push({
        channel: 'IN_APP',
        status: 'DELIVERED',
        id: notification.id,
      });
    }

    // 2. External Channels (EMAIL, SMS, SLACK)
    for (const channel of targetChannels) {
      if (channel === 'IN_APP') continue;

      const rateLimitOk = await this.checkRateLimit(targetUser.id, channel);
      if (!rateLimitOk) {
        results.push({ channel, status: 'SKIPPED_RATE_LIMIT' });
        continue;
      }

      // Check for template
      const template = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationTemplate.findFirst({
          where: {
            OR: [{ companyId }, { companyId: null }],
            eventType: dto.eventType,
            channel,
            isActive: true,
          },
        }),
      );

      let subject = dto.title || `Alert: ${dto.eventType}`;
      let body = dto.body || `An event ${dto.eventType} occurred in PariLink.`;

      if (template) {
        if (template.subject)
          subject = this.templateService.render(
            template.subject,
            dto.templateData || {},
          );
        body = this.templateService.render(
          template.body,
          dto.templateData || {},
        );
      }

      const recipient =
        channel === 'EMAIL'
          ? targetUser.email
          : (targetUser as any).phoneNumber || targetUser.email;
      const status = shouldDeferForQuietHours ? 'PENDING' : 'PENDING'; // BullMQ will pick up PENDING

      const delivery = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.create({
          data: {
            companyId,
            userId: targetUser.id,
            recipient,
            channel,
            eventType: dto.eventType,
            payload: { subject, body, priority, actionUrl: dto.actionUrl },
            status,
          },
        }),
      );

      if (!shouldDeferForQuietHours) {
        await this.deliveryQueue
          .add(
            'deliver-notification',
            { deliveryId: delivery.id },
            {
              attempts: 3,
              backoff: { type: 'exponential', delay: 2000 },
              priority: priority === NotificationPriority.URGENT ? 1 : 5,
            },
          )
          .catch((err) => {
            this.logger.error(
              `Failed to queue BullMQ job for delivery ${delivery.id}: ${err.message}`,
            );
          });
      }

      results.push({
        channel,
        deliveryId: delivery.id,
        status: shouldDeferForQuietHours ? 'DEFERRED_QUIET_HOURS' : 'QUEUED',
      });
    }

    await this.audit.logEvent({
      action: 'notification:dispatch',
      entity: 'Notification',
      entityId: inAppNotificationId || targetUser.id,
      userId: senderId,
      companyId,
      details: {
        targetUserId: targetUser.id,
        eventType: dto.eventType,
        priority,
        results,
      },
    });

    return {
      success: true,
      targetUserId: targetUser.id,
      eventType: dto.eventType,
      priority,
      deferredForQuietHours: shouldDeferForQuietHours,
      results,
    };
  }

  async getDeliveryMetrics(companyId: string) {
    const [delivered, pending, failed, total] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.count({
          where: { companyId, status: 'DELIVERED' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.count({
          where: { companyId, status: 'PENDING' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.count({
          where: { companyId, status: 'FAILED' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.count({ where: { companyId } }),
      ),
    ]);

    const channelBreakdown = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.notificationDelivery.groupBy({
          by: ['channel', 'status'],
          where: { companyId },
          _count: true,
        }),
    );

    return {
      companyId,
      summary: { total, delivered, pending, failed },
      channelBreakdown: channelBreakdown.map((item) => ({
        channel: item.channel,
        status: item.status,
        count: item._count,
      })),
      timestamp: new Date().toISOString(),
    };
  }

  async retryFailedDeliveries(companyId: string, userId: string) {
    const failedDeliveries = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.notificationDelivery.findMany({
          where: { companyId, status: 'FAILED' },
          take: 100,
        }),
    );

    let requeuedCount = 0;
    for (const deliv of failedDeliveries) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.notificationDelivery.update({
          where: { id: deliv.id },
          data: { status: 'PENDING', retryCount: 0, errorMessage: null },
        }),
      );

      await this.deliveryQueue
        .add(
          'deliver-notification',
          { deliveryId: deliv.id },
          { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
        )
        .catch(() => {});
      requeuedCount++;
    }

    await this.audit.logEvent({
      action: 'notification:retry_failed',
      entity: 'NotificationDelivery',
      entityId: 'batch-retry',
      userId,
      companyId,
      details: { requeuedCount },
    });

    return { success: true, requeuedCount };
  }
}
