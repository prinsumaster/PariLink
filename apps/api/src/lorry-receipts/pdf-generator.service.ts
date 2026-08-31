import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { LorryReceipt, Company, Load, Vehicle } from '@prisma/client';

type PopulatedLR = LorryReceipt & {
  company: Company;
  load: Load;
  vehicle?: Vehicle | null;
};

@Injectable()
export class PdfGeneratorService {
  async generateBiltyPdf(lr: PopulatedLR, copyType: string = 'OFFICE'): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' }) as any;
        const buffers: Buffer[] = [];

        doc.on('data', (buffer: any) => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: any) => reject(err));

        // Format copyType label
        const copyLabel = `[ ${copyType.toUpperCase()} COPY ]`;

        // 1. Header
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text(lr.company.name, { align: 'center' });
        
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(`GSTIN: ${lr.company.taxId || 'NOT PROVIDED'}`, { align: 'center' })
          .moveDown();

        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('LORRY RECEIPT / CONSIGNMENT NOTE', { align: 'center' })
          .moveDown();

        // 2. Meta Info (LR Number, Date, Copy Label)
        doc.fontSize(10).font('Helvetica-Bold').text(copyLabel, { align: 'right' }).moveUp();
        doc.font('Helvetica').text(`LR No: ${lr.lrNumber}`, 50, doc.y);
        doc.text(`Date: ${lr.date.toLocaleDateString()}`, 50, doc.y + 15);
        doc.text(`Vehicle No: ${lr.vehicleNumber || 'TBD'}`, 50, doc.y + 15);
        
        doc.text(`From: ${lr.fromStation}`, 350, doc.y - 30);
        doc.text(`To: ${lr.toStation}`, 350, doc.y + 15);
        doc.text(`E-Way Bill: ${lr.ewayBillNumber || 'N/A'}`, 350, doc.y + 15);
        
        doc.moveDown(2);

        // 3. Consignor / Consignee
        const startY = doc.y;
        
        // Consignor
        doc.font('Helvetica-Bold').text('CONSIGNOR', 50, startY);
        doc.font('Helvetica').text(lr.consignorName, 50, startY + 15);
        doc.text(lr.consignorAddress || '', 50, startY + 30, { width: 200 });
        doc.text(`GSTIN: ${lr.consignorGstin || 'URD'}`, 50, startY + 60);

        // Consignee
        doc.font('Helvetica-Bold').text('CONSIGNEE', 300, startY);
        doc.font('Helvetica').text(lr.consigneeName, 300, startY + 15);
        doc.text(lr.consigneeAddress || '', 300, startY + 30, { width: 200 });
        doc.text(`GSTIN: ${lr.consigneeGstin || 'URD'}`, 300, startY + 60);

        doc.moveDown(3);

        // 4. Goods Details Table Header
        const tableTop = doc.y + 30;
        doc.font('Helvetica-Bold');
        doc.text('Packages', 50, tableTop);
        doc.text('Description of Goods', 120, tableTop);
        doc.text('HSN/SAC', 300, tableTop);
        doc.text('Weight', 380, tableTop);
        doc.text('Amount (₹)', 450, tableTop, { width: 90, align: 'right' });

        // Table Line
        doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

        // 5. Goods Row
        doc.font('Helvetica');
        const rowY = tableTop + 25;
        doc.text(`${lr.packagesCount} ${lr.packingType || 'Pkgs'}`, 50, rowY);
        doc.text(lr.goodsDescription, 120, rowY, { width: 170 });
        doc.text('9965', 300, rowY); // SAC 9965: Goods Transport Agency
        doc.text(`${lr.actualWeightKg || 0} kg`, 380, rowY);
        
        // Charges Column
        doc.text('Freight:', 380, rowY + 30);
        doc.text(lr.freightAmount.toFixed(2), 450, rowY + 30, { width: 90, align: 'right' });
        
        doc.text('Hamali:', 380, rowY + 45);
        doc.text(lr.hamaliCharges.toFixed(2), 450, rowY + 45, { width: 90, align: 'right' });
        
        doc.text('Other:', 380, rowY + 60);
        doc.text(lr.otherCharges.toFixed(2), 450, rowY + 60, { width: 90, align: 'right' });

        // 6. GST Breakup (Assuming IGST 5% as standard, or CGST/SGST if intra-state)
        const taxable = lr.freightAmount + lr.hamaliCharges + lr.otherCharges;
        let cgst = 0, sgst = 0, igst = 0;
        
        // Simple heuristic: if GSTINs start with same state code, intra-state. 
        // We'll fall back to IGST 5% for safety if undetermined.
        const isIntraState = lr.consignorGstin && lr.consigneeGstin && lr.consignorGstin.substring(0, 2) === lr.consigneeGstin.substring(0, 2);
        
        if (isIntraState) {
          cgst = taxable * 0.025;
          sgst = taxable * 0.025;
          doc.text('CGST (2.5%):', 380, rowY + 75);
          doc.text(cgst.toFixed(2), 450, rowY + 75, { width: 90, align: 'right' });
          doc.text('SGST (2.5%):', 380, rowY + 90);
          doc.text(sgst.toFixed(2), 450, rowY + 90, { width: 90, align: 'right' });
        } else {
          igst = taxable * 0.05;
          doc.text('IGST (5%):', 380, rowY + 75);
          doc.text(igst.toFixed(2), 450, rowY + 75, { width: 90, align: 'right' });
        }

        const grandTotal = taxable + cgst + sgst + igst;

        // Line before total
        doc.moveTo(380, rowY + 110).lineTo(540, rowY + 110).stroke();

        doc.font('Helvetica-Bold');
        doc.text('Total Amount:', 380, rowY + 120);
        doc.text(grandTotal.toFixed(2), 450, rowY + 120, { width: 90, align: 'right' });

        // 7. Amount in words
        doc.font('Helvetica-Oblique');
        doc.text(`Amount in Words: Rupees ${this.numberToWords(grandTotal)} Only`, 50, rowY + 150);
        
        // 8. Signatures
        doc.font('Helvetica-Bold');
        doc.text('For ' + lr.company.name, 380, doc.y + 60, { width: 160, align: 'right' });
        doc.text('Authorised Signatory', 380, doc.y + 40, { width: 160, align: 'right' });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const numStr = Math.floor(num).toString();
    if (numStr.length > 9) return 'Overflow';
    
    const n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    
    let str = '';
    str += (n[1] !== '00') ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (n[2] !== '00') ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (n[3] !== '00') ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (n[4] !== '0') ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (n[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) : '';
    
    return str.trim();
  }
}
