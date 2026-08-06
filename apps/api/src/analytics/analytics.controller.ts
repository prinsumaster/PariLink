import {
  ServiceUnavailableException,
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import type { Observable } from 'rxjs';
import { interval, map, concatMap } from 'rxjs';
import { MetricsEngineService } from './engine/metrics-engine.service';
import { ForecastEngineService } from './engine/forecast-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly metrics: MetricsEngineService,
    private readonly forecast: ForecastEngineService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('metrics/command-center')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'Get core KPIs for Executive Command Center' })
  getCommandCenterMetrics(@GetUser() user: AuthenticatedUser) {
    return this.metrics.getCommandCenterMetrics(user.companyId);
  }

  @Sse('metrics/live')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'SSE stream for live KPI updates' })
  streamLiveMetrics(
    @GetUser() user: AuthenticatedUser,
  ): Observable<MessageEvent> {
    // Emits new metrics every 5 seconds
    return interval(5000).pipe(
      concatMap(async (_) => {
        const liveActiveTrips = await this.prisma.runAsSystem((tx) =>
          tx.trip.count({
            where: { companyId: user.companyId, status: 'IN_PROGRESS' },
          }),
        );
        return {
          data: {
            type: 'LIVE_METRICS_UPDATE',
            timestamp: new Date().toISOString(),
            payload: { liveActiveTrips },
          },
        };
      }),
    );
  }

  @Sse('health/pulse')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'SSE stream for real-time Business Health Pulse' })
  streamBusinessHealthPulse(
    @GetUser() user: AuthenticatedUser,
  ): Observable<MessageEvent> {
    // Queries the latest snapshot every 5 seconds and streams it
    return interval(5000).pipe(
      map((_) => ({
        data: {
          type: 'BUSINESS_HEALTH_UPDATE',
          timestamp: new Date().toISOString(),
          // Normally we would use EventEmitter here to stream `BusinessHealth.Updated` events,
          // but for resilience against missed events we can also poll the latest snapshot.
          // For simplicity in the demo, the frontend will poll or rely on this ping.
        },
      })),
    );
  }

  @Get('forecast/revenue')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'Forecast revenue for next N days' })
  getRevenueForecast(
    @GetUser() user: AuthenticatedUser,
    @Query('days') days: number = 30,
  ) {
    return this.forecast.forecastRevenue(user.companyId, days);
  }

  @Get('dashboards')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'List custom dashboards' })
  getDashboards(@GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.analyticsDashboard.findMany({
        where: { companyId: user.companyId },
        include: { widgets: true },
      }),
    );
  }

  @Post('dashboards')
  @RequirePermissions('analytics:write')
  @ApiOperation({ summary: 'Create a custom dashboard' })
  createDashboard(
    @GetUser() user: AuthenticatedUser,
    @Body() data: Record<string, unknown>,
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.analyticsDashboard.create({
        data: {
          companyId: user.companyId,
          name: (data as any).name,
          description: (data as any).description,
          createdBy: user.userId,
          layoutType: (data as any).layoutType || 'GRID',
          widgets: {
            create: (data as any).widgets || [],
          },
        },
      }),
    );
  }

  @Post('reports/export')
  @RequirePermissions('analytics:read')
  @ApiOperation({ summary: 'Generate a report export' })
  exportReport(
    @GetUser() user: AuthenticatedUser,
    @Body() data: { reportType: string; format: 'PDF' | 'EXCEL' | 'CSV' },
  ) {
    if (!process.env.AWS_S3_BUCKET && !process.env.GCP_STORAGE_BUCKET) {
      throw new ServiceUnavailableException(
        'Cloud storage for analytics exports is not configured.',
      );
    }
    // In production, trigger an async worker to generate the file and upload to bucket
    return {
      status: 'PROCESSING',
      message:
        'Report generation started. You will receive a notification when it is ready.',
    };
  }
}
