const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./apps/api/src');
let replacedCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace "@Body() varName: any" with "@Body() varName: Record<string, unknown>"
  const regex = /@Body\(\)\s+([a-zA-Z0-9_]+)\s*:\s*any/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '@Body() $1: Record<string, unknown>');
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Replaced @Body() any in ${replacedCount} files.`);
