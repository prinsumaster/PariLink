const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("runAsSystem('System operation or legacy bypass'")) {
      let usesTenantId = false;
      for (let j = i; j < Math.min(i + 30, lines.length); j++) {
        if (/\btenantId\b/.test(lines[j])) {
          usesTenantId = true;
          break;
        }
      }
      
      if (usesTenantId) {
        lines[i] = lines[i].replace("runAsSystem('System operation or legacy bypass', async (tx) =>", "runAsTenant(tenantId, async (tx) =>");
        lines[i] = lines[i].replace("runAsSystem('System operation or legacy bypass', async (tx) => {", "runAsTenant(tenantId, async (tx) => {");
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

process.argv.slice(2).forEach(walkDir);
