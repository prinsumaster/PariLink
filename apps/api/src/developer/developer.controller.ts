import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import {
  CreateDeveloperAppDto,
  UpdateDeveloperAppDto,
} from './dto/developer.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiV2AuthGuard } from '../api-platform/v2/guards/api-v2-auth.guard';
import { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import type { Request } from 'express';

@ApiTags('Developer Portal')
@ApiBearerAuth('JWT-Auth')
@ApiSecurity('API-Key')
@UseGuards(ApiV2AuthGuard)
@Controller({ path: 'developer/apps', version: '2' })
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new Developer Application' })
  create(@Body() dto: CreateDeveloperAppDto, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.createApp(user.companyId, user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all Developer Applications' })
  findAll(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.getApps(user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a Developer Application' })
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.getApp(user.companyId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Developer Application' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDeveloperAppDto,
    @Req() req: Request,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.updateApp(
      user.companyId,
      id,
      user.userId,
      dto,
    );
  }

  @Post(':id/rotate-secret')
  @ApiOperation({ summary: 'Rotate the client secret for an Application' })
  rotateSecret(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.rotateSecret(user.companyId, id, user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Developer Application' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.developerService.deleteApp(user.companyId, id, user.userId);
  }
}
