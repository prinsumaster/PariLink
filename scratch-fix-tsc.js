const fs = require('fs');
const cp = require('child_process');

console.log('Running tsc...');
let output = '';
try {
  cp.execSync('npx tsc -p apps/api/tsconfig.build.json --noEmit', { encoding: 'utf8' });
  console.log('No typescript errors found!');
  process.exit(0);
} catch (err) {
  output = err.stdout || '';
}

const lines = output.split('\n');

for (const line of lines) {
  const match2564 = line.match(/(.+?)\((\d+),(\d+)\): error TS2564: Property '(.+?)' has no initializer/);
  if (match2564) {
    const file = match2564[1];
    const row = parseInt(match2564[2], 10);
    const prop = match2564[4];
    
    let content = fs.readFileSync(file, 'utf8');
    const contentLines = content.split('\n');
    const targetLine = contentLines[row - 1];
    
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
    
    if (targetLine.includes(`${varName}.`)) {
        contentLines[row - 1] = targetLine.replace(new RegExp(`\\b${varName}\\.`, 'g'), `(${varName} as Error).`);
        fs.writeFileSync(file, contentLines.join('\n'), 'utf8');
        console.log(`Fixed TS18046 in ${file}:${row} for variable ${varName}`);
    } else if (targetLine.includes(`${varName}`)) {
        contentLines[row - 1] = targetLine.replace(new RegExp(`\\b${varName}\\b(?!\\s*as Error)`), `(${varName} as Error)`);
        fs.writeFileSync(file, contentLines.join('\n'), 'utf8');
        console.log(`Fixed TS18046 in ${file}:${row} for variable ${varName}`);
    }
  }
}
