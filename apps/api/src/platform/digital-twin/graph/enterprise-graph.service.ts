import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Node within the Digital Twin Enterprise Graph
 */
export interface TwinNode {
  id: string;
  type: string; // e.g., 'COMPANY', 'WAREHOUSE', 'VEHICLE', 'TRIP'
  state: Record<string, unknown>;
  healthScore?: number;
  riskScore?: number;
  dependencies: string[]; // IDs of related nodes
}

@Injectable()
export class EnterpriseGraphService {
  private readonly logger = new Logger(EnterpriseGraphService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Semantically traverses the graph starting from a root entity.
   * Enables the AI to reason across the Twin contextually.
   */
  async traverseContext(
    companyId: string,
    rootId: string,
    depth: number = 2,
  ): Promise<TwinNode[]> {
    this.logger.debug(
      `[Graph] Traversing context for ${rootId} to depth ${depth}`,
    );
    // In a production system, this would query a dedicated Graph DB (Neo4j) or execute recursive CTEs in Postgres.
    // For this implementation, we simulate fetching the semantic map from the materialized TwinSnapshot.

    const rootSnapshot = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.twinSnapshot.findFirst({
        where: { companyId, twinId: rootId },
        orderBy: { timestamp: 'desc' },
      }),
    );

    if (!rootSnapshot) {
      return [];
    }

    const rootNode: TwinNode = {
      id: rootSnapshot.twinId,
      type: rootSnapshot.twinType,
      state: rootSnapshot.state as Record<string, unknown>,
      dependencies:
        ((rootSnapshot.state as Record<string, unknown>)
          ?.relatedEntityIds as string[]) || [],
    };

    const graph: TwinNode[] = [rootNode];

    // MVP: Traverse 1 level deep for demonstration
    if (depth > 0 && rootNode.dependencies.length > 0) {
      const relatedSnapshots = await this.prisma.runAsTenant(
        companyId,
        async (tx) =>
          tx.twinSnapshot.findMany({
            where: { companyId, twinId: { in: rootNode.dependencies } },
            distinct: ['twinId'],
            orderBy: { timestamp: 'desc' },
          }),
      );

      relatedSnapshots.forEach((snap) => {
        graph.push({
          id: snap.twinId,
          type: snap.twinType,
          state: snap.state as Record<string, unknown>,
          dependencies:
            ((snap.state as Record<string, unknown>)
              ?.relatedEntityIds as string[]) || [],
        });
      });
    }

    return graph;
  }
}
