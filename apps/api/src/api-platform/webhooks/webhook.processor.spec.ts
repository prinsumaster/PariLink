/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WebhookProcessor } from './webhook.processor';
import { PrismaService } from '../../prisma/prisma.service';
import { Job } from 'bullmq';
import axios from 'axios';
import * as crypto from 'crypto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WebhookProcessor', () => {
  let processor: WebhookProcessor;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookProcessor,
        {
          provide: PrismaService,
          useValue: {
            webhookDelivery: {
              create: jest.fn().mockResolvedValue({ id: 'delivery-123' }),
              update: jest.fn().mockResolvedValue({ id: 'delivery-123' }),
            },
            runAsSystem: jest.fn().mockImplementation(async function (cb) {
              return await cb(this);
            }),
          },
        },
      ],
    }).compile();

    processor = module.get<WebhookProcessor>(WebhookProcessor);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('process webhook delivery', () => {
    const jobData = {
      endpointId: 'ep-123',
      url: 'https://example.com/webhook',
      secret: 'test-secret',
      companyId: 'company-123',
      payload: {
        eventType: 'load.created',
        data: { id: 'load-123' },
      },
    };

    const mockJob = {
      name: 'deliver_webhook',
      data: jobData,
      attemptsMade: 0,
      opts: { attempts: 5 },
      updateData: jest.fn(),
    } as unknown as Job;

    it('should calculate correct HMAC SHA256 signature', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: { ok: true },
      });

      await processor.process(mockJob);

      const expectedSignature = crypto
        .createHmac('sha256', jobData.secret)
        .update(JSON.stringify(jobData.payload))
        .digest('hex');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        jobData.url,
        jobData.payload,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-PariLink-Signature': expectedSignature,
          }),
        }),
      );
    });

    it('should transition to DEAD_LETTER on final attempt failure', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { status: 500, data: { error: 'Internal Error' } },
      });

      const finalAttemptJob = {
        ...mockJob,
        attemptsMade: 4,
        data: { ...jobData, deliveryId: 'delivery-123' },
      } as unknown as Job;

      await processor.process(finalAttemptJob);

      expect(prisma.webhookDelivery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'delivery-123' },
          data: expect.objectContaining({
            status: 'DEAD_LETTER',
            retryCount: 5,
          }),
        }),
      );
    });

    it('should throw error on non-final attempt to trigger exponential backoff retry', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      const retryJob = {
        ...mockJob,
        attemptsMade: 1,
        data: { ...jobData, deliveryId: 'delivery-123' },
      } as unknown as Job;

      await expect(processor.process(retryJob)).rejects.toThrow(
        'Network error',
      );

      expect(prisma.webhookDelivery.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'FAILED',
          }),
        }),
      );
    });
  });
});
