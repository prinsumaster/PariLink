const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps/web/src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

let changedFiles = 0;

const ignoreFiles = ['format.ts', 'count-up.tsx', 'CountUp'];

files.forEach(file => {
  if (ignoreFiles.some(ignore => file.includes(ignore))) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Simple specific replaces based on the grep
  const replaces = [
    [/\{\(\(metrics\.totalCompletionTokens \?\? 0\) \/ 1000\)\.toFixed\(0\)\}K/g, '{num((metrics.totalCompletionTokens ?? 0) / 1000)}K'],
    [/\{\(metrics\.feedbackSummary\?\.totalRatings \?\? 0\)\.toLocaleString\(\)\}/g, '{num(metrics.feedbackSummary?.totalRatings)}'],
    [/\{callCount\.toLocaleString\(\)\}/g, '{num(callCount)}'],
    [/\{new Date\(r\.date\)\.toLocaleString\(\)\}/g, '{dateIN(r.date)}'],
    [/₹\{\(stats\.totalSpend \?\? 0\)\.toLocaleString\(\)\}/g, '₹{money(stats.totalSpend)}'],
    [/₹\{\(stats\.projectedSpend \?\? 0\)\.toLocaleString\(\)\}/g, '₹{money(stats.projectedSpend)}'],
    [/₹\{\(stats\.budgetRemaining \?\? 0\)\.toLocaleString\(\)\}/g, '₹{money(stats.budgetRemaining)}'],
    [/₹\{\(stats\.avgCostPerQuery \?\? 0\)\.toFixed\(4\)\}/g, '₹{num(stats.avgCostPerQuery)}'],
    [/₹\{\(mc\.spend \?\? 0\)\.toLocaleString\(\)\}/g, '₹{money(mc.spend)}'],
    [/\{\(agent\.tasksCompleted \?\? 0\)\.toLocaleString\(\)\}/g, '{num(agent.tasksCompleted)}'],
    [/₹\{\(model\.costPer1kTokens \?\? 0\)\.toFixed\(3\)\}/g, '₹{num(model.costPer1kTokens)}'],
    [/\{\(metrics\.totalInteractions \?\? 0\)\.toLocaleString\(\)\}/g, '{num(metrics.totalInteractions)}'],
    [/\{\(\(\(metrics\.totalPromptTokens \|\| 0\) \+ \(metrics\.totalCompletionTokens \|\| 0\)\) \/ 1000000\)\.toFixed\(1\)\}M/g, '{num(((metrics.totalPromptTokens || 0) + (metrics.totalCompletionTokens || 0)) / 1000000)}M'],
    [/\{\(\(metrics\.hallucinationReports \|\| 0\) \/ Math\.max\(1, metrics\.totalInteractions \|\| 1\) \* 100\)\.toFixed\(2\)\}%/g, '{num((metrics.hallucinationReports || 0) / Math.max(1, metrics.totalInteractions || 1) * 100)}%'],
    [/\{\(metrics\.feedbackSummary\?\.averageRating \|\| 0\)\.toFixed\(1\)\}/g, '{num(metrics.feedbackSummary?.averageRating)}'],
    [/\{new Date\(item\.createdAt\)\.toLocaleDateString\(\)\}/g, '{dateIN(item.createdAt)}'],
    [/parseFloat\(\(bytes \/ Math\.pow\(k, i\)\)\.toFixed\(\w+\)\)/g, 'parseFloat(num(bytes / Math.pow(k, i)))'],
    [/₹\{invoice\.amount\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}/g, '{money(invoice.amount)}'],
    [/\$\{invoice\.amount\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}/g, '{money(invoice.amount)}'],
    [/₹\{\(row\.getValue\('amount'\) as number\)\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}/g, '{money(row.getValue("amount"))}'],
    [/\$\{((data as any)\?.meta\?.total \?\? (data as any)\?.total \?\? 0)\.toLocaleString\(\)\} invoices`/g, '${num((data as any)?.meta?.total ?? (data as any)?.total)} invoices`'],
    [/₹\{metrics\?\.revenue\?\.value\?\.toLocaleString\(\) \|\| '0'\}/g, '{money(metrics?.revenue?.value)}'],
    [/\{metrics\?\.fleetUtilization\?\.percentage\?\.toFixed\(1\) \|\| '0'\}/g, '{num(metrics?.fleetUtilization?.percentage)}'],
    [/\{Math\.abs\(trend!\)\.toFixed\(1\)\}%/g, '{num(Math.abs(trend!))}%'],
    [/\{new Date\(v\.boost\.boostExpiresAt\)\.toLocaleDateString\(\)\}/g, '{dateIN(v.boost.boostExpiresAt)}'],
    [/\{app\.rating\?\.toFixed\(1\) \|\| 'New'\}/g, '{num(app.rating) || "New"}'],
    [/\{ver\.releaseDate\.toLocaleDateString\(undefined, \{ year: 'numeric', month: 'short', day: 'numeric' \}\)\}/g, '{dateIN(ver.releaseDate)}'],
    [/₹\{\(customer\.billing\?\.creditLimit \|\| 0\)\.toLocaleString\(\)\}/g, '{money(customer.billing?.creditLimit)}'],
    [/\$\{\(customer\.billing\?\.outstandingBalance \|\| 0\)\.toLocaleString\(\)\}/g, '{money(customer.billing?.outstandingBalance, "$")}'],
    [/₹\{\(\(customer\.metrics\?\.totalRevenue \|\| 0\) \/ 1000\)\.toFixed\(1\)\}k/g, '{money((customer.metrics?.totalRevenue || 0) / 1000)}k'],
    [/\{new Date\(customer\.metrics\.lastOrderDate\)\.toLocaleDateString\(\)\}/g, '{dateIN(customer.metrics.lastOrderDate)}'],
    [/\$\{bal\.toLocaleString\(\)\}/g, '{money(bal, "$")}'],
    [/\$\{row\.original\.metrics\?\.totalRevenue\?\.toLocaleString\(\) \|\| '0'\}/g, '{money(row.original.metrics?.totalRevenue, "$")}'],
    [/\{\(metrics\.businessHealth \?\? 0\)\.toFixed\(1\)\}/g, '{num(metrics.businessHealth)}'],
    [/\{\(metrics\.predictedSla \?\? 0\)\.toFixed\(1\)\}/g, '{num(metrics.predictedSla)}'],
    [/\{new Date\(shipment\.eta\)\.toLocaleString\(undefined, \{[^\}]+\}\)\}/g, '{dateIN(shipment.eta)}'],
    [/`\$\{.*?toLocaleString.*?invoices`/g, '`${num(((data as any)?.meta?.total ?? (data as any)?.total))} invoices`'], // hack for billing
    [/\(warehouse\.capacity\?\.availablePallets \?\? 0\)\.toLocaleString\(\)/g, 'num(warehouse.capacity?.availablePallets)'],
    [/\(warehouse\.capacity\?\.totalPallets \?\? 0\)\.toLocaleString\(\)/g, 'num(warehouse.capacity?.totalPallets)'],
    [/\(warehouse\.capacity\?\.totalSquareFeet \?\? 0\)\.toLocaleString\(\)/g, 'num(warehouse.capacity?.totalSquareFeet)'],
    [/available\.toLocaleString\(\)/g, 'num(available)'],
    [/`₹\$\{Number\(watch\('rate'\)\)\.toLocaleString\('en-US', \{ minimumFractionDigits: 2 \}\)\}`/g, 'money(watch("rate"))']
  ];

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
    fs.writeFileSync(file, content);
    changedFiles++;
  }
});

console.log(`Changed ${changedFiles} files.`);
