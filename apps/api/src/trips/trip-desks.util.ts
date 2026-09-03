export const DEFAULT_TRIP_DESKS = ['DISPATCH', 'DIESEL', 'FASTAG', 'WORKSHOP', 'DOCS'];

export async function createDefaultTripDesks(tx: any, companyId: string, tripId: string) {
  for (const desk of DEFAULT_TRIP_DESKS) {
    await tx.tripDesk.create({
      data: {
        companyId,
        tripId,
        desk,
        status: 'PENDING',
      },
    });
  }
}
