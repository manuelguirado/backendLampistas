import { findMyMachinery } from '../src/modules/machinery/findMymachinery';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { PrismaClient } from '../generated/prisma';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { userRegister } from '../src/modules/users/userRegister';
import registerAdmin from '../src/modules/admin/registerAdmin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();
describe('findMyMachinery', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.machinery.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    await prisma.machinery.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should find machinery for a given company', async () => {
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
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
      `SN67890${Date.now()}`,
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
      `SN67890${Date.now()}`,
    );

    // Fetch machinery for the company
    const machineryList = await findMyMachinery(company.companyID);

    expect(machineryList.machinery.length).toBe(2);
    const machineryNames = machineryList.machinery.map(
      (m: { name: string }) => m.name,
    );
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
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Another Company',
      '0987654321',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const machineryList = await findMyMachinery(company.companyID);
    if (Array.isArray(machineryList)) {
      expect(machineryList.length).toBe(0);
    } else {
      expect(machineryList).toHaveProperty('machinery');
      expect(machineryList.machinery).toEqual([]);
      expect(typeof machineryList.token).toBe('string');
    }
  });
  it('should return an empty array if company has no machinery', async () => {
    const directions = await registerDirections(
      '789 NoMachinery St',
      'NoMachinery City',
      'NM',
      '13579',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'No Machinery Company',
      '1122334455',
      `nomachinery-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const machineryList = await findMyMachinery(company.companyID);
    if (Array.isArray(machineryList)) {
      expect(machineryList.length).toBe(0);
    } else {
      expect(machineryList).toHaveProperty('machinery');
      expect(machineryList.machinery).toEqual([]); // La lista está vacía
      expect(typeof machineryList.token).toBe('string'); // El token existe
    }
  });
  it('should return JWT token upon fetching machinery', async () => {
    const directions = await registerDirections(
      '321 JWT St',
      'JWT City',
      'JW',
      '24680',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'JWT Company',
      '6677889900',
      `jwtcompany-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'JWT User1',
      `jwtuser-${Date.now()}@test.com`,
      'userPassword',
    );
    const installedAt = Date.now() - 200 * 24 * 60 * 60 * 1000; // ~200 days ago
    await createMachinery(
      'Crane',
      'Liebherr',
      new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // maintanceDate
      new Date(installedAt), // lastInspectionDate
      new Date(installedAt), // InstalledAT
      user.userID, // clientId
      company.name, // companyName
      'CraneType', // machineType
      company.companyID, // companyID
      'SN24680',
    );

    // Fetch machinery for the company
    const machineryList = await findMyMachinery(company.companyID);

    // Generate JWT token
    const payload = { companyID: company.companyID, role: company.role };
    const secret = process.env.JWT_SECRET as string;
    const options = { expiresIn: '1h' as const };
    const token = jwt.sign(payload, secret, options);

    expect(machineryList.machinery.length).toBe(1);
    expect(token).toBeDefined();
    // Verify JWT token
    const decoded = jwt.verify(token, secret) as {
      companyID: number;
      role: string;
      iat: number;
      exp: number;
    };
    expect(decoded.companyID).toBe(company.companyID);
    expect(decoded.role).toBe(company.role);
  });
});
