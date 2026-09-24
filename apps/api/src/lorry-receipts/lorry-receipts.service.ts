import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShareLorryReceiptDto } from './dto/share-lorry-receipt.dto';

@Injectable()
export class LorryReceiptsService {
  constructor(private prisma: PrismaService) {}

  async share(companyId: string, id: string, dto: ShareLorryReceiptDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt with ID ${id} not found`);
      }

      return tx.lorryReceipt.update({
        where: { id },
        data: {
          driverId: dto.driverId,
          status: 'SHARED',
        },
      });
    });
  }

  async findAll(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.lorryReceipt.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
        include: { trip: true, driver: true, vehicle: true }
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt not found`);
      }
      return lr;
    });
  }
}
