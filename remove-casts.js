const fs = require('fs');
const path = require('path');

const servicePath = path.join(__dirname, 'apps/api/src/lorry-receipts/lorry-receipts.service.ts');
let service = fs.readFileSync(servicePath, 'utf-8');

service = service.replace(/\(tx as any\)\.lrSequence/g, 'tx.lrSequence');
service = service.replace(/\(tx as any\)\.lorryReceipt/g, 'tx.lorryReceipt');
service = service.replace(/\(this\.prisma as any\)\.lorryReceipt/g, 'this.prisma.lorryReceipt');

fs.writeFileSync(servicePath, service);
console.log('Removed casts');
