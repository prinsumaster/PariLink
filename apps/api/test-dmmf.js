const { Prisma } = require('@prisma/client');

function injectSoftDelete(args, modelName) {
  if (!args) return;
  
  const model = Prisma.dmmf.datamodel.models.find(m => m.name === modelName);
  if (!model) return;
  
  const hasDeletedAt = model.fields.some(f => f.name === 'deletedAt');
  
  if (hasDeletedAt) {
    if (!args.where) {
      args.where = { deletedAt: null };
    } else if (args.where.deletedAt === undefined) {
      args.where.deletedAt = null;
    }
  }
  
  if (args.include) {
    for (const key of Object.keys(args.include)) {
      const val = args.include[key];
      const field = model.fields.find(f => f.name === key);
      if (field && field.kind === 'object') {
        if (val === true) {
          args.include[key] = {};
          injectSoftDelete(args.include[key], field.type);
        } else if (typeof val === 'object') {
          injectSoftDelete(val, field.type);
        }
      }
    }
  }
  
  if (args.select) {
    for (const key of Object.keys(args.select)) {
      const val = args.select[key];
      const field = model.fields.find(f => f.name === key);
      if (field && field.kind === 'object') {
        if (val === true) {
          args.select[key] = {};
          injectSoftDelete(args.select[key], field.type);
        } else if (typeof val === 'object') {
          injectSoftDelete(val, field.type);
        }
      }
    }
  }
}

const args = {
  where: { id: 'trip123' },
  include: {
    loads: true,
    driver: {
      select: { vehicles: true, name: true }
    }
  }
};

injectSoftDelete(args, 'Trip');
console.log(JSON.stringify(args, null, 2));
