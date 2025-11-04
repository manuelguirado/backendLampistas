import { PrismaClient } from '../generated/prisma';
import { listCompany } from '../src/modules/admin/listCompany';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';

const prisma = new PrismaClient();

describe('listCompany', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list all companies', async () => {
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company1 = await registerCompany(
      'Test Company 1',
      '1234567890',
      `company1-${Date.now()}@test.com`,
      'securePassword1',
      admin.adminID,
      directions,
    );
    const company2 = await registerCompany(
      'Test Company 2',
      '0987654321',
      `company2-${Date.now()}@test.com`,
      'securePassword2',
      admin.adminID,
      directions,
    );
    const companies = await listCompany(admin.adminID);
    expect(companies.length).toBeGreaterThanOrEqual(2);
    const companyNames = companies.map((comp) => comp.name);
    expect(company1).toBeDefined();
    expect(company2).toBeDefined();
    expect(companyNames).toContain('Test Company 1');
    expect(companyNames).toContain('Test Company 2');
  });
  it('should return an empty array when no companies are registered', async () => {
    // First, clean up all companies
    const admin = await registerAdmin(
      `admin-no-companies-${Date.now()}@test.com`,
      'adminPassword',
    );
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    const companies = await listCompany(admin.adminID);
    expect(companies).toEqual([]);
  });
});
