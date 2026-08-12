const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/api/src/**/*.ts');
let unboundedCount = 0;
let markdown = `# PARILINK 2.0 — PERFORMANCE & UNBOUNDED QUERY AUDIT\n\n`;
markdown += `## Unbounded Prisma Queries\n\n`;
markdown += `The following \`findMany\` queries might be unbounded (missing \`take\` parameter), which can lead to OOM (Out Of Memory) issues in production under heavy load.\n\n`;

for (const file of files) {
    if (file.includes('.spec.ts')) continue;
    
    const content = fs.readFileSync(file, 'utf8');
    const regex = /findMany\s*\(\s*\{([^}]*)\}\s*\)/g;
    let match;
    
    let fileHeaderAdded = false;
    
    while ((match = regex.exec(content)) !== null) {
        const args = match[1];
        if (!args.includes('take:') && !args.includes('skip:') && !args.includes('take,') && !args.includes('skip,')) {
            if (!fileHeaderAdded) {
                markdown += `\n### \`${file}\`\n`;
                fileHeaderAdded = true;
            }
            // Get line number
            const lines = content.substring(0, match.index).split('\n');
            const lineNumber = lines.length;
            markdown += `- Line ${lineNumber}: Unbounded \`findMany\` call.\n`;
            unboundedCount++;
        }
    }
}

markdown += `\n## Summary\n`;
markdown += `- Total Unbounded Queries Flagged: ${unboundedCount}\n`;
markdown += `- Recommendation: Wrap these in pagination (\`take\` / \`skip\`) or chunking mechanisms.\n`;

fs.writeFileSync('PERFORMANCE_AUDIT.md', markdown);
console.log('Generated PERFORMANCE_AUDIT.md');
