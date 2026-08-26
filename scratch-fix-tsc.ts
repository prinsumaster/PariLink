import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';

// 1. Run tsc and capture output
console.log('Running tsc...');
let output = '';
try {
  cp.execSync('npx tsc -p apps/api/tsconfig.build.json --noEmit', { encoding: 'utf8' });
  console.log('No typescript errors found!');
  process.exit(0);
} catch (err: any) {
  output = err.stdout || '';
}

const lines = output.split('\n');

for (const line of lines) {
  // apps/api/src/ai/copilot/copilot.service.ts(149,60): error TS18046: 'e' is of type 'unknown'.
  // apps/api/src/ai/dto/ai.dto.ts(6,3): error TS2564: Property 'intent' has no initializer and is not definitely assigned in the constructor.
  
  const match2564 = line.match(/(.+?)\((\d+),(\d+)\): error TS2564: Property '(.+?)' has no initializer/);
  if (match2564) {
    const file = match2564[1];
    const row = parseInt(match2564[2], 10);
    const prop = match2564[4];
    
    let content = fs.readFileSync(file, 'utf8');
    const contentLines = content.split('\n');
    const targetLine = contentLines[row - 1];
    
    // Replace e.g. "  intent: string;" with "  intent!: string;"
    // We only want to add ! if it doesn't have it and it's not optional (?)
    if (!targetLine.includes('!') && !targetLine.includes('?') && targetLine.includes(prop)) {
        contentLines[row - 1] = targetLine.replace(new RegExp(`(\\s*${prop})\\s*:`), '$1!:');
        fs.writeFileSync(file, contentLines.join('\n'), 'utf8');
        console.log(`Fixed TS2564 in ${file}:${row} for property ${prop}`);
    }
  }

  const match18046 = line.match(/(.+?)\((\d+),(\d+)\): error TS18046: '(.+?)' is of type 'unknown'\./);
  if (match18046) {
    const file = match18046[1];
    const row = parseInt(match18046[2], 10);
    const varName = match18046[4];
    
    let content = fs.readFileSync(file, 'utf8');
    const contentLines = content.split('\n');
    const targetLine = contentLines[row - 1];
    
    // Replace "e.message" with "(e as Error).message" or similar
    if (targetLine.includes(`${varName}.`)) {
        // Find if it's caught
        contentLines[row - 1] = targetLine.replace(new RegExp(`\\b${varName}\\.`, 'g'), `(${varName} as Error).`);
        fs.writeFileSync(file, contentLines.join('\n'), 'utf8');
        console.log(`Fixed TS18046 in ${file}:${row} for variable ${varName}`);
    }
  }
}
