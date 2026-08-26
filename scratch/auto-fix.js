const fs = require('fs');
const glob = require('glob');
const { execSync } = require('child_process');

const files = glob.sync('apps/api/src/**/*.ts', { ignore: ['**/*.spec.ts', '**/prisma.service.ts'] });

let originalContents = {};

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('runAsSystem')) continue;
    originalContents[file] = content;

    let newContent = content.replace(/\.runAsSystem\([^,]+,\s*async\s*\(([^)]+)\)\s*=>/g, '.runAsTenant(dto.companyId, async ($1) =>');
    fs.writeFileSync(file, newContent, 'utf-8');
}

console.log(`Replaced in ${Object.keys(originalContents).length} files.`);

let hasErrors = true;
let iteration = 0;

while (hasErrors && iteration < 10) {
    iteration++;
    console.log(`Running tsc (Iteration ${iteration})...`);
    try {
        execSync('npx tsc --noEmit -p apps/api/tsconfig.json', { stdio: 'pipe' });
        console.log('Build succeeded!');
        hasErrors = false;
    } catch (err) {
        const output = err.stdout ? err.stdout.toString() : err.message;
        const failedFiles = new Set();
        
        // Parse tsc output to find failing files
        const lines = output.split('\n');
        for (const line of lines) {
            const match = line.match(/^([a-zA-Z0-9_\-\.\/]+)\(\d+,\d+\): error/);
            if (match) {
                failedFiles.add(match[1]);
            }
        }
        
        console.log(`Found errors in ${failedFiles.size} files.`);
        
        let restoredCount = 0;
        for (const file of failedFiles) {
            if (originalContents[file]) {
                const currentContent = fs.readFileSync(file, 'utf-8');
                if (currentContent !== originalContents[file]) {
                    fs.writeFileSync(file, originalContents[file], 'utf-8');
                    console.log(`Restored ${file}`);
                    restoredCount++;
                    // Remove from originalContents so we don't restore it again (or it doesn't matter)
                    delete originalContents[file];
                }
            }
        }
        
        if (restoredCount === 0) {
            console.log('No files restored in this iteration. The remaining errors are not caused by our replacements, or we cannot restore them. Aborting.');
            break;
        }
    }
}
