import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  BackupRecoveryService,
  CreateBackupInput,
} from './backup-recovery.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Operations - Backup & Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/backup')
export class BackupRecoveryController {
  constructor(private readonly backupService: BackupRecoveryService) {}

  @Post('start')
  @RequirePermissions('operations:backup:write')
  @ApiOperation({
    summary:
      'Start a backup job (DATABASE, STORAGE, CONFIGURATION, FULL_SYSTEM)',
  })
  async startBackup(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Body() body: Omit<CreateBackupInput, 'companyId' | 'actorId'>,
  ) {
    return this.backupService.startBackupJob({
      ...body,
      companyId: user.companyId,
      actorId: user.userId || user.id,
    });
  }

  @Get(':id/verify')
  @RequirePermissions('operations:backup:read')
  @ApiOperation({
    summary:
      'Verify integrity of a backup archive via SHA-256 checksum validation',
  })
  async verifyBackup(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
  ) {
    return this.backupService.verifyBackupIntegrity(
      user.companyId,
      id,
      user.userId || user.id,
    );
  }

  @Post(':id/restore')
  @RequirePermissions('operations:backup:admin')
  @ApiOperation({
    summary: 'Execute Restore Wizard with optional Point-in-Time Recovery',
  })
  async restore(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
    @Body() body: { pointInTime?: string },
  ) {
    const pointInTime = body.pointInTime
      ? new Date(body.pointInTime)
      : undefined;
    return this.backupService.executeRestoreWizard(
      user.companyId,
      id,
      pointInTime,
      user.userId || user.id,
    );
  }

  @Post('purge')
  @RequirePermissions('operations:backup:admin')
  @ApiOperation({
    summary: 'Purge expired backup archives beyond retention window',
  })
  async purge() {
    return this.backupService.purgeExpiredBackups();
  }
}
