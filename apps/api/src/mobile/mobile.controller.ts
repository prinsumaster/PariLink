import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { MobileService } from './mobile.service';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { UpdateLoadStatusDto } from './dto/update-load-status.dto';
import { LocationPingDto } from './dto/location-ping.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PlatformFileInterceptor } from '../platform/files/file.interceptor';
import { extname } from 'path';

@ApiTags('mobile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('mobile')
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Get('trips/active')
  @RequirePermissions('mobile:access')
  @ApiOperation({ summary: 'Get current active trip for logged-in driver' })
  getActiveTrip(@GetUser() user: AuthenticatedUser) {
    return this.mobileService.getActiveTrip(user.companyId, user.userId);
  }

  @Patch('trips/:id/status')
  @RequirePermissions('mobile:access')
  @ApiOperation({ summary: 'Update trip status' })
  updateTripStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateTripStatusDto,
  ) {
    return this.mobileService.updateTripStatus(
      user.companyId,
      user.userId,
      id,
      dto,
    );
  }

  @Patch('loads/:id/status')
  @RequirePermissions('mobile:access')
  @ApiOperation({ summary: 'Update individual load status' })
  updateLoadStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLoadStatusDto,
  ) {
    return this.mobileService.updateLoadStatus(
      user.companyId,
      user.userId,
      id,
      dto,
    );
  }

  @Post('location')
  @RequirePermissions('mobile:access')
  @ApiOperation({ summary: 'Ping driver location for active trip' })
  recordLocation(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: LocationPingDto,
  ) {
    return this.mobileService.recordLocation(user.companyId, user.userId, dto);
  }

  @Post('sync')
  @RequirePermissions('mobile:access')
  @ApiOperation({
    summary: 'Offline sync queue processor with conflict resolution',
  })
  processOfflineQueue(
    @GetUser() user: AuthenticatedUser,
    @Body() queueData: Record<string, unknown>[],
  ) {
    return this.mobileService.processOfflineQueue(
      user.companyId,
      user.userId,
      queueData,
    );
  }

  @Post('upload/:type')
  @RequirePermissions('mobile:access')
  @ApiOperation({
    summary: 'Upload POD, Signature, Fuel Receipt, Expense Image',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        referenceId: {
          type: 'string',
          description: 'tripId or loadId depending on type',
        },
      },
    },
  })
  @PlatformFileInterceptor('file', 10)
  uploadDocument(
    @GetUser() user: AuthenticatedUser,
    @Param('type') type: string, // POD, SIGNATURE, FUEL, EXPENSE
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { referenceId?: string },
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.mobileService.uploadDocument(
      user.companyId,
      user.userId,
      type,
      file,
      body.referenceId,
    );
  }
}
