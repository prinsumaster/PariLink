import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateCrmLeadDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdateCrmLeadDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class QueryCrmLeadDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
