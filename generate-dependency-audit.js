const fs = require('fs');
const path = require('path');

const repoPath = '/Users/vishalvirda/Desktop/PariLink';
let auditData = { vulnerabilities: {} };
let outdatedData = {};

try {
  auditData = JSON.parse(fs.readFileSync(path.join(repoPath, 'npm-audit.json'), 'utf8'));
} catch (e) {
  console.log('No npm-audit.json or invalid format. Using empty default.');
}

try {
  outdatedData = JSON.parse(fs.readFileSync(path.join(repoPath, 'npm-outdated.json'), 'utf8'));
} catch (e) {
  console.log('No npm-outdated.json or invalid format. Using empty default.');
}

let reportContent = `# Dependency Audit Report (Phase 3)

## Security Vulnerabilities
Based on the empirical \`npm audit\` execution across the monorepo:

| Package | Severity | Description | Fix Recommendation |
| :--- | :--- | :--- | :--- |
`;

let hasVulns = false;
for (const [pkgName, vuln] of Object.entries(auditData.vulnerabilities || {})) {
  if (vuln.severity === 'high' || vuln.severity === 'critical') {
    hasVulns = true;
    reportContent += `| \`${pkgName}\` | **${vuln.severity.toUpperCase()}** | ${vuln.name} | \`npm audit fix\` or force upgrade to ${vuln.fixAvailable ? vuln.fixAvailable.name : 'latest'} |\n`;
  }
}

if (!hasVulns) {
  reportContent += `| None | - | No Critical/High vulnerabilities found. | - |\n`;
}

reportContent += `\n## Outdated Packages (Technical Debt)\n`;
reportContent += `Packages that are significantly behind their \`latest\` versions.\n\n`;
reportContent += `| Package | Current | Latest | Type |\n`;
reportContent += `| :--- | :--- | :--- | :--- |\n`;

let hasOutdated = false;
for (const [pkgName, info] of Object.entries(outdatedData || {})) {
  if (info.current && info.latest && info.current !== info.latest) {
    hasOutdated = true;
    reportContent += `| \`${pkgName}\` | ${info.current} | ${info.latest} | ${info.type} |\n`;
  }
}

if (!hasOutdated) {
  reportContent += `| None | - | - | - |\n`;
}

fs.writeFileSync(path.join(repoPath, 'DEPENDENCY_AUDIT.md'), reportContent);
console.log('DEPENDENCY_AUDIT.md generated successfully.');
