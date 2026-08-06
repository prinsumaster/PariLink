const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        console.log(`[Ext] Model: ${model}, Op: ${operation}`);
        return query(args);
      },
    },
  },
});

async function main() {
  try {
    await prisma.trip.findFirst({
      where: { id: 'some-id' },
      include: { loads: true }
    });
  } catch (e) {
    console.error(e.message);
  }
}

main();
