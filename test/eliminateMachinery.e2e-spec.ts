import { eliminateMachinery } from '../src/modules/machinery/eliminateMachinery';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import type { MachineryType } from '../src/utils/types/machineType';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
describe('Eliminate Machinery', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
  });
  afterAll(async () => {
    await prisma.contracts.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });
  it('should eliminate machinery successfully', async () => {
    const admin = await registerAdmin(
      `admin${Date.now()}@test.com`,
      'password123',
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
      `company${Date.now()}@test.com`,
      'password123',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'Test User',
      `user${Date.now()}@test.com`,
      'password123',
      company.companyID,
    );
    const machineData: MachineryType = {
      name: 'Test Machinery',
      model: 'Model X',
      installedAT: new Date('2023-01-01'),
      lastInspectionDate: new Date('2023-06-01'),
      machineType: 'Type A',
      companyID: company.companyID,
      description: 'description of test machinery',
      brand: 'brandExample',
      clientID: user.userID,
      serialNumber: 'abc123456',
    };
    const machinery = await createMachinery(machineData, user.userID);
    const response = await eliminateMachinery(machinery.id);
    expect(response).toBeDefined();
    expect(response).toHaveProperty(
      'message',
      'Machinery eliminated successfully',
    );
    expect(response).toHaveProperty('token');
  });
});
