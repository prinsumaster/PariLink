import { PrismaClient } from '@prisma/client';

async function run() {
    const prisma = new PrismaClient();
    try {
        await prisma.customer.update({
            where: {
                id: 'some-id',
                companyId: 'some-company'
            },
            data: {
                name: 'Test'
            }
        });
        console.log("Compiled successfully!");
    } catch(e) {
        console.error("Runtime error (expected because DB might not have this ID):", e.message);
    }
}
run();
