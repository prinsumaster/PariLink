import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { PrismaService } from '../../prisma/prisma.service';

export const createCopilotTools = (
  prisma: PrismaService,
  companyId: string,
) => {
  return [
    new DynamicStructuredTool({
      name: 'search_trips',
      description:
        'Search for logistics trips based on status, driver, or vehicle. Use this to find active or completed trips.',
      schema: z.object({
        status: z
          .string()
          .optional()
          .describe('Filter by status like IN_PROGRESS, COMPLETED, SCHEDULED'),
        limit: z
          .number()
          .optional()
          .default(5)
          .describe('Max results to return'),
      }),
      func: async ({ status, limit }) => {
        const results = await prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.findMany({
            where: { ...(status ? { status } : {}) },
            take: limit,
            include: { driver: true, vehicle: true },
          }),
        );
        return JSON.stringify(results);
      },
    }),
    new DynamicStructuredTool({
      name: 'search_drivers',
      description:
        'Search for drivers in the fleet. Can filter by status (ACTIVE, OFF_DUTY).',
      schema: z.object({
        status: z.string().optional(),
        limit: z.number().optional().default(5),
      }),
      func: async ({ status, limit }) => {
        const results = await prisma.runAsTenant(companyId, async (tx) =>
          tx.driver.findMany({
            where: { ...(status ? { status } : {}) },
            take: limit,
          }),
        );
        return JSON.stringify(results);
      },
    }),
    new DynamicStructuredTool({
      name: 'search_vehicles',
      description: 'Search for vehicles/trucks in the fleet.',
      schema: z.object({
        status: z.string().optional(),
        limit: z.number().optional().default(5),
      }),
      func: async ({ status, limit }) => {
        const results = await prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.findMany({
            where: { ...(status ? { status } : {}) },
            take: limit,
          }),
        );
        return JSON.stringify(results);
      },
    }),
    new DynamicStructuredTool({
      name: 'search_customers',
      description: 'Search for customers/shippers.',
      schema: z.object({
        limit: z.number().optional().default(5),
      }),
      func: async ({ limit }) => {
        const results = await prisma.runAsTenant(companyId, async (tx) =>
          tx.customer.findMany({
            take: limit,
          }),
        );
        return JSON.stringify(results);
      },
    }),
    new DynamicStructuredTool({
      name: 'search_loads',
      description: 'Search for freight loads/orders.',
      schema: z.object({
        status: z.string().optional(),
        limit: z.number().optional().default(5),
      }),
      func: async ({ status, limit }) => {
        const results = await prisma.runAsTenant(companyId, async (tx) =>
          tx.load.findMany({
            where: { ...(status ? { status } : {}) },
            take: limit,
            include: { customer: true },
          }),
        );
        return JSON.stringify(results);
      },
    }),
    new DynamicStructuredTool({
      name: 'search_invoices',
      description: 'Search for financial invoices.',
      schema: z.object({
        status: z.string().optional(),
        limit: z.number().optional().default(5),
      }),
      func: async ({ status, limit }) => {
        const results = await prisma
          .runAsTenant(companyId, async (tx) =>
            (tx as any).invoice.findMany({
              where: { ...(status ? { status } : {}) },
              take: limit,
            }),
          )
          .catch(() => []); // Fail safely if invoice model varies
        return JSON.stringify(results);
      },
    }),
  ];
};
