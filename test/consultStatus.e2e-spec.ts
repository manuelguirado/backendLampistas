import { consultStatus } from '../src/modules/admin/consultStatus';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

describe('consultStatus', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });

  it('should return the suspension status of a company', async () => {
    const directions = await registerDirections(
      '123 Test St',
      'Testville',
      'Testate',
      '12345',
    );

    const admin = await registerAdmin(
      `adminconsultstatustest-${Date.now()}@test.com`,
      'adminPassword',
    );

    const company = await registerCompany(
      `ConsultStatus Test Company ${Date.now()}`,
      '1234567890',
      `consult-status-test-company-${Date.now()}@test.com`,
      'securepassword',
      admin.adminID,
      directions,
    );

    const status = await consultStatus(company.companyID);
    expect(status).toBe(false); // Assuming new companies are not suspended
  });
});
