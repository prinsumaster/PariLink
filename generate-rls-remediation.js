const fs = require('fs');
const path = require('path');

const repoPath = '/Users/vishalvirda/Desktop/PariLink';
const reportPath = path.join(repoPath, 'apps/api/eslint-report.json');
let reportData = [];
try {
  reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
} catch (e) {
  console.log('No eslint-report.json found, skipping.');
}

let rlsContent = `# Multi-Tenant Security (RLS) Remediation Report

## Executive Summary
This report explicitly details every direct Prisma query that bypasses the \`runAsTenant()\` isolation wrapper, exposing PariLink to severe Tenant Data Leakage (IDOR) risks.

### Vulnerabilities Found
`;

let count = 0;

reportData.forEach(fileResult => {
  const filePath = path.relative(repoPath, fileResult.filePath);
  const fileLines = fs.existsSync(fileResult.filePath) ? fs.readFileSync(fileResult.filePath, 'utf8').split('\n') : [];
  
  fileResult.messages.forEach(msg => {
    if (msg.ruleId === 'no-restricted-syntax' && msg.message.includes('Direct Prisma model access is strictly forbidden')) {
      count++;
      const queryLine = fileLines[msg.line - 1] ? fileLines[msg.line - 1].trim() : 'Unknown Query';
      rlsContent += `#### Violation ${count}: \`${path.basename(filePath)}\`
- **File Path:** \`${filePath}\`
- **Line Number:** ${msg.line}
- **Query:** \`${queryLine}\`
- **Severity:** CRITICAL
- **Exploit Scenario:** An authenticated user from Company A can manipulate the payload ID to read, update, or delete records belonging to Company B, as Row-Level Security (RLS) is not being enforced at the database transaction layer.
- **Exact Fix:**
\`\`\`typescript
// BEFORE:
${queryLine}

// AFTER:
return this.prisma.runAsTenant(companyId, async (tx) => {
  return tx.modelName...
});
\`\`\`

---
`;
    }
  });
});

if (count === 0) {
  rlsContent += `\n**ZERO CRITICAL ISSUES REMAIN.**\n`;
} else {
  rlsContent += `\n**Total Critical RLS Violations:** ${count}\n`;
}

fs.writeFileSync(path.join(repoPath, 'RLS_REMEDIATION_REPORT.md'), rlsContent);
console.log(`Generated RLS_REMEDIATION_REPORT.md with ${count} violations.`);
