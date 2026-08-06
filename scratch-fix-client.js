const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.startsWith('import { api } from \'@/services/api\';\n\n\'use client\';')) {
        content = content.replace('import { api } from \'@/services/api\';\n\n\'use client\';', '\'use client\';\n\nimport { api } from \'@/services/api\';');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('/Users/vishalvirda/Desktop/PariLink/apps/web/src/app');
