import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EntityComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  EXPIRING_SOON = 'EXPIRING_SOON',
  NON_COMPLIANT = 'NON_COMPLIANT',
}

export class CreateFolderDto {
  @ApiProperty({ example: 'Driver Licenses' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'folder-uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UpdateFolderDto {
  @ApiPropertyOptional({ example: 'Updated Folder Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'parent-folder-uuid' })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class UploadDocumentDto {
  @ApiProperty({ example: 'BILL_OF_LADING' })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional({ example: 'Shipping' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'load-uuid' })
  @IsOptional()
  @IsString()
  loadId?: string;

  @ApiPropertyOptional({ example: 'driver-uuid' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ example: 'DRIVER' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: 'folder-uuid' })
  @IsOptional()
  @IsString()
  folderId?: string;

  @ApiPropertyOptional({ example: '["urgent", "verified"]' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: '2027-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    example: '{"loadNumber": "LD-1001", "weight": 45000}',
  })
  @IsOptional()
  @IsString()
  metadata?: string;

  @ApiPropertyOptional({ example: '7_YEARS' })
  @IsOptional()
  @IsString()
  retentionPolicy?: string;
}

export class CheckoutDocumentDto {
  @ApiPropertyOptional({ example: 'Updating rate confirmation details' })
  @IsOptional()
  @IsString()
  lockReason?: string;
}

export class CheckinDocumentDto {
  @ApiProperty({ example: 'Updated weight and delivery instructions' })
  @IsString()
  @IsNotEmpty()
  changeSummary!: string;
}

export class CreateSignatureRequestDto {
  @ApiProperty({ example: 'driver@parilink.com' })
  @IsString()
  @IsNotEmpty()
  signerEmail!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  signerName!: string;

  @ApiPropertyOptional({ example: 'user-uuid' })
  @IsOptional()
  @IsString()
  signerId?: string;
}

export class SignDocumentDto {
  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  @IsString()
  @IsNotEmpty()
  signatureUrl!: string;

  @ApiPropertyOptional({
    example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  })
  @IsOptional()
  @IsString()
  documentHash?: string;
}

export class CreateComplianceRequirementDto {
  @ApiProperty({ example: 'DRIVER' })
  @IsString()
  @IsNotEmpty()
  entityType!: string;

  @ApiProperty({ example: 'CDL' })
  @IsString()
  @IsNotEmpty()
  docType!: string;

  @ApiProperty({ example: 'Commercial Driver License' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Valid Class A CDL required for all interstate drivers',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @ApiPropertyOptional({ example: 365 })
  @IsOptional()
  @IsInt()
  @Min(1)
  validityDays?: number;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsInt()
  @Min(1)
  warningDays?: number;
}

export class ClassifyDocumentDto {
  @ApiProperty({
    example: 'BILL OF LADING Load # LD-99201 Weight 42000 lbs Date: 2026-07-27',
  })
  @IsString()
  @IsNotEmpty()
  ocrText!: string;
}
