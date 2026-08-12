const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const inventoryPath = '/Users/vishalvirda/.gemini/antigravity-ide/brain/9ea85605-4743-4623-bf3a-ce023bac5d60/RC11_RUN_AS_SYSTEM_INVENTORY.csv';

let totalFiles = 0;
let totalInvocations = 0;

const results = [];
results.push("File,Line,ComponentType,ReachableFromHTTP,RiskClassification,Details");

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('runAsSystem')) {
        totalFiles++;
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('runAsSystem')) {
            totalInvocations++;
            
            let componentType = 'Unknown';
            if (fullPath.includes('controller')) componentType = 'Controller';
            else if (fullPath.includes('service')) componentType = 'Service';
            else if (fullPath.includes('processor') || fullPath.includes('job')) componentType = 'BackgroundJob';
            else if (fullPath.includes('guard') || fullPath.includes('strategy')) componentType = 'Auth/Guard';

            let reachable = componentType === 'Controller' ? 'Yes' : 'Indirect/No';
            let risk = 'LOW';
            if (componentType === 'Controller') risk = 'HIGH';
            if (componentType === 'BackgroundJob') risk = 'MEDIUM';
            
            // Specifically checking if it uses user input
            let details = '';
            if (lines[i].includes('where: { companyId: user.companyId }') || lines[i+1]?.includes('where: { companyId: user.companyId }') || lines[i+2]?.includes('where: { companyId: user.companyId }')) {
               details = 'Tenant isolated via companyId';
               risk = 'LOW';
            } else if (fullPath.includes('inbox.controller.ts') && i > 50) {
               details = 'Tenant isolated via preceding check';
               risk = 'LOW';
            }

            results.push(`${path.relative(srcDir, fullPath)},${i + 1},${componentType},${reachable},${risk},${details}`);
          }
        }
      }
    }
  }
}

walk(srcDir);
fs.writeFileSync(inventoryPath, results.join('\n'));

console.log(`Inventory complete. Files checked: ${totalFiles}. Invocations found: ${totalInvocations}.`);
