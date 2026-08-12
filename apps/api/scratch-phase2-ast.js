const fs = require('fs');
const glob = require('glob');

const tsFiles = glob.sync('/Users/vishalvirda/Desktop/PariLink/apps/api/src/**/*.service.ts');

let replacementsCount = 0;

tsFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // 1. replace `where: { id }` with `where: { id, companyId }`
    content = content.replace(/where:\s*\{\s*id\s*\}/g, 'where: { id, companyId }');
    
    // 2. replace `where: { id, updatedAt: ... }`
    content = content.replace(/where:\s*\{\s*id,\s*updatedAt:\s*([^ \}]+)\s*\}/g, 'where: { id, companyId, updatedAt: $1 }');

    // 3. update delete methods that use tx.model.update({ where: { id }, data: { deletedAt } })
    // We already replaced {id} above. But what about update() vs updateMany()?
    // Prisma requires update() to only use unique fields. `companyId` is not unique by itself.
    // So `{ id, companyId }` in `update` might cause TS errors if `id, companyId` is not a composite unique key.
    // Actually, `id` is the primary key. In Prisma, `update` where MUST be unique.
    // If we add `companyId` to `where` in `update`, Prisma might complain unless `@@unique([id, companyId])` exists.
    // Let's check schema.prisma!
});

console.log("AST Script loaded");
