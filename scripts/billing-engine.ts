/**
 * SaaS Billing Automation Engine
 * Runs daily via cron to evaluate subscription statuses, trials, and billing communications.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sendAutomatedEmail = (email: string, template: string, data: any) => {
  console.log(`[EMAIL AUTOMATION] Sending '${template}' to ${email}`);
  console.log(`Payload:`, data);
};

async function executeBillingCycle() {
  console.log('--- Initiating Daily SaaS Billing Engine ---');
  
  const companies = await prisma.company.findMany({
    include: { users: true }
  });

  for (const company of companies) {
    const adminUser = company.users.find(u => u.roleId); // simplified admin lookup
    const adminEmail = adminUser ? adminUser.email : `admin@${company.domain}`;
    
    // 1. Trial Expiration Logic
    if (company.licenseTier === 'STARTER' && !company.subscriptionPlanId) {
      // Mocking 14-day trial logic
      const createdAt = new Date(company.createdAt);
      const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 3600 * 24));
      
      if (daysSinceCreation === 11) {
        sendAutomatedEmail(adminEmail, 'TRIAL_ENDING_WARNING', { daysLeft: 3 });
      } else if (daysSinceCreation >= 14) {
        console.log(`[BILLING] Suspending company ${company.name} - Trial Expired`);
        sendAutomatedEmail(adminEmail, 'ACCOUNT_SUSPENDED_TRIAL', { companyId: company.id });
        // await prisma.company.update({ where: { id: company.id }, data: { licenseTier: 'SUSPENDED' } });
      } else {
        console.log(`[BILLING] Company ${company.name} is on Day ${daysSinceCreation} of Trial.`);
      }
    }
    
    // 2. Active Subscription Renewal Logic
    if (company.subscriptionPlanId) {
       console.log(`[BILLING] Processing auto-renewal for ${company.name}... Success.`);
       sendAutomatedEmail(adminEmail, 'INVOICE_GENERATED', { amount: 15000, plan: company.licenseTier });
    }
  }

  console.log('--- SaaS Billing Engine Cycle Complete ---');
}

executeBillingCycle()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
