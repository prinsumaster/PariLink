import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreatePayrollRunDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdatePayrollRunDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class QueryPayrollRunDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
