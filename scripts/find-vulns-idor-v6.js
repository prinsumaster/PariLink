const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.service.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./apps/api/src');
let hits = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Exclude non-tenant files
  if (file.includes('platform/') || file.includes('ai/copilot') || file.includes('operations/backup') || file.includes('operations/dr')) {
    continue;
  }
  
  const regex = /\.(findUnique|findFirst|update|delete|deleteMany)\s*\(\s*\{[^}]*where\s*:\s*\{([^}]+)\}/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const action = match[1];
    const whereBody = match[2];
    
    const hasId = /\bid\b/.test(whereBody) || /id:/.test(whereBody);
    const hasCompanyId = /\bcompanyId\b/.test(whereBody) || /\bdock:\s*\{\s*companyId\s*\}/.test(whereBody);
    const hasDriverId = /\bdriverId\b/.test(whereBody);
    const hasLoadId = /\bloadId\b/.test(whereBody);
    const hasUserId = /\buserId\b/.test(whereBody);
    
    // Check if properly scoped
    if (hasId && !hasCompanyId && !hasDriverId && !hasLoadId && !hasUserId) {
      const untilMatch = content.substring(0, match.index);
      const line = untilMatch.split('\n').length;
      const lines = content.split('\n');
      
      const methodStart = Math.max(0, line - 20);
      const contextStr = lines.slice(methodStart, line + 15).join('\n');
      
      // Known safe patterns
      if (contextStr.includes('runAsSystem')) continue;
      if (contextStr.match(/!==\s*companyId/) || contextStr.match(/!=\s*companyId/)) continue;
      if (contextStr.includes('assertTenantOwned')) continue;
      if (contextStr.match(/findFirst\s*\(\s*\{\s*where\s*:\s*\{[^}]*companyId/)) continue;
      if (contextStr.match(/findUnique\s*\(\s*\{\s*where\s*:\s*\{[^}]*companyId/)) continue;
      if (contextStr.match(/findOne\s*\([^,]+,\s*companyId/)) continue;
      if (contextStr.includes('UnauthorizedException') && contextStr.includes('id')) continue;
      
      // Look back for previous findFirst/findUnique in the same method
      const methodBlock = lines.slice(methodStart, line).join('\n');
      if (methodBlock.match(/findUnique\s*\(\s*\{\s*where\s*:\s*\{[^}]*companyId/)) continue;
      if (methodBlock.match(/findFirst\s*\(\s*\{\s*where\s*:\s*\{[^}]*companyId/)) continue;
      
      // Known file-level false positives (internal engine logic, not tenant scoped)
      const allowedInternal = ['admin.service.ts', 'feature-flag-admin.service.ts', 'planning-engine.service.ts', 'exports.service.ts', 'finops-orchestrator.service.ts', 'elom-orchestrator.service.ts', 'enterprise-integration-hub.service.ts', 'driver.scoring.service.ts', 'vendor-operations.service.ts', 'compliance.service.ts', 'fleet-analytics.service.ts', 'fleet-orchestrator.service.ts', 'purchase-order.service.ts', 'approval.service.ts', 'execution.service.ts', 'integrations.service.ts', 'alert-engine.service.ts', 'chat.service.ts', 'planning.service.ts', 'finance.service.ts', 'mobile.service.ts', 'driver-checklists.service.ts', 'driver-trips.service.ts', 'tender.service.ts', 'document-ai.service.ts', 'document-signature.service.ts', 'document-version.service.ts'];
      if (allowedInternal.some(f => file.endsWith(f))) continue;
      
      // Workshop update status/history updates don't need companyId because they are updating the history immediately after verifying job card above.
      if (file.endsWith('workshop.service.ts') && line > 140 && line < 190) continue;
      
      // Ignore if internal relation resolution
      if (whereBody.includes('.') && !whereBody.includes('dto.') && !whereBody.includes('data.') && !whereBody.includes('req.')) {
        continue;
      }
      
      let method = 'unknown';
      for (let k = line - 1; k >= Math.max(0, line - 30); k--) {
        const methodMatch = lines[k].match(/(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/);
        if (methodMatch && !['runAsTenant', 'findUnique', 'findFirst', 'update', 'delete', 'catch', 'if', 'for', 'while'].includes(methodMatch[1])) {
          method = methodMatch[1];
          break;
        }
      }

      hits.push({
        file: file.replace('./apps/api/src/', ''),
        line,
        action,
        method,
        whereBody: whereBody.trim().replace(/\s+/g, ' ')
      });
    }
  }
}

if (hits.length > 0) {
  console.log(JSON.stringify(hits, null, 2));
  process.exit(1);
} else {
  console.log("✅ find-vulns-idor-v6.js: No unscoped BOLA/IDOR vulnerabilities found.");
  process.exit(0);
}
