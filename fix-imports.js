const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'apps/web/src'));
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const importStmt = "import { money, num, dateIN } from '@/lib/format';\n";
  
  if (content.startsWith(importStmt) && (content.includes('"use client"') || content.includes("'use client'"))) {
    // Remove it from the start
    content = content.replace(importStmt, '');
    
    // Find where 'use client' is
    const lines = content.split('\n');
    let clientIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"use client"') || lines[i].includes("'use client'")) {
        clientIdx = i;
        break;
      }
    }
    
    if (clientIdx !== -1) {
      lines.splice(clientIdx + 1, 0, importStmt.trim());
      fs.writeFileSync(file, lines.join('\n'));
      changed++;
    }
  }
});

console.log(`Fixed imports in ${changed} files.`);
