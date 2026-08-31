import { IsNumber, IsOptional, Min } from 'class-validator';

// NOTE: this file previously declared `reason` (string, required) and
// `treadDepth` (number, required) — fields tyre.service.ts#removeTyre never
// reads. Wiring the old DTO in as-is would have made every removeTyre call
// either 400 (missing reason/treadDepth) or silently drop removedAtKm
// (whitelist:true + forbidNonWhitelisted:true strips/rejects unknown
// properties). Replaced with the field the service actually uses.
export class RemoveTyreDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  removedAtKm?: number;
}
