# 1. Loading Events DTO
cat << 'DTO_EOF' > apps/api/src/trips/dto/create-loading-event.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateLoadingEventDto {
  @IsString()
  @IsNotEmpty()
  type: 'LOAD' | 'UNLOAD';

  @IsString()
  @IsNotEmpty()
  point: string;

  @IsString()
  @IsOptional()
  timeIn?: string;

  @IsString()
  @IsOptional()
  timeOut?: string;

  @IsNumber()
  @IsOptional()
  weightIn?: number;

  @IsNumber()
  @IsOptional()
  weightOut?: number;

  @IsNumber()
  @IsOptional()
  hamaliCost?: number;
}
DTO_EOF

sed -i '' "s/import type { CreateLoadingEventDto } from '.\/loading-events.service';/import { CreateLoadingEventDto } from '.\/dto\/create-loading-event.dto';/" apps/api/src/trips/loading-events.controller.ts

# 2. Fuel Entries DTO
cat << 'DTO_EOF' > apps/api/src/trips/dto/create-fuel-entry.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateFuelEntryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
DTO_EOF

sed -i '' "s/@Body() dto: any/@Body() dto: CreateFuelEntryDto/" apps/api/src/trips/fuel-entries.controller.ts
sed -i '' "1s/^/import { CreateFuelEntryDto } from '.\/dto\/create-fuel-entry.dto';\n/" apps/api/src/trips/fuel-entries.controller.ts

# 3. Close Job DTO
cat << 'DTO_EOF' > apps/api/src/maintenance/dto/close-job.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
export class CloseJobDto {
  @IsString()
  @IsNotEmpty()
  notes: string;
}
DTO_EOF
sed -i '' "s/jobs\/:id\/close/jobs\/:id\/close/" apps/api/src/maintenance/jobs.controller.ts
sed -i '' "s/closeJob(@Param('id') id: string, @Body() dto: any/closeJob(@Param('id') id: string, @Body() dto: CloseJobDto/" apps/api/src/maintenance/jobs.controller.ts
sed -i '' "1s/^/import { CloseJobDto } from '.\/dto\/close-job.dto';\n/" apps/api/src/maintenance/jobs.controller.ts

# 4. Remove Tyre DTO
cat << 'DTO_EOF' > apps/api/src/vehicles/tyre/dto/remove-tyre.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class RemoveTyreDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
  @IsNumber()
  @IsNotEmpty()
  treadDepth: number;
}
DTO_EOF
sed -i '' "s/removeTyre(@GetUser() user: AuthenticatedUser, @Param('id') id: string, @Body() data: any/removeTyre(@GetUser() user: AuthenticatedUser, @Param('id') id: string, @Body() data: RemoveTyreDto/" apps/api/src/vehicles/tyre/tyre.controller.ts
sed -i '' "1s/^/import { RemoveTyreDto } from '.\/dto\/remove-tyre.dto';\n/" apps/api/src/vehicles/tyre/tyre.controller.ts

# 5. Driver Score DTO
cat << 'DTO_EOF' > apps/api/src/trips/dto/driver-score.dto.ts
import { IsNumber, IsNotEmpty } from 'class-validator';
export class DriverScoreDto {
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
DTO_EOF
sed -i '' "s/driverScore(@GetUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: any/driverScore(@GetUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: DriverScoreDto/" apps/api/src/trips/trips.controller.ts
sed -i '' "1s/^/import { DriverScoreDto } from '.\/dto\/driver-score.dto';\n/" apps/api/src/trips/trips.controller.ts

# 6. Copilot Session/Chat DTOs
cat << 'DTO_EOF' > apps/api/src/ai/dto/copilot.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCopilotSessionDto {
  @IsString()
  @IsNotEmpty()
  context: string;
}
export class CopilotChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
DTO_EOF
sed -i '' "s/createSession(@GetUser() user: AuthenticatedUser, @Body() dto: any/createSession(@GetUser() user: AuthenticatedUser, @Body() dto: CreateCopilotSessionDto/" apps/api/src/ai/ai.controller.ts
sed -i '' "s/chat(@GetUser() user: AuthenticatedUser, @Param('sessionId') sessionId: string, @Body() dto: any/chat(@GetUser() user: AuthenticatedUser, @Param('sessionId') sessionId: string, @Body() dto: CopilotChatDto/" apps/api/src/ai/ai.controller.ts
sed -i '' "1s/^/import { CreateCopilotSessionDto, CopilotChatDto } from '.\/dto\/copilot.dto';\n/" apps/api/src/ai/ai.controller.ts

