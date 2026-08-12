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
        "@Get(':id([0-9a-fA-F-]+)')": "@Get(':id')",
        "@Patch(':id([0-9a-fA-F-]+)')": "@Patch(':id')",
        "@Put(':id([0-9a-fA-F-]+)')": "@Put(':id')",
        "@Delete(':id([0-9a-fA-F-]+)')": "@Delete(':id')"
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
        console.log(`Reverted ${fullPath}`);
      }
    }
  }
}

processDir('./apps/api/src');
