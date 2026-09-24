import { IsArray, IsString } from 'class-validator';

export class AddWorkshopCostsDto {
  @IsArray()
  @IsString({ each: true })
  jobCardIds: string[];
}
