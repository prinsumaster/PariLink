const fs = require('fs');
const path = require('path');

const filesToFix = [
  {
    file: 'src/portals/driver/telemetry/driver-telemetry.controller.ts',
    dtoName: 'LogLocationDto',
    dtoProps: `@IsString() @IsNotEmpty() tripId!: string;\n  @IsNumber() latitude!: number;\n  @IsNumber() longitude!: number;`,
    methodName: 'logLocation',
    replaceArgs: `@Body() dto: LogLocationDto`,
    replaceCallArgs: `dto.tripId,\n      dto.latitude,\n      dto.longitude`,
    targetRegex: /@Body\('tripId'\) tripId: string,[\s\S]*?@Body\('longitude'\) longitude: number,/,
    callRegex: /tripId,\s*latitude,\s*longitude/
  },
  {
    file: 'src/portals/driver/expenses/driver-expenses.controller.ts',
    dtoName: 'SubmitExpenseDto',
    dtoProps: `@IsString() @IsNotEmpty() type!: string;\n  @IsNumber() amount!: number;\n  @IsString() @IsNotEmpty() date!: string;\n  @IsOptional() @IsString() documentUrl?: string;`,
    methodName: 'submitExpense',
    replaceArgs: `@Body() dto: SubmitExpenseDto`,
    replaceCallArgs: `dto.type,\n      dto.amount,\n      dto.date,\n      dto.documentUrl`,
    targetRegex: /@Body\('type'\) type: string,[\s\S]*?@Body\('documentUrl'\) documentUrl\?: string,/,
    callRegex: /type,\s*amount,\s*date,\s*documentUrl/
  },
  {
    file: 'src/portals/driver/trips/driver-trips.controller.ts',
    dtoName: 'UpdateTripStatusDto',
    dtoProps: `@IsString() @IsNotEmpty() status!: string;\n  @IsNotEmptyObject() location!: any;`,
    methodName: 'updateTripStatus',
    replaceArgs: `@Body() dto: UpdateTripStatusDto`,
    replaceCallArgs: `dto.status,\n      dto.location`,
    targetRegex: /@Body\('status'\) status: string,[\s\S]*?@Body\('location'\) location: any,/,
    callRegex: /status,\s*location/
  },
  {
    file: 'src/portals/driver/checklist/driver-checklists.controller.ts',
    dtoName: 'SubmitChecklistDto',
    dtoProps: `@IsNotEmptyObject() data!: any;`,
    methodName: 'submitChecklist',
    replaceArgs: `@Body() dto: SubmitChecklistDto`,
    replaceCallArgs: `dto.data`,
    targetRegex: /@Body\(\) checklistData: any,/,
    callRegex: /checklistData/
  },
  {
    file: 'src/portals/vendor/marketplace/vendor-marketplace.controller.ts',
    dtoName: 'SubmitBidDto',
    dtoProps: `@IsNumber() amount!: number;`,
    methodName: 'submitBid',
    replaceArgs: `@Body() dto: SubmitBidDto`,
    replaceCallArgs: `dto.amount`,
    targetRegex: /@Body\('amount'\) amount: number,/,
    callRegex: /amount/
  },
  {
    file: 'src/portals/vendor/operations/vendor-operations.controller.ts',
    dtoName: 'SubmitPodDto',
    dtoProps: `@IsString() @IsNotEmpty() documentUrl!: string;`,
    methodName: 'submitPod',
    replaceArgs: `@Body() dto: SubmitPodDto`,
    replaceCallArgs: `dto.documentUrl`,
    targetRegex: /@Body\('documentUrl'\) documentUrl: string,/,
    callRegex: /documentUrl/
  },
  {
    file: 'src/portals/claims/claims.controller.ts',
    dtoName: 'SubmitClaimDto',
    dtoProps: `@IsOptional() @IsString() loadId?: string;\n  @IsNumber() amount!: number;\n  @IsString() @IsNotEmpty() reason!: string;`,
    methodName: 'submitClaim',
    replaceArgs: `@Body() dto: SubmitClaimDto`,
    replaceCallArgs: `dto`,
    targetRegex: /@Body\(\) body: \{ loadId\?: string; amount: number; reason: string \},/,
    callRegex: /body/
  },
  {
    file: 'src/portals/claims/claims.controller.ts',
    dtoName: 'UpdateClaimStatusDto',
    dtoProps: `@IsString() @IsNotEmpty() status!: string;`,
    methodName: 'updateClaimStatus',
    replaceArgs: `@Body() dto: UpdateClaimStatusDto`,
    replaceCallArgs: `dto.status`,
    targetRegex: /@Body\(\) body: \{ status: string \},/,
    callRegex: /body\.status/
  }
];

const basePath = path.join(__dirname);

for (const config of filesToFix) {
  const filePath = path.join(basePath, config.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add class-validator imports if not present
  if (!content.includes('class-validator')) {
    const importStatement = `import { IsString, IsNumber, IsOptional, IsNotEmpty, IsNotEmptyObject } from 'class-validator';\n`;
    content = importStatement + content;
  }
  
  // Add DTO class if not present
  if (!content.includes('class ' + config.dtoName)) {
    const dtoClass = '\nexport class ' + config.dtoName + ' {\n  ' + config.dtoProps + '\n}\n\n';
    content = content.replace(/@Controller/, dtoClass + '@Controller');
  }
  
  // Replace method arguments
  content = content.replace(config.targetRegex, config.replaceArgs + ',');
  
  // Replace method call arguments
  if (config.callRegex) {
    // We only want to replace inside the method body.
    // To do this simply, we will just use global replace because the variable names are quite unique in context.
    content = content.replace(config.callRegex, config.replaceCallArgs);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
}
