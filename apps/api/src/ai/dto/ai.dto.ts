import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class InteractDto {
  @IsString()
  @IsNotEmpty()
  intent: string;

  @IsString()
  @IsNotEmpty()
  domain: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ReportHallucinationDto {
  @IsString()
  @IsNotEmpty()
  interactionId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
