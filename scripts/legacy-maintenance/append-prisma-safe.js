const fs = require('fs');
const schemaPath = './apps/api/prisma/schema.prisma';

let lines = fs.readFileSync(schemaPath, 'utf8').split('\n');

function insertBeforeEnd(modelName, newRelations) {
  let insideModel = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`model ${modelName} {`)) {
      insideModel = true;
    }
    if (insideModel && lines[i].startsWith('}')) {
      lines.splice(i, 0, newRelations);
      return;
    }
  }
}

insertBeforeEnd('Company', `
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
`);

insertBeforeEnd('User', `
  assignedLeads              CrmLead[]     @relation("LeadAssignee")
  performedActivities        CrmActivity[] @relation("ActivityPerformer")
  salesTargets               SalesTarget[] @relation("UserTargets")
  payslips                   Payslip[]
`);

insertBeforeEnd('Vehicle', `
  tollTransactions           TollTransaction[]
  permits                    VehiclePermit[]
`);

insertBeforeEnd('Trip', `
  tollTransactions           TollTransaction[]
`);

insertBeforeEnd('Driver', `
  payrollStructures          PayrollStructure[]
  payslips                   Payslip[]
  attendances                DriverAttendance[]
`);

insertBeforeEnd('Role', `
  payrollStructures          PayrollStructure[]
`);

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
  source         String    @default("WEBSITE")
  status         String    @default("NEW") 
  lostReason     String?
  assignedToId   String?
  assignedTo     User?     @relation("LeadAssignee", fields: [assignedToId], references: [id])
  expectedValue  Float?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?
  activities     CrmActivity[]
  
  @@index([companyId])
}

model CrmActivity {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  leadId         String
  lead           CrmLead   @relation(fields: [leadId], references: [id])
  type           String    
  subject        String
  description    String?
  activityDate   DateTime
  performedById  String
  performedBy    User      @relation("ActivityPerformer", fields: [performedById], references: [id])
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  @@index([companyId, leadId])
}

model SalesTarget {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  userId         String
  user           User      @relation("UserTargets", fields: [userId], references: [id])
  period         String    
  targetAmount   Float
  achievedAmount Float     @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  @@index([companyId, userId])
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
  
  @@index([companyId])
}

model TaxLedger {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  transactionType String   
  taxType        String    
  amount         Float
  referenceId    String?   
  referenceType  String?
  date           DateTime
  createdAt      DateTime  @default(now())
  
  @@index([companyId])
}

// ─────────────────────────────────────────────────────────
// MODULE 3: FASTAG FRAMEWORK
// ─────────────────────────────────────────────────────────

model TollAccount {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  provider       String    
  accountNumber  String
  walletBalance  Float     @default(0)
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  transactions   TollTransaction[]
  
  @@index([companyId])
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
  
  @@index([companyId])
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
  
  @@index([companyId])
}

model BankStatement {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  accountId      String
  account        BankAccount @relation(fields: [accountId], references: [id])
  statementDate  DateTime
  closingBalance Float
  status         String    @default("PENDING") 
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  transactions   BankTransaction[]
  
  @@index([companyId, accountId])
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
  type           String    
  amount         Float
  matchStatus    String    @default("UNMATCHED") 
  matchedJournalId String?
  createdAt      DateTime  @default(now())
  
  @@index([companyId, statementId])
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
  permitType     String    
  permitNumber   String
  issuedDate     DateTime
  expiryDate     DateTime
  issuingAuthority String?
  status         String    @default("ACTIVE") 
  documentUrl    String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  @@index([companyId, vehicleId])
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
  
  @@index([companyId])
}

model PayrollRun {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  periodStart    DateTime
  periodEnd      DateTime
  status         String    @default("DRAFT") 
  totalAmount    Float     @default(0)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  payslips       Payslip[]
  
  @@index([companyId])
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
  status         String     @default("PENDING") 
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  
  @@index([companyId, runId])
}

model DriverAttendance {
  id             String    @id @default(uuid())
  companyId      String
  company        Company   @relation(fields: [companyId], references: [id])
  driverId       String
  driver         Driver    @relation(fields: [driverId], references: [id])
  date           DateTime
  status         String    
  checkInTime    DateTime?
  checkOutTime   DateTime?
  geoLat         Float?
  geoLng         Float?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  @@index([companyId, driverId])
}
`;

fs.writeFileSync(schemaPath, lines.join('\n') + '\n' + newModels, 'utf8');
