const fs = require('fs');
const file = 'apps/api/src/maintenance/jobs.controller.ts';
let content = fs.readFileSync(file, 'utf8');

// Undo the bad patch
content = content.replace(
  /import \{ IsString, IsNotEmpty, IsOptional, IsNumber \} from 'class-validator';\nexport class CreateJobDto \{\n  @IsString\(\) @IsNotEmpty\(\) description: string;\n  @IsString\(\) @IsOptional\(\) assignedTo\?: string;\n  @IsNumber\(\) @IsOptional\(\) estimatedCost\?: number;\n\}\nexport class JobsController/,
  'export class JobsController'
);

// Put the import at the top and the DTO class above the decorators
content = `import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
export class CreateJobDto {
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsOptional() assignedTo?: string;
  @IsNumber() @IsOptional() estimatedCost?: number;
}
` + content;

fs.writeFileSync(file, content);
