// @ts-nocheck
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';

@Injectable()
export class BrokerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async createCarrier(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const carrier = await tx.externalCarrier.create({
        data: {
          companyId,
          name: data.name,
          dotNumber: data.dotNumber,
          mcNumber: data.mcNumber,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Broker',
          entityType: 'ExternalCarrier',
          entityId: carrier.id,
          action: 'CREATE',
          details: { name: carrier.name },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'EXTERNAL_CARRIER',
        streamId: carrier.id,
        eventType: 'CarrierCreated',
        payload: { name: carrier.name },
        userId,
      });

      return carrier;
    });
  }

  async getCarriers(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.externalCarrier.findMany({ where: { companyId } }),
    );
  }

  async postToLoadBoard(
    companyId: string,
    tripId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Check if trip exists
      const trip = await tx.trip.findUnique({
        where: { id: tripId, companyId },
      });
      if (!trip) throw new NotFoundException('Trip not found');

      const boardItem = await tx.loadBoardItem.create({
        data: {
          companyId,
          tripId,
          origin: data.origin,
          destination: data.destination,
          pickupTime: new Date(data.pickupTime),
          deliveryTime: new Date(data.deliveryTime),
          weight: data.weight,
          equipmentType: data.equipmentType,
          maxRate: data.maxRate,
          status: 'OPEN',
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Broker',
          entityType: 'LoadBoardItem',
          entityId: boardItem.id,
          action: 'CREATE',
          details: { tripId: boardItem.tripId },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'LOAD_BOARD_ITEM',
        streamId: boardItem.id,
        eventType: 'LoadBoardItemCreated',
        payload: { tripId: boardItem.tripId },
        userId,
      });

      return boardItem;
    });
  }

  async getLoadBoard(companyId: string, status?: string, page = 1, limit = 10) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { skip, take } = getPaginationParams(page, limit);

      const where: any = { companyId };
      if (status) where.status = status;

      const [data, total] = await Promise.all([
        tx.loadBoardItem.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { trip: true, bids: true },
        }),
        tx.loadBoardItem.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async submitBid(
    companyId: string,
    loadBoardItemId: string,
    carrierId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const bid = await tx.carrierBid.create({
        data: {
          companyId,
          loadBoardItemId,
          carrierId,
          bidAmount: data.bidAmount,
          notes: data.notes,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Broker',
          entityType: 'CarrierBid',
          entityId: bid.id,
          action: 'CREATE',
          details: { carrierId, loadBoardItemId, bidAmount: data.bidAmount },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'CARRIER_BID',
        streamId: bid.id,
        eventType: 'CarrierBidSubmitted',
        payload: { carrierId, loadBoardItemId, bidAmount: data.bidAmount },
        userId,
      });

      return bid;
    });
  }

  async acceptBid(companyId: string, bidId: string, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const bid = await tx.carrierBid.findUnique({
        where: { id: bidId, companyId },
        include: { loadBoardItem: true },
      });

      if (!bid) throw new NotFoundException('Bid not found');
      if (bid.status !== 'PENDING')
        throw new BadRequestException('Bid is not pending');

      // Reject all other bids for this load
      await tx.carrierBid.updateMany({
        where: {
          companyId,
          loadBoardItemId: bid.loadBoardItemId,
          id: { not: bidId },
        },
        data: { status: 'REJECTED' },
      });

      // Accept this bid
      const acceptedBid = await tx.carrierBid.update({
        where: { id: bidId, companyId },
        data: { status: 'ACCEPTED' },
      });

      // Update Load Board Item
      const load = await tx.loadBoardItem.update({
        where: { id: bid.loadBoardItemId, companyId },
        data: {
          status: 'ASSIGNED',
          assignedToId: bid.carrierId,
          assignedRate: bid.bidAmount,
          margin: (bid.loadBoardItem.maxRate || 0) - bid.bidAmount,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Broker',
          entityType: 'CarrierBid',
          entityId: bid.id,
          action: 'ACCEPT',
          details: { loadBoardItemId: bid.loadBoardItemId },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'CARRIER_BID',
        streamId: bid.id,
        eventType: 'CarrierBidAccepted',
        payload: { loadBoardItemId: bid.loadBoardItemId },
        userId,
      });

      return { bid: acceptedBid, load };
    });
  }
}
