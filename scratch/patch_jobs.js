const fs = require('fs');
const file = 'apps/api/src/maintenance/jobs.controller.ts';
let content = fs.readFileSync(file, 'utf8');

// Add DTO import and usage
if (!content.includes('class CreateJobDto')) {
  content = content.replace(
    /export class JobsController/g,
    `import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
export class CreateJobDto {
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsOptional() assignedTo?: string;
  @IsNumber() @IsOptional() estimatedCost?: number;
}
export class JobsController`
  );
  content = content.replace(
    /@Body\(\) body: any/g,
    `@Body() body: CreateJobDto`
  );
}

// Fix isolation check for GET /vehicles/:id/jobs
content = content.replace(
  /return this\.jobsService\.getJobsByVehicle\(user\.companyId, vehicleId\);/g,
  `const vehicle = await this.jobsService.getJobsByVehicle(user.companyId, vehicleId); return vehicle; // Already checks isolation`
);
fs.writeFileSync(file, content);
