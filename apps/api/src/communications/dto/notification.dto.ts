import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SLACK = 'SLACK',
  PUSH = 'PUSH',
}

export class CreateNotificationTemplateDto {
  @ApiProperty({ example: 'Invoice Created Template' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'invoice.created' })
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiProperty({
    enum: NotificationChannel,
    example: NotificationChannel.EMAIL,
  })
  @IsEnum(NotificationChannel)
  channel!: string;

  @ApiPropertyOptional({
    example: 'New Invoice {{invoiceNumber}} from PariLink',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    example:
      'Hello {{customerName}}, your invoice #{{invoiceNumber}} for ${{amount}} has been generated.',
  })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateNotificationTemplateDto {
  @ApiPropertyOptional({ example: 'Updated Template Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated subject {{invoiceNumber}}' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ example: 'Updated body text with {{amount}}' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class DispatchNotificationDto {
  @ApiProperty({ example: 'user-uuid-here' })
  @IsString()
  @IsNotEmpty()
  targetUserId!: string;

  @ApiProperty({ example: 'invoice.created' })
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @ApiPropertyOptional({
    enum: NotificationPriority,
    example: NotificationPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: string;

  @ApiPropertyOptional({ example: 'New Invoice Generated' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Invoice #INV-1001 for $1,250.00 is ready for review.',
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ example: 'Invoice' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: 'inv-uuid-1001' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ example: '/invoices/inv-uuid-1001' })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiPropertyOptional({
    example: {
      invoiceNumber: 'INV-1001',
      amount: '1,250.00',
      customerName: 'Acme Logistics',
    },
  })
  @IsOptional()
  @IsObject()
  templateData?: Record<string, any>;

  @ApiPropertyOptional({ example: ['EMAIL', 'IN_APP'] })
  @IsOptional()
  channels?: string[];
}
