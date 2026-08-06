const fs = require('fs');
const path = require('path');

function findFiles(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = dir + '/' + file;
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filter, fileList);
    } else if (filePath.endsWith(filter)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const services = findFiles('./apps/api/src', '.service.ts');
services.forEach(file => {
  if (file.includes('prisma') || file.includes('crm-lead.service.ts') === false && !file.includes('gst-engine') && !file.includes('fastag') && !file.includes('bank-sync') && !file.includes('permit-compliance') && !file.includes('payroll') && !file.includes('attendance')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('prisma/prisma.service')) {
    const depth = file.split('/').length - 5;
    const prismaPath = '../'.repeat(depth) + 'prisma/prisma.service';
    content = content.replace(/import \{ PrismaService \} from '.*';/, `import { PrismaService } from '${prismaPath}';`);
  }
  fs.writeFileSync(file, content);
});

const controllers = findFiles('./apps/api/src', '.controller.ts');
controllers.forEach(file => {
  if (!file.includes('crm') && !file.includes('gst') && !file.includes('fastag') && !file.includes('bank-statement') && !file.includes('permit') && !file.includes('payroll') && !file.includes('attendance')) return;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('auth/guards/jwt-auth.guard')) {
    const depth = file.split('/').length - 5;
    const authPath = '../'.repeat(depth) + 'auth/guards/jwt-auth.guard';
    content = content.replace(/import \{ JwtAuthGuard \} from '.*';/, `import { JwtAuthGuard } from '${authPath}';`);
  }
  fs.writeFileSync(file, content);
});
console.log('Fixed imports!');
