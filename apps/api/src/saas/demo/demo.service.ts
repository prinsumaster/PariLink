import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class DemoService {
  private readonly logger = new Logger(DemoService.name);

  constructor(private readonly prisma: PrismaService) {}

  async provisionDemoTenant() {
    this.logger.log('Provisioning new Demo Tenant...');
    const demoCompanyId = `demo-co-${randomUUID()}`;
    const adminEmail = `admin-${demoCompanyId}@demo.parilink.com`;
    const password = 'demoPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.runAsSystem('demo-provision', async (tx) => {
      // Create Company
      const company = await tx.company.create({
        data: {
          id: demoCompanyId,
          name: 'PariLink Demo Logistics Pvt Ltd',
          status: 'ACTIVE',
        },
      });

      // Create Admin Role
      const adminRole = await tx.role.create({
        data: {
          id: `demo-role-admin-${demoCompanyId}`,
          companyId: company.id,
          name: 'Admin',
        },
      });

      // Create Admin User
      await tx.user.create({
        data: {
          id: `demo-user-admin-${demoCompanyId}`,
          companyId: company.id,
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'Admin',
          roleId: adminRole.id,
          status: 'ACTIVE',
        },
      });

      // Drivers
      const driverNames = [
        { f: 'Ramesh', l: 'Patel' }, { f: 'Suresh', l: 'Kumar' }, { f: 'Amit', l: 'Singh' }
      ];
      const createdDrivers = [];
      for (let i = 0; i < driverNames.length; i++) {
        const d = await tx.driver.create({
          data: {
            companyId: company.id,
            firstName: driverNames[i].f,
            lastName: driverNames[i].l,
            status: 'AVAILABLE',
          },
        });
        createdDrivers.push(d);
      }

      // Vehicles
      const vehiclePlates = ['MH-12-CD-5678', 'MH-14-AB-1234', 'GJ-01-EF-9012'];
      const createdVehicles = [];
      for (let i = 0; i < vehiclePlates.length; i++) {
        const v = await tx.vehicle.create({
          data: {
            companyId: company.id,
            make: 'Tata Motors',
            model: 'Prima 4028.S',
            licensePlate: vehiclePlates[i],
            type: 'TRUCK',
            status: 'IN_SERVICE',
          },
        });
        createdVehicles.push(v);
      }

      // Customers
      const customerNames = ['Bhonsle Transport', 'Gupta Roadways'];
      const createdCustomers = [];
      for (let i = 0; i < customerNames.length; i++) {
        const c = await tx.customer.create({
          data: {
            companyId: company.id,
            name: customerNames[i],
            taxId: `27AAAAA000${i}A1Z5`,
            status: 'ACTIVE',
          },
        });
        createdCustomers.push(c);
      }

      // Loads
      const route = { o: 'Mumbai, MH', d: 'Delhi, DL' };
      const [oCity, oState] = route.o.split(', ');
      const [dCity, dState] = route.d.split(', ');
      
      for (let i = 0; i < 2; i++) {
        await tx.load.create({
          data: {
            companyId: company.id,
            customerId: createdCustomers[0].id,
            referenceNumber: `LD-DEMO-${i}`,
            originAddress: 'MIDC',
            originCity: oCity,
            originState: oState,
            destinationAddress: 'Transport Nagar',
            destinationCity: dCity,
            destinationState: dState,
            pickupDate: new Date(),
            deliveryDate: new Date(Date.now() + 86400000 * 3),
            rate: 25000,
            weight: 15000,
            status: 'PENDING',
          },
        });
      }
    });

    this.logger.log(`Demo Tenant provisioned: ${demoCompanyId}`);
    return {
      success: true,
      companyId: demoCompanyId,
      adminEmail,
      password,
    };
  }

  async destroyDemoTenant(companyId: string) {
    this.logger.log(`Destroying Demo Tenant: ${companyId}`);
    if (!companyId.startsWith('demo-co-')) {
      throw new Error('Only demo tenants can be destroyed via this endpoint');
    }

    await this.prisma.runAsSystem('demo-destroy', async (tx) => {
      // Hygiene cleanup for the tenant
      await tx.vehicleLocation.deleteMany({ where: { companyId } });
      await tx.journalLine.deleteMany({ where: { companyId } });
      await tx.journalEntry.deleteMany({ where: { companyId } });
      await tx.payment.deleteMany({ where: { companyId } });
      await tx.invoice.deleteMany({ where: { companyId } });
      await tx.lorryReceipt.deleteMany({ where: { companyId } });
      await tx.lrSequence.deleteMany({ where: { companyId } });
      await tx.load.updateMany({ where: { companyId }, data: { tripId: null } });
      await tx.trip.deleteMany({ where: { companyId } });
      await tx.load.deleteMany({ where: { companyId } });
      await tx.account.deleteMany({ where: { companyId } });
      await tx.customer.deleteMany({ where: { companyId } });
      await tx.vehicle.deleteMany({ where: { companyId } });
      await tx.driver.deleteMany({ where: { companyId } });
      await tx.user.deleteMany({ where: { companyId } });
      await tx.role.deleteMany({ where: { companyId } });
      await tx.company.deleteMany({ where: { id: companyId } });
    });

    this.logger.log(`Demo Tenant destroyed: ${companyId}`);
    return { success: true };
  }
}
