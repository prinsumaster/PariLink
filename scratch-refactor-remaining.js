const fs = require('fs');
const path = require('path');

const files = [
  'apps/web/src/app/(dashboard)/loads/[id]/page.tsx',
  'apps/web/src/app/(dashboard)/loads/page.tsx',
  'apps/web/src/app/(dashboard)/vendors/page.tsx',
  'apps/web/src/app/(dashboard)/payments/page.tsx',
  'apps/web/src/app/(dashboard)/inbox/page.tsx',
  'apps/web/src/app/(dashboard)/trailers/page.tsx',
  'apps/web/src/app/(dashboard)/admin/audit/page.tsx',
  'apps/web/src/app/(dashboard)/announcements/page.tsx',
  'apps/web/src/app/(dashboard)/operations/logs/page.tsx',
  'apps/web/src/app/(dashboard)/operations/page.tsx',
  'apps/web/src/app/(dashboard)/operations/incidents/page.tsx',
  'apps/web/src/app/(dashboard)/ai/command-center/page.tsx'
];

const replaces = [
  [/load\.weight\.toLocaleString\(\)/g, 'num(load.weight)'],
  [/`₹\$\{load\.rate\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}`/g, 'money(load.rate)'],
  [/`₹\$\{load\.cost\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}`/g, 'money(load.cost)'],
  [/`₹\{\(load\.rate - load\.cost\)\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}`/g, 'money(load.rate - load.cost)'],
  [/₹\{\(inv\.amount \?\? 0\)\.toFixed\(2\)\}/g, '₹{money(inv.amount, "")}'],
  [/\$\{load\.rate\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}/g, '{money(load.rate, "$")}'],
  [/₹\{load\.rate\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}/g, '{money(load.rate)}'],
  [/\$\{\(\(\(data as any\)\.meta\?\.total\) \?\? 0\)\.toLocaleString\(\)\} vendors`/g, '${num((data as any).meta?.total)} vendors`'],
  [/\$\{\(\(data as any\)\?\.meta\?\.total \?\? \(data as any\)\?\.total \?\? 0\)\.toLocaleString\(\)\} payments recorded`/g, '${num((data as any)?.meta?.total ?? (data as any)?.total)} payments recorded`'],
  [/\{new Date\(thread\.updatedAt\)\.toLocaleDateString\(\)\}/g, '{dateIN(thread.updatedAt)}'],
  [/\{\(trailer\.capacityWeight \?\? 0\)\.toLocaleString\(\)\}/g, '{num(trailer.capacityWeight)}'],
  [/\{new Date\(log\.createdAt\)\.toLocaleString\(\)\}/g, '{dateIN(log.createdAt)}'],
  [/\{new Date\(ann\.createdAt\)\.toLocaleDateString\(\)\}/g, '{dateIN(ann.createdAt)}'],
  [/\{new Date\(group\.firstSeen\)\.toLocaleString\(\)\}/g, '{dateIN(group.firstSeen)}'],
  [/new Date\(group\.lastSeen\)\.toLocaleString\(\)/g, 'dateIN(group.lastSeen)'],
  [/\{new Date\(health\.timestamp\)\.toLocaleString\(\)\}/g, '{dateIN(health.timestamp)}'],
  [/\{new Date\(inc\.createdAt\)\.toLocaleString\(\)\}/g, '{dateIN(inc.createdAt)}'],
  [/`₹\$\{\(metrics\.totalCostUsd \?\? 0\)\.toFixed\(2\)\}`/g, 'money(metrics.totalCostUsd)'],
  [/\{totalAgentCalls\.toLocaleString\(\)\}/g, '{num(totalAgentCalls)}'],
  [/\{calls\.toLocaleString\(\)\}/g, '{num(calls)}'],
  [/₹\{\(data\.cost \?\? 0\)\.toFixed\(2\)\}/g, '₹{money(data.cost, "")}'],
  [/\{\(data\.calls \?\? 0\)\.toLocaleString\(\)\}/g, '{num(data.calls)}'],
  [/\{\(\(metrics\.totalPromptTokens \?\? 0\) \/ 1000\)\.toFixed\(0\)\}/g, '{num((metrics.totalPromptTokens ?? 0) / 1000)}']
];

let changedFiles = 0;

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;

  replaces.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    if (!content.includes("import { money, num, dateIN } from '@/lib/format'")) {
      const importStmt = "import { money, num, dateIN } from '@/lib/format';\n";
      const lines = content.split('\n');
      let lastImportIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIdx = i;
        }
      }
      if (lastImportIdx === -1) {
        content = importStmt + content;
      } else {
        lines.splice(lastImportIdx + 1, 0, importStmt);
        content = lines.join('\n');
      }
    }
    fs.writeFileSync(fullPath, content);
    changedFiles++;
  }
});

console.log(`Changed ${changedFiles} files.`);
