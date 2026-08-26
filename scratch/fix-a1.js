const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/api/src/**/*.ts', { ignore: ['**/*.spec.ts', '**/prisma.service.ts'] });
let replacedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('runAsSystem')) continue;

    let modified = false;

    // Pattern 1: runAsSystem('...', async (tx) => { ... where: { companyId: someVar } ... })
    // If the query has companyId explicitly, we can use that!
    // But regex for that is hard.

    // Pattern 2: the method parameter contains companyId
    let newContent = content.replace(/([a-zA-Z0-9_]+)\s*\([^)]*\)\s*(?::\s*[^\{]+)?\s*\{([\s\S]*?)\}/g, (match, methodName, methodBody) => {
        if (methodBody.includes('runAsSystem')) {
            // Check if we can find a companyId reference
            let tenantIdSource = null;
            if (methodBody.match(/\bcompanyId\b/)) tenantIdSource = 'companyId';
            else if (methodBody.match(/\buser\.companyId\b/)) tenantIdSource = 'user.companyId';
            else if (methodBody.match(/\bdto\.companyId\b/)) tenantIdSource = 'dto.companyId';
            else if (methodBody.match(/\bpayload\.companyId\b/)) tenantIdSource = 'payload.companyId';
            else if (methodBody.match(/\breq\.user\.companyId\b/)) tenantIdSource = 'req.user.companyId';
            
            if (tenantIdSource) {
                const newBody = methodBody.replace(/\.runAsSystem\([^,]+,\s*async\s*\(([^)]+)\)\s*=>/g, `.runAsTenant(${tenantIdSource}, async ($1) =>`);
                const diffCount = methodBody.split('runAsSystem').length - newBody.split('runAsSystem').length;
                replacedCount += diffCount;
                return match.replace(methodBody, newBody);
            }
        }
        return match;
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf-8');
        console.log(`Replaced in ${file}`);
    }
}
console.log(`Total replaced: ${replacedCount}`);
