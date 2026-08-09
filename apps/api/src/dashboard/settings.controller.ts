import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('organization')
  async getOrganizationSettings(@Req() req: any) {
    const companyId = req.user.companyId;
    
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const company = await tx.company.findUnique({
        where: { id: companyId },
      });
      return company;
    });
  }
}
