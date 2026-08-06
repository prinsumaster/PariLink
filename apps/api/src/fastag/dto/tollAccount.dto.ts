import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateTollAccountDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdateTollAccountDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class QueryTollAccountDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
