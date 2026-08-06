import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('API Lifecycle')
@Controller({ path: 'lifecycle', version: '2' })
export class LifecycleController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API Platform Health' })
  async getHealth() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Get('versions')
  @ApiOperation({ summary: 'List all supported API versions and deprecations' })
  async getVersions() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.apiVersion.findMany({
        orderBy: { releaseDate: 'desc' },
      }),
    );
  }

  // A simplified changelog retrieval
  @Get('changelog')
  @ApiOperation({ summary: 'Get latest API changelogs' })
  async getChangelogs() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.apiVersion.findMany({
        select: {
          version: true,
          changelogUrl: true,
          features: true,
          status: true,
        },
        orderBy: { releaseDate: 'desc' },
      }),
    );
  }
}
