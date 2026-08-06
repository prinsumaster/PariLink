const fs = require('fs');
const schemaPath = './apps/api/prisma/schema.prisma';

let schema = fs.readFileSync(schemaPath, 'utf8');

const newModels = `
// ─────────────────────────────────────────────────────────
// MODULE 1: CRM
// ─────────────────────────────────────────────────────────

model CrmLead {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  firstName      String
  lastName       String?
  email          String?
  phone          String?
  companyName    String?
  source         String    // e.g., WEBSITE, REFERRAL, COLD_CALL
  status         String    @default("NEW") // NEW, CONTACTED, QUALIFIED, LOST, CONVERTED
  lostReason     String?
  assignedToId   String?
  assignedTo     User?     @relation("LeadAssignee", fields: [assignedToId], references: [id])
  expectedValue  Float?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?
  activities     CrmActivity[]
}

model CrmActivity {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  leadId         String
  lead           CrmLead   @relation(fields: [leadId], references: [id])
  type           String    // CALL, EMAIL, MEETING, NOTE
  subject        String
  description    String?
  activityDate   DateTime
  performedById  String
  performedBy    User      @relation("ActivityPerformer", fields: [performedById], references: [id])
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model SalesTarget {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  userId         String
  user           User      @relation("UserTargets", fields: [userId], references: [id])
  period         String    // Q1_2026, OCT_2026
  targetAmount   Float
  achievedAmount Float     @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

// ─────────────────────────────────────────────────────────
// MODULE 2: GST FRAMEWORK
// ─────────────────────────────────────────────────────────

model GstTaxRule {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  hsnSacCode     String
  description    String?
  cgstRate       Float
  sgstRate       Float
  igstRate       Float
  cessRate       Float     @default(0)
  isReverseCharge Boolean  @default(false)
  effectiveFrom  DateTime
  effectiveTo    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model TaxLedger {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  transactionType String   // INPUT, OUTPUT
  taxType        String    // CGST, SGST, IGST, CESS
  amount         Float
  referenceId    String?   // Invoice or Bill ID
  referenceType  String?
  date           DateTime
  createdAt      DateTime  @default(now())
}

// ─────────────────────────────────────────────────────────
// MODULE 3: FASTAG FRAMEWORK
// ─────────────────────────────────────────────────────────

model TollAccount {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  provider       String    // e.g., ICICI, PAYTM, AXIS
  accountNumber  String
  walletBalance  Float     @default(0)
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  transactions   TollTransaction[]
}

model TollTransaction {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  accountId      String
  account        TollAccount @relation(fields: [accountId], references: [id])
  vehicleId      String?
  vehicle        Vehicle?    @relation(fields: [vehicleId], references: [id])
  tripId         String?
  trip           Trip?       @relation(fields: [tripId], references: [id])
  tollPlazaName  String
  amount         Float
  transactionDate DateTime
  referenceNo    String
  createdAt      DateTime  @default(now())
}

// ─────────────────────────────────────────────────────────
// MODULE 4: BANK RECONCILIATION
// ─────────────────────────────────────────────────────────

model BankAccount {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  bankName       String
  accountNumber  String
  ifscCode       String?
  currency       String    @default("INR")
  openingBalance Float     @default(0)
  currentBalance Float     @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  statements     BankStatement[]
}

model BankStatement {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  accountId      String
  account        BankAccount @relation(fields: [accountId], references: [id])
  statementDate  DateTime
  closingBalance Float
  status         String    @default("PENDING") // PENDING, RECONCILED
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  transactions   BankTransaction[]
}

model BankTransaction {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  statementId    String
  statement      BankStatement @relation(fields: [statementId], references: [id])
  date           DateTime
  description    String
  referenceNo    String?
  type           String    // DEBIT, CREDIT
  amount         Float
  matchStatus    String    @default("UNMATCHED") // UNMATCHED, MATCHED, IGNORED
  matchedJournalId String?
  createdAt      DateTime  @default(now())
}

// ─────────────────────────────────────────────────────────
// MODULE 5: PERMITS & COMPLIANCE
// ─────────────────────────────────────────────────────────

model VehiclePermit {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  vehicleId      String
  vehicle        Vehicle   @relation(fields: [vehicleId], references: [id])
  permitType     String    // NATIONAL, STATE, FITNESS, PUC, INSURANCE
  permitNumber   String
  issuedDate     DateTime
  expiryDate     DateTime
  issuingAuthority String?
  status         String    @default("ACTIVE") // ACTIVE, EXPIRED, RENEWING
  documentUrl    String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

// ─────────────────────────────────────────────────────────
// MODULE 6 & 7: PAYROLL & ATTENDANCE
// ─────────────────────────────────────────────────────────

model PayrollStructure {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  roleId         String?
  role           Role?     @relation(fields: [roleId], references: [id])
  driverId       String?
  driver         Driver?   @relation(fields: [driverId], references: [id])
  baseSalary     Float     @default(0)
  perKmRate      Float     @default(0)
  dailyAllowance Float     @default(0)
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model PayrollRun {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  periodStart    DateTime
  periodEnd      DateTime
  status         String    @default("DRAFT") // DRAFT, APPROVED, PAID
  totalAmount    Float     @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  payslips       Payslip[]
}

model Payslip {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  runId          String
  run            PayrollRun @relation(fields: [runId], references: [id])
  userId         String?
  user           User?      @relation(fields: [userId], references: [id])
  driverId       String?
  driver         Driver?    @relation(fields: [driverId], references: [id])
  grossAmount    Float
  deductions     Float      @default(0)
  netAmount      Float
  status         String     @default("PENDING") // PENDING, PAID
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model DriverAttendance {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  driverId       String
  driver         Driver    @relation(fields: [driverId], references: [id])
  date           DateTime
  status         String    // PRESENT, ABSENT, LEAVE, TRIP
  checkInTime    DateTime?
  checkOutTime   DateTime?
  geoLat         Float?
  geoLng         Float?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
`;

// Add relationships to Company
const companyRelations = `
  crmLeads                   CrmLead[]
  crmActivities              CrmActivity[]
  salesTargets               SalesTarget[]
  gstTaxRules                GstTaxRule[]
  taxLedgers                 TaxLedger[]
  tollAccounts               TollAccount[]
  tollTransactions           TollTransaction[]
  bankAccounts               BankAccount[]
  bankStatements             BankStatement[]
  bankTransactions           BankTransaction[]
  vehiclePermits             VehiclePermit[]
  payrollStructures          PayrollStructure[]
  payrollRuns                PayrollRun[]
  payslips                   Payslip[]
  driverAttendances          DriverAttendance[]
`;

schema = schema.replace(/model Company \{[\s\S]*?(?=\})/, match => match + companyRelations);

// Add to User
const userRelations = `
  assignedLeads              CrmLead[]     @relation("LeadAssignee")
  performedActivities        CrmActivity[] @relation("ActivityPerformer")
  salesTargets               SalesTarget[] @relation("UserTargets")
  payslips                   Payslip[]
`;
schema = schema.replace(/model User \{[\s\S]*?(?=\})/, match => match + userRelations);

// Add to Vehicle
const vehicleRelations = `
  tollTransactions           TollTransaction[]
  permits                    VehiclePermit[]
`;
schema = schema.replace(/model Vehicle \{[\s\S]*?(?=\})/, match => match + vehicleRelations);

// Add to Trip
const tripRelations = `
  tollTransactions           TollTransaction[]
`;
schema = schema.replace(/model Trip \{[\s\S]*?(?=\})/, match => match + tripRelations);

// Add to Driver
const driverRelations = `
  payrollStructures          PayrollStructure[]
  payslips                   Payslip[]
  attendances                DriverAttendance[]
`;
schema = schema.replace(/model Driver \{[\s\S]*?(?=\})/, match => match + driverRelations);

// Add to Role
const roleRelations = `
  payrollStructures          PayrollStructure[]
`;
schema = schema.replace(/model Role \{[\s\S]*?(?=\})/, match => match + roleRelations);

fs.writeFileSync(schemaPath, schema + "\n" + newModels);
console.log("Prisma schema updated.");
