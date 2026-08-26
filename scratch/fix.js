const fs = require('fs');
const glob = require('glob');
const { execSync } = require('child_process');

const files = glob.sync('apps/api/src/**/*.ts', { ignore: ['**/*.spec.ts', '**/prisma.service.ts'] });

// Strategy to apply
const SEARCH_STR = /\.runAsSystem\('System operation or legacy bypass',/g;
const REPLACE_STR = `.runAsTenant(payload.companyId,`;
const RESTORE_STR = `.runAsSystem('System operation or legacy bypass',`;

let replacedFiles = new Set();

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    if (!content.includes('runAsSystem')) continue;

    let newContent = content.replace(SEARCH_STR, REPLACE_STR);
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf-8');
        replacedFiles.add(file);
    }
}

console.log(`Replaced in ${replacedFiles.size} files.`);

let hasErrors = true;
let iteration = 0;

while (hasErrors && iteration < 20) {
    iteration++;
    console.log(`\nRunning tsc (Iteration ${iteration})...`);
    try {
        execSync('npx tsc --noEmit -p apps/api/tsconfig.json', { stdio: 'pipe' });
        console.log('Build succeeded!');
        hasErrors = false;
    } catch (err) {
        const output = err.stdout ? err.stdout.toString() : err.message;
        
        let restoredCount = 0;
        const lines = output.split('\n');
        
        // Group errors by file
        const errorsByFile = {};
        for (const line of lines) {
            const match = line.match(/^([a-zA-Z0-9_\-\.\/]+)\((\d+),\d+\): error/);
            if (match) {
                const file = match[1];
                const lineNum = parseInt(match[2], 10);
                if (!errorsByFile[file]) errorsByFile[file] = [];
                errorsByFile[file].push(lineNum);
            }
        }
        
        console.log(`Found errors in ${Object.keys(errorsByFile).length} files.`);
        
        for (const [file, lineNums] of Object.entries(errorsByFile)) {
            if (!fs.existsSync(file)) continue;
            
            let contentLines = fs.readFileSync(file, 'utf-8').split('\n');
            let modified = false;
            
            for (const lineNum of lineNums) {
                // Search up to 10 lines backwards for REPLACE_STR
                for (let i = lineNum - 1; i >= Math.max(0, lineNum - 10); i--) {
                    if (contentLines[i] && contentLines[i].includes(REPLACE_STR)) {
                        contentLines[i] = contentLines[i].replace(REPLACE_STR, RESTORE_STR);
                        modified = true;
                        restoredCount++;
                        break;
                    }
                }
            }
            
            if (modified) {
                fs.writeFileSync(file, contentLines.join('\n'), 'utf-8');
            }
        }
        
        console.log(`Restored ${restoredCount} instances.`);
        if (restoredCount === 0) {
            console.log('No instances restored in this iteration. Aborting to prevent infinite loop.');
            console.log('Sample errors:');
            console.log(lines.slice(0, 20).join('\n'));
            break;
        }
    }
}
