import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface KnowledgeNode {
  type: string;
  id: string;
  data: Record<string, unknown>;
}

export interface KnowledgeEdge {
  relation: string;
  target: KnowledgeNode;
}

export interface KnowledgeGraph {
  root: KnowledgeNode;
  relationships: Record<string, KnowledgeNode | KnowledgeNode[] | null>;
  depth: number;
  traversedAt: string;
}

@Injectable()
export class KnowledgeGraphService {
  private readonly logger = new Logger(KnowledgeGraphService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Multi-hop graph traversal — builds a rich relationship map for any entity.
   * depth=1 returns direct relationships, depth=2 traverses their relationships too.
   */
  async buildEntityGraph(
    companyId: string,
    entityType: string,
    entityId: string,
    depth = 1,
  ): Promise<KnowledgeGraph> {
    this.logger.debug(
      `Building Knowledge Graph: ${entityType}[${entityId}] depth=${depth}`,
    );

    const graph: KnowledgeGraph = {
      root: { type: entityType, id: entityId, data: {} },
      relationships: {},
      depth,
      traversedAt: new Date().toISOString(),
    };

    try {
      switch (entityType) {
        case 'Trip':
          await this.buildTripGraph(companyId, entityId, graph, depth);
          break;
        case 'Vehicle':
          await this.buildVehicleGraph(companyId, entityId, graph);
          break;
        case 'Driver':
          await this.buildDriverGraph(companyId, entityId, graph);
          break;
        case 'Load':
          await this.buildLoadGraph(companyId, entityId, graph);
          break;
        case 'Customer':
          await this.buildCustomerGraph(companyId, entityId, graph);
          break;
        case 'Vendor':
          await this.buildVendorGraph(companyId, entityId, graph);
          break;
        case 'MarketplaceApp':
          await this.buildMarketplaceAppGraph(companyId, entityId, graph);
          break;
        case 'Company':
          await this.buildCompanyGraph(entityId, graph);
          break;
        default:
          this.logger.warn(`Unknown entity type: ${entityType}`);
          graph.root.data = { error: `Unsupported entity type: ${entityType}` };
      }
    } catch (e: unknown) {
      const err = e as Error;
      this.logger.error(
        `Graph traversal failed for ${entityType}[${entityId}]: ${err.message}`,
      );
      graph.root.data = {
        error: 'Graph traversal failed',
        message: err.message,
      };
    }

    return graph;
  }

  // ─── Entity Builders ────────────────────────────────────────────────────────

  private async buildTripGraph(
    companyId: string,
    tripId: string,
    graph: KnowledgeGraph,
    depth: number,
  ) {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId, companyId },
        include: {
          driver: true,
          vehicle: true,
          loads: { include: { customer: true }, take: 10 },
          locationHistory: { orderBy: { timestamp: 'desc' }, take: 5 },
        },
      }),
    );
    if (!trip) return;

    graph.root.data = {
      tripNumber: trip.tripNumber,
      status: trip.status,
      createdAt: trip.createdAt,
    };
    graph.relationships.driver = trip.driver
      ? {
          type: 'Driver',
          id: trip.driver.id,
          data: {
            name: `${trip.driver.firstName} ${trip.driver.lastName}`,
            licenseNumber: trip.driver.licenseNumber,
          },
        }
      : null;
    graph.relationships.vehicle = trip.vehicle
      ? {
          type: 'Vehicle',
          id: trip.vehicle.id,
          data: {
            licensePlate: trip.vehicle.licensePlate,
            status: trip.vehicle.status,
          },
        }
      : null;
    graph.relationships.loads = trip.loads.map((l) => ({
      type: 'Load',
      id: l.id,
      data: { status: l.status, customer: l.customer?.name },
    }));
    graph.relationships.recentLocations = trip.locationHistory.map((h) => ({
      type: 'LocationEvent',
      id: h.id,
      data: { lat: h.latitude, lng: h.longitude, timestamp: h.timestamp },
    }));

    // Depth-2: traverse driver and vehicle subgraphs
    if (depth >= 2 && trip.driver) {
      const driverSubgraph: KnowledgeGraph = {
        root: { type: 'Driver', id: trip.driver.id, data: {} },
        relationships: {},
        depth: 1,
        traversedAt: new Date().toISOString(),
      };
      await this.buildDriverGraph(companyId, trip.driver.id, driverSubgraph);
      graph.relationships.driverDetail = driverSubgraph.root;
    }
  }

  private async buildVehicleGraph(
    companyId: string,
    vehicleId: string,
    graph: KnowledgeGraph,
  ) {
    const vehicle = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findUnique({
        where: { id: vehicleId, companyId },
        include: {
          tripsVehicle: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
    );
    if (!vehicle) return;

    graph.root.data = {
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      capacityWeight: vehicle.capacityWeight,
    };
    graph.relationships.recentTrips = vehicle.tripsVehicle.map((t) => ({
      type: 'Trip',
      id: t.id,
      data: { status: t.status, tripNumber: t.tripNumber },
    }));
  }

  private async buildDriverGraph(
    companyId: string,
    driverId: string,
    graph: KnowledgeGraph,
  ) {
    const driver = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driver.findUnique({
        where: { id: driverId, companyId },
        include: {
          trips: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
    );
    if (!driver) return;

    graph.root.data = {
      name: `${driver.firstName} ${driver.lastName}`,
      status: driver.status,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
    };
    graph.relationships.recentTrips = driver.trips.map((t) => ({
      type: 'Trip',
      id: t.id,
      data: { status: t.status },
    }));
  }

  private async buildLoadGraph(
    companyId: string,
    loadId: string,
    graph: KnowledgeGraph,
  ) {
    const load = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findUnique({
        where: { id: loadId, companyId },
        include: {
          customer: true,
          trip: true,
          documents: { take: 2 },
        },
      }),
    );
    if (!load) return;

    graph.root.data = {
      referenceNumber: load.referenceNumber,
      status: load.status,
      weight: load.weight,
      commodity: (load as Record<string, unknown>).commodity,
      pickupDate: load.pickupDate,
      deliveryDate: load.deliveryDate,
    };
    graph.relationships.customer = load.customer
      ? {
          type: 'Customer',
          id: load.customer.id,
          data: { name: load.customer.name, email: load.customer.email },
        }
      : null;
    graph.relationships.trips = (
      ((load as Record<string, unknown>).trips as Array<
        Record<string, unknown>
      >) ?? []
    ).map((t) => ({
      type: 'Trip',
      id: t.id as string,
      data: { status: t.status },
    }));
    graph.relationships.documents = load.documents.map((d) => ({
      type: 'Document',
      id: d.id,
      data: {
        type: d.type,
        name:
          (d as Record<string, unknown>).name ??
          (d as Record<string, unknown>).title ??
          d.id,
      },
    }));
  }

  private async buildCustomerGraph(
    companyId: string,
    customerId: string,
    graph: KnowledgeGraph,
  ) {
    const customer = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.customer.findUnique({
        where: { id: customerId, companyId },
        include: {
          loads: { orderBy: { createdAt: 'desc' }, take: 5 },
          invoices: { orderBy: { createdAt: 'desc' }, take: 3 },
        },
      }),
    );
    if (!customer) return;

    graph.root.data = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      creditLimit: (customer as Record<string, unknown>).creditLimit,
      balance: (customer as Record<string, unknown>).balance,
    };
    graph.relationships.recentLoads = customer.loads.map((l) => ({
      type: 'Load',
      id: l.id,
      data: { status: l.status, referenceNumber: l.referenceNumber },
    }));
    graph.relationships.recentInvoices = customer.invoices.map((inv) => ({
      type: 'Invoice',
      id: inv.id,
      data: {
        status: inv.status,
        amount: (inv as Record<string, unknown>).amount,
      },
    }));
  }

  private async buildVendorGraph(
    companyId: string,
    vendorId: string,
    graph: KnowledgeGraph,
  ) {
    const vendor = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vendor.findUnique({
        where: { id: vendorId, companyId },
      }),
    );
    if (!vendor) return;

    graph.root.data = {
      name: vendor.name,
      type: vendor.type,
      email: vendor.email,
      phone: vendor.phone,
    };
    graph.relationships.payments = [];
  }

  private async buildMarketplaceAppGraph(
    _companyId: string,
    appId: string,
    graph: KnowledgeGraph,
  ) {
    const app = await this.prisma.runAsSystem(async (tx) =>
      tx.marketplaceApp.findUnique({
        where: { id: appId },
        include: {
          category: true,
          installations: { take: 5 },
          webhooks: { take: 3 },
        },
      }),
    );
    if (!app) return;

    graph.root.data = {
      name: app.name,
      version: (app as Record<string, unknown>).version,
      category: (app as Record<string, unknown>).category,
      isPublished: (app as Record<string, unknown>).isPublished,
      installCount:
        (app as Record<string, unknown> & { installs?: unknown[] }).installs
          ?.length || 0,
    };
    graph.relationships.webhooks = app.webhooks.map((w) => ({
      type: 'Webhook',
      id: w.id,
      data: { event: w.events, url: w.url },
    }));
  }

  private async buildCompanyGraph(companyId: string, graph: KnowledgeGraph) {
    const company = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.company.findUnique({
        where: { id: companyId },
        include: {
          drivers: { take: 5 },
          vehicles: { take: 5 },
          loads: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
    );
    if (!company) return;

    graph.root.data = {
      name: company.name,
      plan: (company as Record<string, unknown>).plan,
      status: company.status,
    };
    graph.relationships.drivers = company.drivers.map((d) => ({
      type: 'Driver',
      id: d.id,
      data: { name: `${d.firstName} ${d.lastName}`, status: d.status },
    }));
    graph.relationships.vehicles = company.vehicles.map((v) => ({
      type: 'Vehicle',
      id: v.id,
      data: { licensePlate: v.licensePlate, status: v.status },
    }));
    graph.relationships.recentLoads = company.loads.map((l) => ({
      type: 'Load',
      id: l.id,
      data: { status: l.status, referenceNumber: l.referenceNumber },
    }));
  }

  /**
   * Convert graph to a flat string summary for use in LLM prompts
   */
  graphToString(graph: KnowledgeGraph): string {
    const lines: string[] = [`Entity: ${graph.root.type} [${graph.root.id}]`];

    for (const [key, val] of Object.entries(graph.root.data || {})) {
      lines.push(`  ${key}: ${val}`);
    }

    for (const [rel, value] of Object.entries(graph.relationships)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        lines.push(`  ${rel}: [${value.length} items]`);
        value
          .slice(0, 3)
          .forEach((v) =>
            lines.push(`    - ${v.type}[${v.id}]: ${JSON.stringify(v.data)}`),
          );
      } else {
        const node = value;
        lines.push(
          `  ${rel}: ${node.type}[${node.id}] ${JSON.stringify(node.data)}`,
        );
      }
    }

    return lines.join('\n');
  }
}
