import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const models = Prisma.dmmf.datamodel.models;
  for (const model of models) {
    if (!model.fields.find(f => f.name === 'companyId')) continue;

    // Check relations that also have companyId
    for (const field of model.fields) {
      if (field.kind === 'object' && field.relationName && !field.isList) {
        const relatedModel = models.find(m => m.name === field.type);
        if (relatedModel && relatedModel.fields.find(f => f.name === 'companyId')) {
          const relationFields = field.relationFromFields;
          if (!relationFields || relationFields.length === 0) continue;
          
          const fkName = relationFields[0];
          
          console.log(`Checking ${model.name}.${fkName} -> ${relatedModel.name}...`);
          
          const query = `
            SELECT a.id, a."companyId" as "a_company", b."companyId" as "b_company"
            FROM "${model.name}" a
            JOIN "${relatedModel.name}" b ON a."${fkName}" = b.id
            WHERE a."companyId" != b."companyId"
          `;
          try {
            const badRows = await prisma.$queryRawUnsafe(query);
            if ((badRows as any).length > 0) {
              console.log(`❌ CORRUPTION FOUND in ${model.name}.${fkName}:`, badRows);
              const ids = (badRows as any).map(r => r.id).join("','");
              console.log(`Running DELETE FROM "${model.name}" WHERE id IN ('${ids}')`);
              await prisma.$executeRawUnsafe(`DELETE FROM "${model.name}" WHERE id IN ('${ids}')`);
            } else {
              console.log(`✅ OK`);
            }
          } catch (e) {
            console.log(`Skipping query: ${e.message}`);
          }
        }
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
