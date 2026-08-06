import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventService } from '../platform/events/event.service';

@Injectable()
export class SimulatorService {
  private readonly logger = new Logger(SimulatorService.name);

  constructor(
    private prisma: PrismaService,
    private eventService: EventService,
  ) {}

  async startSimulation(
    companyId: string,
    options: { vehicles: number; trips: number; anomalies: number },
  ) {
    this.logger.log(`Starting operational simulation for company ${companyId}`);

    // Create a background job to track the simulation progress
    const job = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.backgroundJob.create({
        data: {
          companyId,
          type: 'SIMULATION',
          status: 'PROCESSING',
          metadata: options,
        },
      }),
    );

    // Run the simulation asynchronously
    this.runSimulation(companyId, job.id, options).catch((err) => {
      this.logger.error('Simulation failed', err);
      this.prisma
        .runAsTenant(companyId, async (tx) =>
          tx.backgroundJob.update({
            where: { id: job.id },
            data: { status: 'FAILED', error: err.message },
          }),
        )
        .catch(() => {});
    });

    return { jobId: job.id, message: 'Simulation started in the background' };
  }

  private async runSimulation(
    companyId: string,
    jobId: string,
    options: { vehicles: number; trips: number; anomalies: number },
  ) {
    // Create random vehicles
    this.logger.log(`Generating ${options.vehicles} vehicles...`);
    const vehicles = await Promise.all(
      Array.from({ length: options.vehicles }).map((_, i) =>
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.create({
            data: {
              companyId,
              licensePlate: `SIM-${Math.floor(Math.random() * 10000)}`,
              type: 'TRUCK',
              status: 'IN_SERVICE',
            },
          }),
        ),
      ),
    );
    await this.updateJobProgress(jobId, 25);

    // Create random drivers
    const drivers = await Promise.all(
      Array.from({ length: options.vehicles }).map((_, i) =>
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.driver.create({
            data: {
              companyId,
              firstName: `Driver`,
              lastName: `${Math.floor(Math.random() * 10000)}`,
              status: 'AVAILABLE',
            },
          }),
        ),
      ),
    );
    await this.updateJobProgress(jobId, 50);

    // Create trips and loads
    this.logger.log(`Generating ${options.trips} trips...`);
    for (let i = 0; i < options.trips; i++) {
      const v = vehicles[i % vehicles.length];
      const d = drivers[i % drivers.length];

      // Find or create a generic customer for simulation
      let customer = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.customer.findFirst({
          where: { companyId },
        }),
      );
      if (!customer) {
        customer = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.customer.create({
            data: { companyId, name: 'Simulated Customer Corp' },
          }),
        );
      }

      const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.create({
          data: {
            companyId,
            tripNumber: `TRP-SIM-${Date.now()}-${i}`,
            vehicleId: v.id,
            driverId: d.id,
            status: 'IN_TRANSIT',
          },
        }),
      );

      const load = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.create({
          data: {
            companyId,
            customerId: customer.id,
            tripId: trip.id,
            referenceNumber: `LD-SIM-${Date.now()}-${i}`,
            originAddress: '123 Origin St',
            originCity: 'New York',
            originState: 'NY',
            destinationAddress: '456 Dest St',
            destinationCity: 'Los Angeles',
            destinationState: 'CA',
            pickupDate: new Date(),
            deliveryDate: new Date(Date.now() + 86400000 * 3),
            rate: 2500,
            status: 'IN_TRANSIT',
            boardPosition: i,
          },
        }),
      );

      // Fire timeline event
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.eventTimeline.create({
          data: {
            companyId,
            eventName: 'LoadDispatched',
            entityType: 'Load',
            entityId: load.id,
            source: 'Simulator',
          },
        }),
      );
    }
    await this.updateJobProgress(jobId, 75);

    // Create AI anomalies
    this.logger.log(`Generating ${options.anomalies} anomalies...`);
    for (let i = 0; i < options.anomalies; i++) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.operationalAnomaly.create({
          data: {
            companyId,
            title: 'High Idle Detected',
            description: 'Vehicle idling for over 45 minutes',
            severity: 'MEDIUM',
            type: 'IDLING',
            entityType: 'Vehicle',
            entityId: vehicles[i % vehicles.length].id,
          },
        }),
      );
    }

    await this.updateJobProgress(jobId, 100, 'COMPLETED');
    this.logger.log(`Simulation completed successfully`);
  }

  private async updateJobProgress(
    id: string,
    progress: number,
    status: string = 'PROCESSING',
  ) {
    await this.prisma.runAsSystem(async (tx) =>
      tx.backgroundJob.update({
        where: { id },
        data: {
          progress,
          status,
          ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
        },
      }),
    );
  }
}
