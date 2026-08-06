import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateDriverAttendanceDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class UpdateDriverAttendanceDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class QueryDriverAttendanceDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
