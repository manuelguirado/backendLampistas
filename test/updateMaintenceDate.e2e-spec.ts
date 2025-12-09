import { updateMaintenceDate } from '../src/modules/machinery/updateMaintenceDate';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { userRegister } from '../src/modules/users/userRegister';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import registerAdmin from '../src/modules/admin/registerAdmin';
import type { MachineryType } from '../src/utils/types/machineType';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
describe('update Maintence date', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.machinery.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.directions.deleteMany();
  });
  afterAll(async () => {
    await prisma.machinery.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.$disconnect();
  });
  it('should update the maintenance date of a machinery', async () => {
    const admin = await registerAdmin(
      `admin${Date.now()}@test.com`,
      'securepassword',
    );
    const companyDirections = await registerDirections(
      '123 Main St',
      'Testville',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      `Test Company ${Date.now()}`,
      '555-1234',
      `company${Date.now()}@test.com`,
      'securepassword',
      admin.adminID,
      companyDirections,
    );
    const user = await userRegister(
      `user${Date.now()}@test.com`,
      'securepassword',
      'Test User',
    );
    const machineryData: MachineryType = {
      description: 'Test Machinery',
      machineType: 'Excavator',
      brand: 'Caterpillar',
      model: 'CAT320',
      serialNumber: `SN${Date.now()}`,
      companyName: company.name,
      companyID: company.companyID,
      name: 'Excavator 1',
      clientID: user.userID,
    };
    const machinery = await createMachinery(machineryData, user.userID);
    const newMaintenceDate = new Date('2024-12-31');
    const updatedMachinery = await updateMaintenceDate(
      machinery.id,
      newMaintenceDate,
    );
    expect(updatedMachinery).toBeDefined();
  });
});
