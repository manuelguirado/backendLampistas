import type { MachineryType } from '../src/utils/types/machineType';
import { editMachinery } from '../src/modules/machinery/editMachinery';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { userRegister } from '../src/modules/users/userRegister';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
describe('Edit Machinery', () => {
  beforeAll(async () => {
    await prisma.$connect();

    await prisma.contracts.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.user.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
  });
  afterAll(async () => {
    await prisma.contracts.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.user.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });
  it('should edit machinery successfully', async () => {
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'securePassword',
    );
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'Test State',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'Test User',
      `user-${Date.now()}@test.com`,
      'securePassword',
      company.companyID,
    );
    const machineData: MachineryType = {
      description: 'Excavator for construction',
      machineType: 'Excavator',
      brand: 'Caterpillar',
      model: '320D',
      installedAT: new Date('2023-01-15'),
      serialNumber: `SN-${Date.now()}`,
      companyID: company.companyID,
      name: 'Excavator 320D',
      clientID: user.userID,
    };
    const machinery = await createMachinery(machineData, user.userID);
    const updateData = {
      name: 'Updated Excavator',
      description: 'Updated description for the excavator',
    };
    const updatedMachinery = await editMachinery(
      machinery.id,
      company.companyID,
      updateData,
    );
    expect(updatedMachinery).toBeDefined();
  });
});
