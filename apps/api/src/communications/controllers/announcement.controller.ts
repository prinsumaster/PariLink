import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('announcements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('announcements')
export class AnnouncementController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get active company announcements' })
  async getAnnouncements(@GetUser() user: AuthenticatedUser) {
    const announcements = await this.prisma.runAsSystem(async (tx) =>
      tx.announcement.findMany({
        where: { companyId: user.companyId, status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      }),
    );

    return { data: announcements };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new announcement' })
  async createAnnouncement(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: Record<string, unknown>,
  ) {
    // Only admins would typically do this, governed by RBAC
    const announcement = await this.prisma.runAsSystem(async (tx) =>
      tx.announcement.create({
        data: {
          companyId: user.companyId,
          title: (dto as any).title,
          content: (dto as any).content,
          status: 'PUBLISHED',
        },
      }),
    );

    return { data: announcement };
  }
}
