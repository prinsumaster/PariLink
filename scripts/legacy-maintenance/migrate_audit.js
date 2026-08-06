const fs = require('fs');
const path = require('path');

const files = [
  'apps/api/src/trips/trips.service.ts',
  'apps/api/src/data/import.service.ts',
  'apps/api/src/vehicles/vehicles.service.ts',
  'apps/api/src/data-lifecycle/backup.service.ts',
  'apps/api/src/common/guards/dlp.guard.ts',
  'apps/api/src/common/interceptors/audit.interceptor.ts',
  'apps/api/src/workflow/engine/action.service.ts',
  'apps/api/src/auth/sso/sso.service.ts',
  'apps/api/src/drivers/drivers.service.ts'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  let modified = false;

  // 1. Replace tx.auditLog.create({ data: { ... } }) with this.auditService.logEvent({ ... }, null, tx)
  const auditRegex = /await\s+([a-zA-Z0-9_]+)\.auditLog\.create\(\{\s*data:\s*(\{[\s\S]*?\})\s*,?\s*\}\)/g;
  if (auditRegex.test(code)) {
    code = code.replace(auditRegex, 'await this.auditService.logEvent($2, null, $1)');
    modified = true;
  }
  
  const auditRegexNoAwait = /([a-zA-Z0-9_]+)\.auditLog\.create\(\{\s*data:\s*(\{[\s\S]*?\})\s*,?\s*\}\)/g;
  if (auditRegexNoAwait.test(code)) {
    code = code.replace(auditRegexNoAwait, 'this.auditService.logEvent($2, null, $1)');
    modified = true;
  }

  if (modified) {
    // 2. Add Import
    if (!code.includes('AuditService')) {
      const depth = file.split('/').length - 4; // apps/api/src/...
      let relativePrefix = '../'.repeat(depth - 1) || './';
      if (depth === 1) relativePrefix = './'; // if in src/
      
      const importStr = `import { AuditService } from '${relativePrefix}platform/audit/audit.service';\n`;
      code = importStr + code;

      // 3. Inject to Constructor
      const constructorRegex = /constructor\s*\(([\s\S]*?)\)\s*\{/;
      if (constructorRegex.test(code)) {
        code = code.replace(constructorRegex, 'constructor(\n    private readonly auditService: AuditService,\n$1) {');
      }
    }
    
    fs.writeFileSync(file, code, 'utf8');
    console.log('Migrated', file);
  }
}
