import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ImportType = 'vehicles' | 'drivers' | 'customers' | 'vendors' | 'opening-balances';

export interface ImportRowResult {
  row: number;
  status: 'imported' | 'skipped';
  reason?: string;
  data?: Record<string, unknown>;
}

export interface ImportReport {
  importType: ImportType;
  totalRows: number;
  imported: number;
  skipped: number;
  results: ImportRowResult[];
}

// ─── Column Templates ─────────────────────────────────────────────────────────

export const TEMPLATES: Record<ImportType, string[]> = {
  vehicles: ['licensePlate', 'make', 'model', 'year', 'type', 'capacityWeight', 'vin'],
  drivers: ['firstName', 'lastName', 'phone', 'email', 'licenseNumber', 'licenseState', 'licenseExpiry'],
  customers: ['name', 'email', 'phone', 'taxId', 'billingAddress', 'creditLimit', 'paymentTerms'],
  vendors: ['name', 'email', 'phone', 'taxId', 'billingAddress', 'type', 'paymentTerms'],
  'opening-balances': ['entityType', 'entityRef', 'amount', 'currency', 'description', 'date'],
};

// ─── Validators ───────────────────────────────────────────────────────────────

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PHONE_REGEX = /^(\+91[-\s]?)?[6-9]\d{9}$/;
const TRUCK_PLATE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;

function validatePhone(phone: string | undefined): string | null {
  if (!phone) return null;
  const cleaned = phone.replace(/[\s\-]/g, '');
  if (!PHONE_REGEX.test(cleaned)) return `Phone "${phone}" is not a valid Indian mobile number`;
  return null;
}

function validateGst(gst: string | undefined): string | null {
  if (!gst) return null;
  if (!GST_REGEX.test(gst.toUpperCase())) return `GST "${gst}" is not valid (expected 15-char GSTIN format)`;
  return null;
}

function validateLicensePlate(plate: string | undefined): string | null {
  if (!plate) return null;
  const normalized = plate.replace(/[\s\-]/g, '').toUpperCase();
  if (!TRUCK_PLATE_REGEX.test(normalized)) return `License plate "${plate}" is not a valid Indian truck plate (e.g. GJ01AB1234)`;
  return null;
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseFile(buffer: Buffer, originalName: string): Record<string, unknown>[] {
  const ext = originalName.split('.').pop()?.toLowerCase();
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
}

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class BulkImportService {
  constructor(private readonly prisma: PrismaService) {}

  getTemplate(type: ImportType): Buffer {
    const columns = TEMPLATES[type];
    const wb = XLSX.utils.book_new();
    // Header row + one example row
    const exampleRows: Record<string, string>[] = [];
    const example: Record<string, string> = {};
    columns.forEach(col => { example[col] = `<${col}>`; });
    exampleRows.push(example);
    const ws = XLSX.utils.json_to_sheet(exampleRows, { header: columns });
    XLSX.utils.book_append_sheet(wb, ws, type);
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  async import(
    companyId: string,
    userId: string,
    type: ImportType,
    buffer: Buffer,
    originalName: string,
  ): Promise<ImportReport> {
    const rows = parseFile(buffer, originalName);

    const report: ImportReport = {
      importType: type,
      totalRows: rows.length,
      imported: 0,
      skipped: 0,
      results: [],
    };

    if (rows.length === 0) {
      throw new BadRequestException('File is empty or has no data rows.');
    }

    await this.prisma.runAsSystem(`Bulk import ${type}`, async (tx: any) => {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // 1-indexed, +1 for header

        try {
          const errors: string[] = [];

          switch (type) {
            case 'vehicles':
              await this.importVehicleRow(tx, companyId, row, errors);
              break;
            case 'drivers':
              await this.importDriverRow(tx, companyId, row, errors);
              break;
            case 'customers':
              await this.importCustomerRow(tx, companyId, row, errors);
              break;
            case 'vendors':
              await this.importVendorRow(tx, companyId, row, errors);
              break;
            case 'opening-balances':
              await this.importOpeningBalanceRow(tx, companyId, row, errors);
              break;
          }

          if (errors.length > 0) {
            report.results.push({ row: rowNum, status: 'skipped', reason: errors.join('; '), data: row });
            report.skipped++;
          } else {
            report.results.push({ row: rowNum, status: 'imported', data: row });
            report.imported++;
          }
        } catch (err: any) {
          report.results.push({
            row: rowNum,
            status: 'skipped',
            reason: err?.message || 'Unknown error',
            data: row,
          });
          report.skipped++;
        }
      }
    });

    return report;
  }

  // ─── Row Importers ────────────────────────────────────────────────────────

  private async importVehicleRow(
    tx: any,
    companyId: string,
    row: Record<string, unknown>,
    errors: string[],
  ): Promise<void> {
    const plate = (row['licensePlate'] as string)?.trim();
    const make = (row['make'] as string)?.trim();
    const type = (row['type'] as string)?.trim() || 'TRUCK';
    const ownershipType = (row['ownershipType'] as string)?.trim() || 'OWNED';

    // Required field validation
    if (!plate) { errors.push('licensePlate is required'); }
    if (!make) { errors.push('make is required'); }
    if (errors.length) return;

    // Format validation
    const plateErr = validateLicensePlate(plate);
    if (plateErr) errors.push(plateErr);
    if (errors.length) return;

    // Duplicate check
    const existing = await tx.vehicle.findFirst({
      where: { companyId, licensePlate: plate.toUpperCase().replace(/[\s\-]/g, '') },
    });
    if (existing) { errors.push(`Vehicle with plate ${plate} already exists`); return; }

    const yearRaw = row['year'];
    const year = yearRaw ? parseInt(String(yearRaw), 10) : null;
    const capacityWeight = row['capacityWeight'] ? parseFloat(String(row['capacityWeight'])) : null;

    await tx.vehicle.create({
      data: {
        companyId,
        licensePlate: plate.toUpperCase().replace(/[\s\-]/g, ''),
        make,
        model: (row['model'] as string)?.trim() || null,
        year: isNaN(year!) ? null : year,
        type,
        capacityWeight: isNaN(capacityWeight!) ? null : capacityWeight,
        vin: (row['vin'] as string)?.trim() || null,
        status: 'ACTIVE',
      },
    });
  }

  private async importDriverRow(
    tx: any,
    companyId: string,
    row: Record<string, unknown>,
    errors: string[],
  ): Promise<void> {
    const firstName = (row['firstName'] as string)?.trim();
    const lastName = (row['lastName'] as string)?.trim();
    const phone = (row['phone'] as string)?.trim();
    const licenseNumber = (row['licenseNumber'] as string)?.trim();

    if (!firstName) errors.push('firstName is required');
    if (!lastName) errors.push('lastName is required');
    if (errors.length) return;

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push(phoneErr);
    if (errors.length) return;

    // Duplicate check by phone
    if (phone) {
      const existing = await tx.driver.findFirst({ where: { companyId, phone } });
      if (existing) { errors.push(`Driver with phone ${phone} already exists`); return; }
    }
    // Duplicate check by license
    if (licenseNumber) {
      const existing = await tx.driver.findFirst({ where: { companyId, licenseNumber } });
      if (existing) { errors.push(`Driver with license ${licenseNumber} already exists`); return; }
    }

    let licenseExpiry: Date | null = null;
    const expiryRaw = row['licenseExpiry'];
    if (expiryRaw) {
      const parsed = new Date(String(expiryRaw));
      licenseExpiry = isNaN(parsed.getTime()) ? null : parsed;
    }

    await tx.driver.create({
      data: {
        companyId,
        firstName,
        lastName,
        phone: phone || null,
        email: (row['email'] as string)?.trim() || null,
        licenseNumber: licenseNumber || null,
        licenseState: (row['licenseState'] as string)?.trim() || null,
        licenseExpiry,
        status: 'AVAILABLE',
      },
    });
  }

  private async importCustomerRow(
    tx: any,
    companyId: string,
    row: Record<string, unknown>,
    errors: string[],
  ): Promise<void> {
    const name = (row['name'] as string)?.trim();
    const email = (row['email'] as string)?.trim();
    const phone = (row['phone'] as string)?.trim();
    const taxId = (row['taxId'] as string)?.trim();

    if (!name) { errors.push('name is required'); return; }

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push(phoneErr);
    const gstErr = validateGst(taxId);
    if (gstErr) errors.push(gstErr);
    if (errors.length) return;

    if (email) {
      const existing = await tx.customer.findFirst({ where: { companyId, email } });
      if (existing) { errors.push(`Customer with email ${email} already exists`); return; }
    }

    const creditLimit = row['creditLimit'] ? parseFloat(String(row['creditLimit'])) : 0;

    await tx.customer.create({
      data: {
        companyId,
        name,
        email: email || null,
        phone: phone || null,
        taxId: taxId || null,
        billingAddress: (row['billingAddress'] as string)?.trim() || null,
        creditLimit: isNaN(creditLimit) ? 0 : creditLimit,
        paymentTerms: (row['paymentTerms'] as string)?.trim() || 'NET_30',
        status: 'ACTIVE',
      },
    });
  }

  private async importVendorRow(
    tx: any,
    companyId: string,
    row: Record<string, unknown>,
    errors: string[],
  ): Promise<void> {
    const name = (row['name'] as string)?.trim();
    const email = (row['email'] as string)?.trim();
    const phone = (row['phone'] as string)?.trim();
    const taxId = (row['taxId'] as string)?.trim();

    if (!name) { errors.push('name is required'); return; }

    const phoneErr = validatePhone(phone);
    if (phoneErr) errors.push(phoneErr);
    const gstErr = validateGst(taxId);
    if (gstErr) errors.push(gstErr);
    if (errors.length) return;

    if (email) {
      const existing = await tx.vendor.findFirst({ where: { companyId, email } });
      if (existing) { errors.push(`Vendor with email ${email} already exists`); return; }
    }

    await tx.vendor.create({
      data: {
        companyId,
        name,
        email: email || null,
        phone: phone || null,
        taxId: taxId || null,
        billingAddress: (row['billingAddress'] as string)?.trim() || null,
        type: (row['type'] as string)?.trim() || 'CARRIER',
        paymentTerms: (row['paymentTerms'] as string)?.trim() || 'NET_30',
        status: 'ACTIVE',
      },
    });
  }

  private async importOpeningBalanceRow(
    tx: any,
    companyId: string,
    row: Record<string, unknown>,
    errors: string[],
  ): Promise<void> {
    const entityType = (row['entityType'] as string)?.trim();
    const entityRef = (row['entityRef'] as string)?.trim();
    const amountRaw = row['amount'];
    const description = (row['description'] as string)?.trim() || 'Opening Balance';

    if (!entityType) errors.push('entityType is required (e.g. CUSTOMER, VENDOR)');
    if (!entityRef) errors.push('entityRef is required (name or ID)');
    if (!amountRaw) errors.push('amount is required');
    if (errors.length) return;

    const amount = parseFloat(String(amountRaw));
    if (isNaN(amount)) { errors.push(`amount "${amountRaw}" is not a valid number`); return; }

    let dateVal = new Date();
    const dateRaw = row['date'];
    if (dateRaw) {
      const parsed = new Date(String(dateRaw));
      if (!isNaN(parsed.getTime())) dateVal = parsed;
    }

    // Opening balances stored as Expense records with category=OPENING_BALANCE
    await tx.expense.create({
      data: {
        companyId,
        category: 'OPENING_BALANCE',
        description: `[${entityType}] ${entityRef}: ${description}`,
        amount,
        currency: (row['currency'] as string)?.trim() || 'INR',
        date: dateVal,
        status: 'APPROVED',
      },
    });
  }
}
