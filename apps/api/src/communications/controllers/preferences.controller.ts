import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('preferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('preferences/notifications')
export class PreferencesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notification preferences' })
  async getPreferences(@GetUser() user: AuthenticatedUser) {
    let prefs = await this.prisma.runAsSystem(async (tx) =>
      tx.notificationPreference.findUnique({
        where: { userId: user.id },
      }),
    );

    if (!prefs) {
      prefs = await this.prisma.runAsSystem(async (tx) =>
        tx.notificationPreference.create({
          data: {
            userId: user.id,
            companyId: user.companyId,
            channels: { email: true, inApp: true, sms: false },
          },
        }),
      );
    }

    return { data: prefs };
  }

  @Put()
  @ApiOperation({ summary: 'Update user notification preferences' })
  async updatePreferences(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: Record<string, unknown>,
  ) {
    const prefs = await this.prisma.runAsSystem(async (tx) =>
      tx.notificationPreference.update({
        where: { userId: user.id },
        data: {
          channels: (dto as any).channels,
          quietHoursStart: (dto as any).quietHoursStart,
          quietHoursEnd: (dto as any).quietHoursEnd,
        },
      }),
    );

    return { data: prefs };
  }
}
