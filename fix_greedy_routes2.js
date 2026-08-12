const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.controller.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const replacements = {
        "@Get(':id([0-9a-fA-F-]{36})')": "@Get(':id([0-9a-fA-F-]+)')",
        "@Patch(':id([0-9a-fA-F-]{36})')": "@Patch(':id([0-9a-fA-F-]+)')",
        "@Put(':id([0-9a-fA-F-]{36})')": "@Put(':id([0-9a-fA-F-]+)')",
        "@Delete(':id([0-9a-fA-F-]{36})')": "@Delete(':id([0-9a-fA-F-]+)')"
      };
      
      let modified = false;
      for (const [key, value] of Object.entries(replacements)) {
        if (content.includes(key)) {
          content = content.split(key).join(value);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('./apps/api/src');
