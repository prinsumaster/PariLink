import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('ai-inference', { concurrency: 2 })
export class AiInferenceProcessor extends WorkerHost {
  private readonly logger = new Logger(AiInferenceProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(
    job: Job<Record<string, unknown>, unknown, string>,
  ): Promise<unknown> {
    this.logger.log(
      `Processing AI inference job ${job.id} of type ${job.name}`,
    );

    if (job.name === 'dispatch-match') {
      return this.handleDispatchMatch(
        job.data as unknown as {
          companyId: string;
          loadId: string;
          recommendationId: string;
          userId: string;
        },
      );
    }

    throw new Error(`Unknown job type: ${job.name}`);
  }

  private async handleDispatchMatch(data: {
    companyId: string;
    loadId: string;
    recommendationId: string;
    userId: string;
  }) {
    const { companyId, loadId, recommendationId } = data;

    // Simulate AI ranking logic (In a real system, this would call an internal Python microservice or Vertex AI)
    // 1. Fetch available drivers
    const availableDrivers = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.driver.findMany({
          where: { companyId, status: 'AVAILABLE' },
          take: 5,
        }),
    );

    // 2. Fetch available vehicles
    const availableVehicles = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.vehicle.findMany({
          where: { companyId, status: 'IN_SERVICE' },
          take: 5,
        }),
    );

    if (availableDrivers.length === 0 || availableVehicles.length === 0) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.aiRecommendation.update({
          where: { id: recommendationId },
          data: {
            status: 'REJECTED',
            reasoning: 'No available drivers or vehicles to recommend.',
            confidence: 0,
          },
        }),
      );
      return { success: false, reason: 'No resources available' };
    }

    // 3. Fake AI algorithm output (picking first ones for demo)
    const bestDriver = availableDrivers[0];
    const bestVehicle = availableVehicles[0];

    const recommendationText = `Assign Driver ${bestDriver.firstName} ${bestDriver.lastName} to Vehicle ${bestVehicle.licensePlate || bestVehicle.id}`;

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiRecommendation.update({
        where: { id: recommendationId },
        data: {
          status: 'ACCEPTED', // AI engine accepted the match request
          recommendation: recommendationText,
          reasoning:
            'Optimal ETA based on current driver HOS and vehicle proximity to origin.',
          confidence: 0.92,
          evidence: [
            { type: 'DRIVER_HOS', value: '11 hours remaining' },
            { type: 'VEHICLE_DISTANCE', value: '12 miles from origin' },
          ],
          alternatives: [
            {
              driverId: availableDrivers[1]?.id,
              vehicleId: availableVehicles[1]?.id,
              confidence: 0.78,
            },
          ],
        },
      }),
    );

    this.logger.log(
      `Successfully generated AI dispatch recommendation for load: ${loadId}`,
    );
    return { success: true, recommendationId };
  }
}
