import {
  Controller,
  Get,
  Param,
  UseGuards,
  Res,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  @Get(':tenantId/:filename')
  @ApiOperation({ summary: 'Securely download a file' })
  downloadFile(
    @GetUser() user: AuthenticatedUser,
    @Param('tenantId') tenantId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (user.companyId !== tenantId) {
      throw new UnauthorizedException('Tenant access denied');
    }

    const filePath = path.join(process.cwd(), 'uploads', tenantId, filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    res.sendFile(filePath);
  }
}
