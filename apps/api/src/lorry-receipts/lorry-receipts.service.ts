import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLorryReceiptDto } from './dto/create-lorry-receipt.dto';
import { LorryReceiptQueryDto } from './dto/lorry-receipt-query.dto';
import { UpdateLorryReceiptStatusDto } from './dto/update-lorry-receipt-status.dto';

/** Indian financial year (Apr–Mar) as "YY-YY", e.g. "26-27". */
function financialYear(d: Date): string {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1;
  return `${String(y).slice(2)}-${String(y + 1).slice(2)}`;
}

@Injectable()
export class LorryReceiptsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateLorryReceiptDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const load = await tx.load.findFirst({
        where: { id: dto.loadId, companyId },
        include: { customer: true },
      });
      if (!load) {
        throw new NotFoundException(`Load with ID ${dto.loadId} not found`);
      }

      // Race-safe LR number: ensure the counter row exists, then atomically
      // increment. The UPDATE ... increment holds a row lock, so concurrent
      // transactions serialize and can never produce a duplicate number.
      const year = financialYear(new Date());
      await tx.lrSequence.upsert({
        where: { companyId_financialYear: { companyId, financialYear: year } },
        create: { companyId, financialYear: year, lastNumber: 0 },
        update: {},
      });
      const seq = await tx.lrSequence.update({
        where: { companyId_financialYear: { companyId, financialYear: year } },
        data: { lastNumber: { increment: 1 } },
      });
      const lrNumber = `PL/${year}/${String(seq.lastNumber).padStart(5, '0')}`;

      const freight = dto.freightAmount ?? 0;
      const hamali = dto.hamaliCharges ?? 0;
      const other = dto.otherCharges ?? 0;
      const gst = dto.gstAmount ?? 0;
      const total = freight + hamali + other + gst;

      let vehicleNumber = dto.vehicleNumber;
      if (!vehicleNumber && dto.vehicleId) {
        const v = await tx.vehicle.findFirst({
          where: { id: dto.vehicleId, companyId },
        });
        vehicleNumber = v?.licensePlate ?? undefined;
      }

      return tx.lorryReceipt.create({
        data: {
          companyId,
          loadId: load.id,
          lrNumber,
          consignorName:
            dto.consignorName ?? load.consignor ?? load.customer?.name ?? 'N/A',
          consignorGstin: dto.consignorGstin,
          consignorAddress: dto.consignorAddress,
          consigneeName: dto.consigneeName ?? load.consignee ?? 'N/A',
          consigneeGstin: dto.consigneeGstin,
          consigneeAddress: dto.consigneeAddress,
          fromStation: dto.fromStation ?? load.originCity,
          toStation: dto.toStation ?? load.destinationCity,
          vehicleId: dto.vehicleId,
          vehicleNumber,
          goodsDescription: dto.goodsDescription ?? 'Goods',
          packagesCount: dto.packagesCount ?? 1,
          packingType: dto.packingType,
          actualWeightKg: dto.actualWeightKg ?? load.weight ?? undefined,
          chargedWeightKg: dto.chargedWeightKg,
          invoiceValue: dto.invoiceValue,
          freightAmount: freight,
          hamaliCharges: hamali,
          otherCharges: other,
          gstAmount: gst,
          totalAmount: total,
          paymentType: dto.paymentType ?? 'TOPAY',
          ewayBillNumber: dto.ewayBillNumber,
        },
      });
    });
  }

  async findAll(companyId: string, query: LorryReceiptQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: any = {
        companyId,
        deletedAt: null,
      };
      if (search) {
        where.OR = [
          { lrNumber: { contains: search, mode: 'insensitive' } },
          { consigneeName: { contains: search, mode: 'insensitive' } },
          { consignorName: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (status) {
        where.status = status;
      }

      const [data, total] = await Promise.all([
        tx.lorryReceipt.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        tx.lorryReceipt.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findUnique({
        where: { id, companyId },
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt with ID ${id} not found`);
      }
      return lr;
    });
  }

  async findOnePopulated(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findUnique({
        where: { id, companyId },
        include: {
          company: true,
          load: true,
          vehicle: true
        }
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt with ID ${id} not found`);
      }
      return lr;
    });
  }

  async updateStatus(
    companyId: string,
    id: string,
    dto: UpdateLorryReceiptStatusDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existing = await tx.lorryReceipt.findUnique({
        where: { id, companyId },
      });
      if (!existing) throw new NotFoundException();

      await tx.lorryReceipt.update({
        where: { id, companyId },
        data: {
          status: dto.status,
          podDocumentId: dto.podDocumentId ?? existing.podDocumentId,
        },
      });

      const updated = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
      });
      if (!updated) throw new NotFoundException();
      return updated;
    });
  }

  /** Print-friendly HTML for the LR — the browser's Print dialog gives a PDF. */
  async renderPrintable(companyId: string, id: string): Promise<string> {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({
        where: { id, companyId },
      });
      if (!lr) {
        throw new NotFoundException(`Lorry Receipt with ID ${id} not found`);
      }
      const company = await tx.company.findFirst({ where: { id: companyId } });
      const inr = (n: number) =>
        '₹' + (n ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
      const esc = (v: unknown) =>
        String(v ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      const d = new Date(lr.date).toLocaleDateString('en-IN');

      return `<!doctype html><html><head><meta charset="utf-8"/>
<title>LR ${esc(lr.lrNumber)}</title>
<style>
  *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:0;padding:24px}
  .sheet{max-width:820px;margin:0 auto;border:2px solid #111;padding:0}
  .hd{display:flex;justify-content:space-between;align-items:flex-start;padding:14px 18px;border-bottom:2px solid #111}
  .hd h1{margin:0;font-size:20px;letter-spacing:.5px} .hd .co{font-size:13px;color:#444}
  .title{text-align:center;font-weight:700;letter-spacing:2px;padding:6px;border-bottom:2px solid #111;background:#f3f3f3}
  .row{display:flex;border-bottom:1px solid #999} .cell{padding:8px 12px;flex:1} .cell+.cell{border-left:1px solid #999}
  .k{font-size:10px;text-transform:uppercase;color:#666;letter-spacing:.6px} .v{font-size:14px;margin-top:2px}
  table{width:100%;border-collapse:collapse} td,th{border:1px solid #999;padding:8px 12px;font-size:13px;text-align:left}
  .amt{text-align:right;font-variant-numeric:tabular-nums} .tot td{font-weight:700;background:#f3f3f3}
  .ft{display:flex;justify-content:space-between;padding:26px 18px 10px;font-size:12px;color:#444}
  @media print{body{padding:0}.sheet{border:none}}
</style></head><body><div class="sheet">
  <div class="hd">
    <div><h1>${esc(company?.name ?? 'PariLink')}</h1><div class="co">${esc(company?.city ?? '')} ${esc(company?.state ?? '')} · GSTIN ${esc(company?.taxId ?? '—')}</div></div>
    <div style="text-align:right"><div class="k">LR / Bilty No.</div><div class="v"><b>${esc(lr.lrNumber)}</b></div><div class="k" style="margin-top:6px">Date</div><div class="v">${esc(d)}</div></div>
  </div>
  <div class="title">LORRY RECEIPT (BILTY)</div>
  <div class="row">
    <div class="cell"><div class="k">Consignor (From)</div><div class="v">${esc(lr.consignorName)}</div><div class="co">${esc(lr.consignorAddress)}</div><div class="co">GSTIN: ${esc(lr.consignorGstin ?? '—')}</div></div>
    <div class="cell"><div class="k">Consignee (To)</div><div class="v">${esc(lr.consigneeName)}</div><div class="co">${esc(lr.consigneeAddress)}</div><div class="co">GSTIN: ${esc(lr.consigneeGstin ?? '—')}</div></div>
  </div>
  <div class="row">
    <div class="cell"><div class="k">From Station</div><div class="v">${esc(lr.fromStation)}</div></div>
    <div class="cell"><div class="k">To Station</div><div class="v">${esc(lr.toStation)}</div></div>
    <div class="cell"><div class="k">Truck No.</div><div class="v">${esc(lr.vehicleNumber ?? '—')}</div></div>
    <div class="cell"><div class="k">E-Way Bill</div><div class="v">${esc(lr.ewayBillNumber ?? '—')}</div></div>
  </div>
  <table>
    <tr><th>Description of Goods</th><th>Packages</th><th>Packing</th><th>Actual Wt (kg)</th><th>Charged Wt (kg)</th></tr>
    <tr><td>${esc(lr.goodsDescription)}</td><td>${esc(lr.packagesCount)}</td><td>${esc(lr.packingType ?? '—')}</td><td>${esc(lr.actualWeightKg ?? '—')}</td><td>${esc(lr.chargedWeightKg ?? '—')}</td></tr>
  </table>
  <table>
    <tr><td>Freight</td><td class="amt">${inr(lr.freightAmount)}</td></tr>
    <tr><td>Hamali (Loading/Unloading)</td><td class="amt">${inr(lr.hamaliCharges)}</td></tr>
    <tr><td>Other Charges</td><td class="amt">${inr(lr.otherCharges)}</td></tr>
    <tr><td>GST</td><td class="amt">${inr(lr.gstAmount)}</td></tr>
    <tr class="tot"><td>Total (${esc(lr.paymentType)})</td><td class="amt">${inr(lr.totalAmount)}</td></tr>
  </table>
  <div class="ft"><div>Received goods in good condition.<br/>Consignee Signature</div><div>For ${esc(company?.name ?? 'PariLink')}<br/>Authorised Signatory</div></div>
</div></body></html>`;
    });
  }

  /** Manual E-Way Bill number entry — stores user-provided number; no NIC portal call. */
  async updateEwayBill(companyId: string, id: string, ewayBillNumber: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const lr = await tx.lorryReceipt.findFirst({ where: { id, companyId } });
      if (!lr) throw new NotFoundException('Lorry Receipt not found');
      return tx.lorryReceipt.update({
        where: { id },
        data: { ewayBillNumber: ewayBillNumber.trim() || null },
      });
    });
  }

  /** Aggregate GST collected across all LRs for this company. */
  async gstSummary(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rows = await tx.lorryReceipt.groupBy({
        by: ['companyId'],
        where: { companyId },
        _sum: { gstAmount: true, freightAmount: true, totalAmount: true },
        _count: { id: true },
      });
      const r = rows[0] ?? { _sum: { gstAmount: 0, freightAmount: 0, totalAmount: 0 }, _count: { id: 0 } };
      return {
        totalLrs: r._count.id,
        totalFreight: r._sum.freightAmount ?? 0,
        totalGstCollected: r._sum.gstAmount ?? 0,
        totalBilled: r._sum.totalAmount ?? 0,
      };
    });
  }
}
