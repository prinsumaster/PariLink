import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsObject,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// 1. Tenant Management DTOs
export class UpdateTenantBrandingDto {
  @ApiPropertyOptional() @IsString() @IsOptional() logoUrl?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() primaryColor?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() secondaryColor?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() favicon?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() appName?: string;
}

export class UpdateTenantRegionalDto {
  @ApiPropertyOptional() @IsString() @IsOptional() timezone?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() locale?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() dateFormat?: string;
}

export class UpdateTenantBusinessHoursDto {
  @ApiPropertyOptional() @IsArray() @IsOptional() workDays?: string[];
  @ApiPropertyOptional() @IsNumber() @IsOptional() startHour?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() endHour?: number;
}

export class UpdateTenantStatusDto {
  @ApiProperty({ enum: ['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'] })
  @IsString()
  @IsNotEmpty()
  status!: string;
}

// 2. Organization Management DTOs
export class CreateDepartmentDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() code?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() managerId?: string;
}

export class UpdateDepartmentDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() code?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() managerId?: string;
}

export class CreateTeamDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() departmentId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() leadId?: string;
}

export class UpdateTeamDto {
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() departmentId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() leadId?: string;
}

export class CreateCostCenterDto {
  @ApiProperty() @IsString() @IsNotEmpty() code!: string;
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() budget?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
}

export class UpdateCostCenterDto {
  @ApiPropertyOptional() @IsString() @IsOptional() code?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() name?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() budget?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
}

// 3. User Administration DTOs
export class InviteUserDto {
  @ApiProperty() @IsString() @IsNotEmpty() email!: string;
  @ApiProperty() @IsString() @IsNotEmpty() firstName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() lastName!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() roleId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() departmentId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() teamId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() costCenterId?: string;
}

export class BulkUserImportDto {
  @ApiProperty({ type: [InviteUserDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InviteUserDto)
  users!: InviteUserDto[];
}

export class UserStatusActionDto {
  @ApiPropertyOptional() @IsString() @IsOptional() reason?: string;
}

// 4. Enterprise RBAC DTOs
export class CreatePermissionGroupDto {
  @ApiProperty() @IsString() @IsNotEmpty() domain!: string;
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty({ type: [String] }) @IsArray() permissions!: string[];
}

export class CreateRoleTemplateDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty({ type: [String] }) @IsArray() permissions!: string[];
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isTemplate?: boolean;
}

export class SimulatePermissionDto {
  @ApiProperty() @IsString() @IsNotEmpty() userId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() permission!: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() context?: Record<
    string,
    any
  >;
}

// 5. Security Policies DTOs
export class UpdateSecurityPolicyDto {
  @ApiPropertyOptional() @IsNumber() @IsOptional() passwordMinLength?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() requireNumbers?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() requireSymbols?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() passwordExpiryDays?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() requireMfa?: boolean;
  @ApiPropertyOptional() @IsArray() @IsOptional() allowedMfaMethods?: string[];
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxConcurrentSessions?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() idleTimeoutMinutes?: number;
  @ApiPropertyOptional() @IsArray() @IsOptional() ipAllowList?: string[];
  @ApiPropertyOptional() @IsArray() @IsOptional() allowedCountries?: string[];
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  restrictToWorkingHours?: boolean;
}

// 6. Feature Flag Platform DTOs
export class CreateEnterpriseFlagDto {
  @ApiProperty() @IsString() @IsNotEmpty() key!: string;
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isEnabled?: boolean;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isGlobal?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() percentageRollout?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() killSwitch?: boolean;
  @ApiPropertyOptional() @IsArray() @IsOptional() targetEnvironments?: string[];
}

export class UpdateEnterpriseFlagDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isEnabled?: boolean;
  @ApiPropertyOptional() @IsNumber() @IsOptional() percentageRollout?: number;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() killSwitch?: boolean;
  @ApiPropertyOptional() @IsArray() @IsOptional() targetEnvironments?: string[];
}

// 7. License Management DTOs
export class AssignPlanDto {
  @ApiProperty() @IsString() @IsNotEmpty() subscriptionPlanId!: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() seats?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() apiRateLimit?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() storageQuotaMb?: number;
  @ApiPropertyOptional() @IsArray() @IsOptional() enabledModules?: string[];
  @ApiPropertyOptional() @IsBoolean() @IsOptional() isTrial?: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() trialEndsAt?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() gracePeriodDays?: number;
}

// 8. API Administration DTOs
export class CreateApiClientDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsArray() @IsOptional() scopes?: string[];
  @ApiPropertyOptional() @IsNumber() @IsOptional() rateLimitOverride?: number;
}

export class CreateWebhookSecretDto {
  @ApiProperty() @IsString() @IsNotEmpty() endpointUrl!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsArray() @IsOptional() events?: string[];
}

// 9. Audit Center DTOs
export class AuditQueryDto {
  @ApiPropertyOptional() @IsNumber() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() limit?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() entity?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() userId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() actionPrefix?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() startDate?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() endDate?: string;
}

export class AuditRetentionPolicyDto {
  @ApiProperty() @IsNumber() @IsNotEmpty() auditRetentionDays!: number;
}

// 10. System Settings DTOs
export class UpdateSmtpSettingsDto {
  @ApiPropertyOptional() @IsString() @IsOptional() smtpHost?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() smtpPort?: number;
  @ApiPropertyOptional() @IsString() @IsOptional() smtpUser?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() smtpSecure?: boolean;
}

export class UpdateStorageSettingsDto {
  @ApiPropertyOptional() @IsString() @IsOptional() storageProvider?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() s3Bucket?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() s3Region?: string;
}

export class UpdateQueueSettingsDto {
  @ApiPropertyOptional() @IsNumber() @IsOptional() queueConcurrency?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() retryAttempts?: number;
}

export class UpdateRedisSettingsDto {
  @ApiPropertyOptional() @IsString() @IsOptional() redisHost?: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() redisPort?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() cacheTtl?: number;
}

export class UpdateCdnSettingsDto {
  @ApiPropertyOptional() @IsString() @IsOptional() cdnUrl?: string;
  @ApiPropertyOptional() @IsBoolean() @IsOptional() cdnEnabled?: boolean;
}

export class UpdateMaintenanceModeDto {
  @ApiProperty() @IsBoolean() @IsNotEmpty() maintenanceMode!: boolean;
  @ApiPropertyOptional() @IsString() @IsOptional() maintenanceMessage?: string;
}

// 11. Truck Capacity Management DTOs (Enterprise Licensing Engine)
export class SetTruckLimitDto {
  @ApiProperty({
    description: 'New maximum vehicle/truck limit for the tenant',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  maxVehicles!: number;

  @ApiPropertyOptional({
    description: 'Reason for the override (for audit log)',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class SetDriverLimitDto {
  @ApiProperty({
    description: 'New maximum driver limit for the tenant',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  maxDrivers!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}

export class SetBoostDto {
  @ApiProperty({
    description: 'Temporary maximum vehicle limit during boost period',
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  boostMaxVehicles!: number;

  @ApiProperty({
    description: 'ISO 8601 datetime when the boost expires',
    example: '2026-09-01T00:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  boostExpiresAt!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}

export class SetUnlimitedModeDto {
  @ApiProperty({
    description:
      'Enable or disable unlimited mode (bypasses all capacity checks)',
  })
  @IsBoolean()
  @IsNotEmpty()
  unlimited!: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}
