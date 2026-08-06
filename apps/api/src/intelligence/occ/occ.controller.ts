import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { OccService } from './occ.service';

@ApiTags('intelligence/occ')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('intelligence/occ')
export class OccController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly occService: OccService,
  ) {}

  @Get('fleet-map')
  @RequirePermissions('occ:read')
  @ApiOperation({ summary: 'Get Live Fleet Map data (Twin Snapshots)' })
  async getLiveFleetMap(@GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.findMany({
        where: { companyId: user.companyId, twinType: 'VEHICLE' },
        select: {
          twinId: true,
          version: true,
          state: true,
          timestamp: true,
        },
      }),
    );
  }

  @Get('timeline/:twinId')
  @RequirePermissions('occ:read')
  @ApiOperation({ summary: 'Get the exact event sequence that formed a twin' })
  async getTwinTimeline(
    @GetUser() user: AuthenticatedUser,
    @Param('twinId') twinId: string,
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.domainEvent.findMany({
        where: { companyId: user.companyId, streamId: twinId },
        orderBy: { version: 'desc' },
        take: 50,
      }),
    );
  }

  @Get('fleet-tree')
  @RequirePermissions('occ:read')
  @ApiOperation({ summary: 'Get hierarchical fleet tree data' })
  async getFleetTree(@GetUser() user: AuthenticatedUser) {
    return this.occService.getFleetTree(user.companyId);
  }

  @Get('anomalies')
  @RequirePermissions('occ:read')
  @ApiOperation({ summary: 'Get active operational anomalies' })
  async getAnomalies(@GetUser() user: AuthenticatedUser) {
    return this.occService.getAnomalies(user.companyId);
  }

  @Get('timeline')
  @RequirePermissions('occ:read')
  @ApiOperation({ summary: 'Get global operations timeline' })
  async getGlobalTimeline(@GetUser() user: AuthenticatedUser) {
    return this.occService.getTimeline(user.companyId);
  }
}
