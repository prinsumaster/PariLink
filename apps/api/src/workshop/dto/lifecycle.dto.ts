import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class GateInDto {
  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class UpdateStatusDto {
  @IsString()
  status: string;
}

export class GateOutDto {
  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class OwnerApproveDto {
  @IsBoolean()
  approved: boolean;
}
