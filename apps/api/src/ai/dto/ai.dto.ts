import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class InteractDto {
  @IsString()
  @IsNotEmpty()
  intent!: string;

  @IsString()
  @IsNotEmpty()
  domain!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;
}

export class ReportHallucinationDto {
  @IsString()
  @IsNotEmpty()
  interactionId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  // Was typed as the literal union 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  // with no validator decorator -- a TS union type alone enforces nothing
  // at runtime, so any string would have passed. Added @IsIn so the
  // constraint is actually real once this DTO is wired in.
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  severity!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
