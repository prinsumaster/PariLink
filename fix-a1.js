const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Regex to match runAsSystem('...', async (tx) => { ... })
  // We need to match the outer runAsSystem call. This can be tricky with regex if there are nested parentheses.
  // Let's use a simple string replacement approach combined with indexOf and balanced parenthesis check.
  
  // Actually, wait, replacing runAsSystem('...', async (tx) => { ... }) is hard with pure string indexing.
  // Instead, let's use a regex to find all runAsSystem calls.
  // runAsSystem('System operation or legacy bypass', async (tx) =>
  // But wait, the companyId could be on the next line!
  // Let's just use a simple regex for now. If it has `companyId` in the next few lines, replace it.

  // Let's iterate through lines.
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("runAsSystem('System operation or legacy bypass', async (tx) =>")) {
      // Look ahead to see if companyId is used in the next 15 lines (assuming short bodies)
      let usesCompanyId = false;
      let openBraces = 0;
      let closedBraces = 0;
      // We can't perfectly track scopes, but if 'companyId' appears before the end of the arrow function, we can replace it.
      for (let j = i; j < Math.min(i + 30, lines.length); j++) {
        if (lines[j].includes('companyId')) {
          usesCompanyId = true;
          break;
        }
      }
      
      if (usesCompanyId) {
        lines[i] = lines[i].replace("runAsSystem('System operation or legacy bypass', async (tx) =>", "runAsTenant(companyId, async (tx) =>");
        changed = true;
      }
    } else if (lines[i].includes("runAsSystem('System operation or legacy bypass', async (tx) => {")) {
       // Just in case it has an open brace
       let usesCompanyId = false;
      for (let j = i; j < Math.min(i + 30, lines.length); j++) {
        if (lines[j].includes('companyId')) {
          usesCompanyId = true;
          break;
        }
      }
      
      if (usesCompanyId) {
        lines[i] = lines[i].replace("runAsSystem('System operation or legacy bypass', async (tx) => {", "runAsTenant(companyId, async (tx) => {");
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

walkDir(process.argv[2]);
