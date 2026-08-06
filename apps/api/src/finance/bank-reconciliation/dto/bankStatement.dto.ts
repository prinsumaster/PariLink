import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateBankStatementDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdateBankStatementDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class QueryBankStatementDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
