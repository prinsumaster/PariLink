import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SandboxService } from './sandbox.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Sandbox')
@ApiBearerAuth('JWT-Auth')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'sandbox', version: '2' })
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Post('generate-mock-data')
  @ApiOperation({
    summary: 'Generate demo data for the current company sandbox',
  })
  async generateMockData(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.sandboxService.generateMockData(user.companyId, user.userId);
  }
}
