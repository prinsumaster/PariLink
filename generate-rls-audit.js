const fs = require('fs');
const path = require('path');

const repoPath = '/Users/vishalvirda/Desktop/PariLink';
const reportPath = path.join(repoPath, 'apps/api/eslint-report.json');
const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

let rlsAuditContent = `# RLS Audit Report (Multi-Tenant Security)

## Phase 1 Findings
The following files contain direct Prisma model access (\`this.prisma.model.findMany\`, etc.) that bypasses the \`PrismaService.runAsTenant()\` isolation wrapper. This represents a critical IDOR / Tenant Data Leakage risk.

| File | Line | Risk | Recommended Fix |
| :--- | :--- | :--- | :--- |
`;

let violationsFound = 0;

reportData.forEach(fileResult => {
  const filePath = path.relative(repoPath, fileResult.filePath);
  
  fileResult.messages.forEach(msg => {
    if (msg.ruleId === 'no-restricted-syntax' && msg.message.includes('Direct Prisma model access is strictly forbidden')) {
      violationsFound++;
      rlsAuditContent += `| \`${filePath}\` | ${msg.line} | Critical (IDOR) | Wrap in \`this.prisma.runAsTenant(companyId, tx => tx.model...)\` |\n`;
    }
  });
});

rlsAuditContent += `\n**Total RLS Violations Detected:** ${violationsFound}\n`;

fs.writeFileSync('/Users/vishalvirda/Desktop/PariLink/RLS_AUDIT.md', rlsAuditContent);
console.log(`Generated RLS_AUDIT.md with ${violationsFound} violations.`);
