import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class ExportDataDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  modules!: string[];

  @IsString()
  @IsNotEmpty()
  format!: string;
}

export class ImportDataDto {
  @IsString()
  @IsNotEmpty()
  moduleType!: string;

  @IsArray()
  @ArrayNotEmpty()
  data!: any[];
}
