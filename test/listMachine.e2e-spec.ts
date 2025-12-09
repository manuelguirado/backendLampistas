import { listMachinery } from '../src/modules/machinery/listMachinery';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerDirections } from '../src/modules/directions/registerDirections';
import type { MachineryType } from '../src/utils/types/machineType';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

describe('End to End Test for listing machinery', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.user.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
  });
  afterAll(async () => {
    await prisma.contracts.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.user.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });

  it('should list machinery for a company', async () => {
    // Register an admin
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'securePassword',
    );
    const directions = await registerDirections(
      '123 Main St',
      'Test City',
      'Test State',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '123-456-7890',
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
    const machineryData: MachineryType = {
      name: 'Excavator',
      companyID: company.companyID,
      model: 'CAT 320D',
      serialNumber: 'SN123456',
      machineType: 'HEAVY',
      description: 'A powerful excavator',
      brand: 'Caterpillar',
      companyName: company.name,
      clientID: user.userID,
    };
    // Create machinery for the company
    const machinery1 = await createMachinery(machineryData, user.userID);
    const machine: MachineryType = {
      name: 'Bulldozer',
      companyID: company.companyID,
      model: 'CAT D6T',
      serialNumber: 'SN654321',
      machineType: 'HEAVY',
      description: 'A strong bulldozer',
      brand: 'Caterpillar',
      companyName: company.name,
      clientID: user.userID,
    };
    const machinery2 = await createMachinery(machine, user.userID);
    // List machinery for the company
    const machineryList = await listMachinery(company.companyID, 10, 0);
    expect(machinery1).toBeDefined();
    expect(machinery2).toBeDefined();
    expect(machineryList.machinery.length).toBe(2);
  });
});
