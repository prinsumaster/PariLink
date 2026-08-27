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

const badImport = "import { money, num, dateIN } from '@/lib/format';\n";

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes("import { \nimport { money, num, dateIN } from '@/lib/format';")) {
    content = content.replace("import { \nimport { money, num, dateIN } from '@/lib/format';\n", "import { \n");
    // Place it safely on line 2 or 3
    if (content.includes('"use client"') || content.includes("'use client'")) {
       content = content.replace(/['"]use client['"];?\n/, "'use client';\n" + badImport);
    } else {
       content = badImport + content;
    }
    fs.writeFileSync(file, content);
    changed++;
  } else if (content.includes("import { money, num, dateIN } from '@/lib/format';\n") && !content.startsWith(badImport) && !content.includes("'use client';\nimport { money")) {
     // general cleanup
     content = content.replace("import { money, num, dateIN } from '@/lib/format';\n", "");
     if (content.includes('"use client"') || content.includes("'use client'")) {
       content = content.replace(/['"]use client['"];?\n?/, "'use client';\n" + badImport);
     } else {
       content = badImport + content;
     }
     fs.writeFileSync(file, content);
     changed++;
  }
});

console.log(`Fixed multi-line imports in ${changed} files.`);
