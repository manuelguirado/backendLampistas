import { findMyMachinery } from '../src/modules/machinery/findMymachinery';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { PrismaClient } from '../generated/prisma';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { userRegister } from '../src/modules/users/userRegister';
const prisma = new PrismaClient();
describe('findMyMachinery', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should find machinery for a given company', async () => {
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      directions,
    );
    const user = await userRegister(
      `user-${Date.now()}@test.com`,
      'userPassword',
      'Test User',
    );
    const installedAt = Date.now() - 365 * 24 * 60 * 60 * 1000; // 1 year ago
    // Add machinery for the company
    const machinery1 = await createMachinery(
      'Excavator',
      'caterpillar',
      new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // maintanceDate
      new Date(installedAt), // lastInspectionDate
      new Date(installedAt), // InstalledAT
      user.userID, // clientId
      company.name, // companyName
      'ExcavatorType', // machineType
      company.companyID, // companyID
    );
    const machinery2 = await createMachinery(
      'Bulldozer',
      'Komatsu',
      new Date('2019-01-01'), // maintanceDate
      new Date(installedAt), // lastInspectionDate
      new Date(installedAt), // InstalledAT
      user.userID, // clientId
      company.name, // companyName
      'BulldozerType', // machineType
      company.companyID, // companyID
    );

    // Fetch machinery for the company
    const machineryList = await findMyMachinery(company.companyID);
    expect(machineryList.length).toBe(2);
    const machineryNames = machineryList.map((m) => m.name);
    expect(machinery1).toBeDefined();
    expect(machinery2).toBeDefined();
    expect(machineryNames).toContain('Excavator');
    expect(machineryNames).toContain('Bulldozer');
  });
  it('should return an empty array if no machinery exists for the company', async () => {
    const directions = await registerDirections(
      '456 Another St',
      'Another City',
      'AC',
      '67890',
    );
    const company = await registerCompany(
      'Another Company',
      '0987654321',
      `company-${Date.now()}@test.com`,
      'securePassword',
      directions,
    );
    const machineryList = await findMyMachinery(company.companyID);
    expect(machineryList.length).toBe(0);
  });
});
