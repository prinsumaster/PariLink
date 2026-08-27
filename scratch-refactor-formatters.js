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

files.forEach(file => {
  if (file.includes('format.ts')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace X.toLocaleString() logic
  // Be careful with templates like `${(x).toLocaleString()}`
  // Let's do it with specific patterns based on the grep output

  // We will run some custom replacements
  
  // 1. `₹${X.toLocaleString(...)k}` -> `money(X)`
  // Actually, we can just replace specific strings from the grep output.
  const replacements = [
    // kpi-cards.tsx
    ['`₹${(data.revenue.value / 1000).toLocaleString(\'en-IN\', { maximumFractionDigits: 1 })}k`', '`${money(data.revenue.value / 1000)}k`'],
    ['data.activeShipments.value.toLocaleString(\'en-IN\')', 'num(data.activeShipments.value)'],
    ['data.delayedShipments.value.toLocaleString(\'en-IN\')', 'num(data.delayedShipments.value)'],
    ['`₹${data.revenueToday.value.toLocaleString(\'en-IN\')}`', 'money(data.revenueToday.value)'],
    
    // shipment-panel.tsx
    ['{new Date(shipment.eta).toLocaleString(undefined, { \n                              month: \'short\', \n                              day: \'numeric\', \n                              hour: \'2-digit\', \n                              minute: \'2-digit\' \n                            })}', '{dateIN(shipment.eta)}'],
    
    // integration-card.tsx
    ['{new Date(lastSync).toLocaleString()}', '{dateIN(lastSync)}'],
    
    // alip-dashboard.tsx
    ['data?.health.activeDataStreams.toLocaleString()', 'num(data?.health.activeDataStreams)'],
    
    // predictive-insights.tsx
    ['+${(insight.potentialCostImpact ?? 0).toLocaleString()}', '+${num(insight.potentialCostImpact)}'],
    
    // file-upload.tsx
    ['${(bytes / 1024).toFixed(1)}', '${num(bytes / 1024)}'],
    ['${(bytes / (1024 * 1024)).toFixed(1)}', '${num(bytes / (1024 * 1024))}'],
    
    // invoice-form.tsx
    ['₹{lineTotal.toFixed(2)}', '{money(lineTotal)}'],
    ['₹{subtotal.toFixed(2)}', '{money(subtotal)}'],
    ['₹{taxTotal.toFixed(2)}', '{money(taxTotal)}'],
    ['₹{grandTotal.toFixed(2)}', '{money(grandTotal)}'],
    
    // invoice-table.tsx
    ['{new Date(row.original.issueDate || row.original.createdAt).toLocaleDateString(\'en-IN\')}', '{dateIN(row.original.issueDate || row.original.createdAt)}'],
    ['{new Date(row.original.dueDate).toLocaleDateString(\'en-IN\')}', '{dateIN(row.original.dueDate)}'],
    ['${grandTotal.toLocaleString()}', '{money(grandTotal, "$")}'],
    ['${balanceDue.toLocaleString()}', '{money(balanceDue, "$")}'],
    
    // invoice-detail-view.tsx
    ['{new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}', '{dateIN(invoice.issueDate || invoice.createdAt)}'],
    ['{new Date(invoice.dueDate).toLocaleDateString()}', '{dateIN(invoice.dueDate)}'],
    ['₹{(item.unitPrice ?? 0).toLocaleString()}', '{money(item.unitPrice)}'],
    ['₹{(item.total ?? 0).toLocaleString()}', '{money(item.total)}'],
    ['₹{(invoice.subtotal ?? 0).toLocaleString()}', '{money(invoice.subtotal)}'],
    ['₹{(invoice.taxTotal ?? 0).toLocaleString()}', '{money(invoice.taxTotal)}'],
    ['-${(invoice.discountTotal ?? 0).toLocaleString()}', '-{money(invoice.discountTotal, "$")}'],
    ['₹{(invoice.grandTotal ?? invoice.amount ?? 0).toLocaleString()}', '{money(invoice.grandTotal ?? invoice.amount)}'],
    
    // document-upload-modal.tsx
    ['{(file.size / 1024 / 1024).toFixed(2)}', '{num(file.size / 1024 / 1024)}'],
    
    // document-library.tsx
    ['parseFloat((bytes / Math.pow(k, i)).toFixed(2))', 'parseFloat(num(bytes / Math.pow(k, i)))'],
    ['{new Date(row.original.createdAt).toLocaleDateString()}', '{dateIN(row.original.createdAt)}'],
    
    // document-viewer.tsx
    ['{new Date(document.createdAt).toLocaleDateString()}', '{dateIN(document.createdAt)}'],
    
    // order-detail-view.tsx
    ['{new Date(order.estimatedPickupDate).toLocaleDateString()}', '{dateIN(order.estimatedPickupDate)}'],
    ['{(order.totalWeight ?? 0).toLocaleString()}', '{num(order.totalWeight)}'],
    ['{new Date(order.estimatedDeliveryDate).toLocaleDateString()}', '{dateIN(order.estimatedDeliveryDate)}'],
    ['₹{(item.value ?? 0).toLocaleString()}', '{money(item.value)}'],
    ['₹{(order.totalValue ?? 0).toLocaleString()}', '{money(order.totalValue)}'],
    
    // order-table.tsx
    ['{(row.original.totalWeight ?? 0).toLocaleString()}', '{num(row.original.totalWeight)}'],
    
    // vehicle-table.tsx
    ['row.getValue<number>(\'odometer\')?.toLocaleString() ?? \'0\'', 'num(row.getValue<number>(\'odometer\'))'],
    
    // vehicle-detail-view.tsx
    ['{vehicle.odometer?.toLocaleString() ?? \'0\'}', '{num(vehicle.odometer)}'],
    ['{vehicle.engineHours?.toLocaleString() ?? \'0\'}', '{num(vehicle.engineHours)}'],
    ['{(vehicle.capacity || 0).toLocaleString()}', '{num(vehicle.capacity)}'],
    
    // maintenance-timeline.tsx
    ['{(record.odometerReading ?? 0).toLocaleString()}', '{num(record.odometerReading)}'],
    ['₹{(record.cost ?? 0).toLocaleString()}', '{money(record.cost)}'],
    ['{new Date(record.scheduledDate).toLocaleDateString()}', '{dateIN(record.scheduledDate)}'],
    ['{new Date(record.completedDate).toLocaleDateString()}', '{dateIN(record.completedDate)}'],
    
    // document-manager.tsx
    ['{new Date(doc.expiryDate).toLocaleDateString()}', '{dateIN(doc.expiryDate)}'],
    
    // trip-detail-view.tsx
    ['trip.startDate ? new Date(trip.startDate).toLocaleString() : \'Not Set\'', 'trip.startDate ? dateIN(trip.startDate) : \'Not Set\''],
    ['trip.endDate ? new Date(trip.endDate).toLocaleString() : \'Not Set\'', 'trip.endDate ? dateIN(trip.endDate) : \'Not Set\''],
    ['{new Date(trip.createdAt).toLocaleString()}', '{dateIN(trip.createdAt)}'],
    ['trip.startDate ? new Date(trip.startDate).toLocaleString() : \'Just now\'', 'trip.startDate ? dateIN(trip.startDate) : \'Just now\''],
    
    // trip-table.tsx
    ['new Date(date as string).toLocaleDateString(\'en-IN\')', 'dateIN(date)'],
    
    // notification-center.tsx
    ['{new Date(notif.createdAt).toLocaleDateString()}', '{dateIN(notif.createdAt)}'],
    ['{new Date(notif.createdAt).toLocaleTimeString([], {hour: \'2-digit\', minute:\'2-digit\'})}', '{dateIN(notif.createdAt)}'],
    
    // revenue-chart.tsx
    ['`₹${value.toLocaleString()}`', 'money(value)'],
    
    // reports-dashboard.tsx
    ['{(row.deliveries ?? 0).toLocaleString()}', '{num(row.deliveries)}'],
    ['₹{(row.revenue ?? 0).toLocaleString()}', '{money(row.revenue)}'],
    
    // kpi-cards.tsx
    ['`₹${Number(kpi.value).toLocaleString()}`', 'money(kpi.value)']
  ];

  replacements.forEach(([find, replace]) => {
    content = content.replace(find, replace);
  });

  if (content !== originalContent) {
    // Add import statement if not already present
    if (!content.includes("import { money, num, dateIN } from '@/lib/format'")) {
      const importStmt = "import { money, num, dateIN } from '@/lib/format';\n";
      // Find the first line after imports
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
    console.log(`Updated ${file}`);
    changedFiles++;
  }
});

console.log(`Changed ${changedFiles} files.`);
