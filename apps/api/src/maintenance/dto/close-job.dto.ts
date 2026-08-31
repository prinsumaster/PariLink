import { IsString, IsNotEmpty } from 'class-validator';
export class CloseJobDto {
  @IsString()
  @IsNotEmpty()
  notes: string;
}
