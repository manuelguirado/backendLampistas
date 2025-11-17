import { registerCompany } from '../src/modules/companies/registerCompany';
import { searchCompanyByName } from '../src/modules/admin/searchCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
describe('Search Company E2E', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  it('should search a company by name', async () => {
    // Register an admin
    const admin = await registerAdmin(
      `admin-test-${Date.now()}@example.com`,
      'securePassword',
    );
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'Test State',
      '12345',
    );
    // Register a company
    await registerCompany(
      'Test Company',
      '1234567890',
      `test-company-${Date.now()}@example.com`,
      'companyPassword',
      admin.adminID,
      directions,
    );

    // Search for the company by name
    const result = await searchCompanyByName('Test Company');
    expect(result).toHaveProperty('companyID');
    expect(result.companyID).toBeDefined();
  });
  it('should throw an error when company does not exist', async () => {
    await expect(searchCompanyByName('NonExistentCompany')).rejects.toThrow(
      'Company does not exist',
    );
  });
});
