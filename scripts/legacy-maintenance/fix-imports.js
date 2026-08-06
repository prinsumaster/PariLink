const fs = require('fs');
const glob = require('glob');

const files = glob.sync('apps/api/src/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("new import('@nestjs/common')")) {
    const matches = [...content.matchAll(/new import\('@nestjs\/common'\)\.([A-Za-z]+)\(/g)];
    const classesToAdd = new Set();
    
    for (const match of matches) {
      classesToAdd.add(match[1]);
      content = content.replace(match[0], `new ${match[1]}(`);
    }

    if (classesToAdd.size > 0) {
      const importRegex = /import\s+{[^}]*}\s+from\s+['"]@nestjs\/common['"]/;
      const match = content.match(importRegex);
      if (match) {
        let importBlock = match[0];
        for (const cls of classesToAdd) {
          if (!importBlock.includes(cls)) {
            importBlock = importBlock.replace('{', `{ ${cls},`);
          }
        }
        content = content.replace(match[0], importBlock);
      } else {
        content = `import { ${Array.from(classesToAdd).join(', ')} } from '@nestjs/common';\n` + content;
      }
    }
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}
