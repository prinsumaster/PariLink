import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { assertTenantOwned } from '../common/utils/tenant-assert';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  // --- FUEL CARDS ---

  async createFuelCard(companyId: string, dto: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // mask card number, store last 4 and hash
      const last4 = dto.cardNumber.slice(-4);
      const hashedRef = crypto
        .createHash('sha256')
        .update(dto.cardNumber)
        .digest('hex');

      if (dto.vehicleId) {
        await assertTenantOwned(tx, 'vehicle', dto.vehicleId, companyId);
      }
      if (dto.driverId) {
        await assertTenantOwned(tx, 'driver', dto.driverId, companyId);
      }

      return tx.fuelCard.create({
        data: {
          companyId,
          cardNumber: last4,
          hashedRef,
          provider: dto.provider,
          vehicleId: dto.vehicleId,
          driverId: dto.driverId,
          dailyLimit: dto.dailyLimit,
          billingCycleStart: dto.billingCycleStart
            ? new Date(dto.billingCycleStart)
            : null,
          billingCycleEnd: dto.billingCycleEnd
            ? new Date(dto.billingCycleEnd)
            : null,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        },
      });
    });
  }

  async getFuelCards(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.fuelCard.findMany({ where: { companyId } });
    });
  }

  async getFuelCardBillingStatus(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const card = await tx.fuelCard.findUnique({ where: { id, companyId } });
      if (!card) throw new NotFoundException('Fuel card not found');

      const now = new Date();
      let status = 'CURRENT';
      if (card.dueDate) {
        const dueDate = new Date(card.dueDate);
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
        );
        if (daysUntilDue < 0) {
          status = 'OVERDUE';
        } else if (daysUntilDue <= 7) {
          status = 'APPROACHING_DUE';
        }
      }
      return { id: card.id, status, dueDate: card.dueDate };
    });
  }

  // --- FUEL ENTRIES (Logs) ---

  async getFuelLogs(companyId: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (status) where.status = status;

      return tx.fuelEntry.findMany({
        where,
        include: {
          vehicle: true,
          driver: true,
          trip: true,
          fuelCard: true,
        },
        orderBy: { filledAt: 'desc' },
      });
    });
  }

  async createFuelLog(companyId: string, dto: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      if (dto.tripId) {
        const trip = await tx.trip.findFirst({
          where: { id: dto.tripId, companyId },
        });
        if (!trip) throw new NotFoundException('Trip not found');
      }

      if (dto.vehicleId) await assertTenantOwned(tx, 'vehicle', dto.vehicleId, companyId);
      if (dto.driverId) await assertTenantOwned(tx, 'driver', dto.driverId, companyId);
      if (dto.fuelCardId) await assertTenantOwned(tx, 'fuelCard', dto.fuelCardId, companyId);
      if (dto.billingCustomerId) await assertTenantOwned(tx, 'customer', dto.billingCustomerId, companyId);

      return tx.fuelEntry.create({
        data: {
          companyId,
          vehicleId: dto.vehicleId,
          driverId: dto.driverId,
          tripId: dto.tripId,
          fuelCardId: dto.fuelCardId,
          litres: dto.litres,
          amount: dto.amount,
          pump: dto.pump,
          slipNo: dto.slipNo,
          billingCustomerId: dto.billingCustomerId,
          status: 'PENDING',
        },
      });
    });
  }

  async approveFuelLog(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fuelLog = await tx.fuelEntry.findFirst({
        where: { id, companyId },
      });
      if (!fuelLog) throw new NotFoundException('Fuel log not found');
      if (fuelLog.status !== 'PENDING')
        throw new BadRequestException('Only PENDING fuel logs can be approved');

      // Generate a random 6 digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
      const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await tx.fuelEntry.update({
        where: { id },
        data: {
          status: 'APPROVED',
          otpHash,
          otpExpiry,
        },
      });

      // In real world, send OTP to driver via SMS. Here we return it to the caller (e.g. testing/UI)
      return { message: 'Fuel log approved', otp };
    });
  }

  async fillFuelLog(companyId: string, id: string, otp: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fuelLog = await tx.fuelEntry.findFirst({
        where: { id, companyId },
      });
      if (!fuelLog) throw new NotFoundException('Fuel log not found');
      if (fuelLog.status !== 'APPROVED')
        throw new BadRequestException('Fuel log is not APPROVED');

      if (!fuelLog.otpHash || !fuelLog.otpExpiry)
        throw new BadRequestException('No OTP generated for this fuel log');

      if (new Date() > fuelLog.otpExpiry)
        throw new BadRequestException('OTP has expired');

      const inputHash = crypto.createHash('sha256').update(otp).digest('hex');
      if (inputHash !== fuelLog.otpHash)
        throw new BadRequestException('Invalid OTP');

      const updated = await tx.fuelEntry.update({
        where: { id },
        data: { status: 'FILLED' },
      });

      // Part A4: produce an invoice line item if billingCustomerId is present
      if (fuelLog.billingCustomerId) {
        // Find existing draft invoice for this customer, or create one
        let invoice = await tx.invoice.findFirst({
          where: {
            companyId,
            customerId: fuelLog.billingCustomerId,
            status: 'DRAFT',
          },
        });

        if (!invoice) {
          const invoiceNumber = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
          invoice = await tx.invoice.create({
            data: {
              companyId,
              customerId: fuelLog.billingCustomerId,
              invoiceNumber,
              amount: 0, // will be updated
              status: 'DRAFT',
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }

        await tx.invoiceLineItem.create({
          data: {
            invoiceId: invoice.id,
            description: `Fuel Fill (Slip: ${fuelLog.slipNo || 'N/A'}) for vehicle`,
            quantity: fuelLog.litres,
            unitPrice: fuelLog.amount / fuelLog.litres,
            amount: fuelLog.amount,
            type: 'FUEL',
            sourceType: 'FUEL',
            fuelEntryId: fuelLog.id,
          },
        });

        // Update invoice total
        const allLines = await tx.invoiceLineItem.findMany({
          where: { invoiceId: invoice.id },
        });
        const newTotal = allLines.reduce((sum, line) => sum + line.amount, 0);
        await tx.invoice.update({
          where: { id: invoice.id },
          data: { amount: newTotal },
        });
      }

      return updated;
    });
  }

  async updateFuelLogStatus(companyId: string, id: string, status: string) {
    // Deprecated for generic use, use approveFuelLog and fillFuelLog explicitly
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fuelLog = await tx.fuelEntry.findFirst({
        where: { id, companyId },
      });
      if (!fuelLog) throw new NotFoundException('Fuel log not found');
      return tx.fuelEntry.update({
        where: { id },
        data: { status },
      });
    });
  }
}
