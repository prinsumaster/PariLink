const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'apps/api/prisma/schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

schema = schema.replace(
  /model Company \{[\s\S]*?\n\}/,
  (match) => {
    return match.replace(
      /vendors\s+Vendor\[\]\n\s+vendorBills\s+VendorBill\[\]/,
      `vendors                    Vendor[]\n  vendorBills                VendorBill[]\n  lorryReceipts              LorryReceipt[]\n  lrSequences                LrSequence[]`
    );
  }
);

schema = schema.replace(
  /model Load \{[\s\S]*?\n\}/,
  (match) => {
    return match.replace(
      /trips\s+Trip\[\]/,
      `trips                      Trip[]\n  lorryReceipts              LorryReceipt[]`
    );
  }
);

schema = schema.replace(
  /model Vehicle \{[\s\S]*?\n\}/,
  (match) => {
    return match.replace(
      /users\s+User\[\]\n\n\s+payrollStructures PayrollStructure\[\]/,
      `users       User[]\n\n  payrollStructures PayrollStructure[]\n  lorryReceipts     LorryReceipt[]`
    );
  }
);

const models = `

model LorryReceipt {
  id               String    @id @default(cuid())
  companyId        String
  loadId           String
  lrNumber         String
  consignorName    String
  consignorGstin   String?
  consignorAddress String?
  consigneeName    String
  consigneeGstin   String?
  consigneeAddress String?
  fromStation      String
  toStation        String
  vehicleId        String?
  vehicleNumber    String?
  goodsDescription String
  packagesCount    Int
  packingType      String?
  actualWeightKg   Float?
  chargedWeightKg  Float?
  invoiceValue     Float?
  freightAmount    Float
  hamaliCharges    Float
  otherCharges     Float
  gstAmount        Float
  totalAmount      Float
  paymentType      String
  ewayBillNumber   String?
  status           String    @default("GENERATED")
  podDocumentId    String?
  date             DateTime  @default(now())
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  deletedAt        DateTime?

  company Company  @relation(fields: [companyId], references: [id])
  load    Load     @relation(fields: [loadId], references: [id])
  vehicle Vehicle? @relation(fields: [vehicleId], references: [id])
}

model LrSequence {
  id            String @id @default(cuid())
  companyId     String
  financialYear String
  lastNumber    Int

  company Company @relation(fields: [companyId], references: [id])

  @@unique([companyId, financialYear])
}
`;

schema += models;

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated successfully');
