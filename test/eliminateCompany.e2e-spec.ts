import { eliminateCompany } from '../src/modules/admin/eliminateCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('eliminateCompany', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.$connect();
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should eliminate a company and its associated workers successfully', async () => {
    const directions = await registerDirections(
      'Test Direction',
      '123 Test St',
      '555-1234',
      'test-uuid',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany',
      '59289289042',
      'company-test@gmail.com',
      'password123',
      admin.adminID,
      directions,
    );
    // Then, eliminate the company
    await eliminateCompany(company.companyID);
    // Finally, verify that the company and its workers have been deleted
    const deletedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    const deletedWorkers = await prisma.worker.findMany({
      where: { companyID: company.companyID },
    });
    expect(deletedCompany).toBeNull();
    expect(deletedWorkers).toHaveLength(0);
  });
  it('should throw an error when trying to eliminate a company with invalid ID', async () => {
    await expect(eliminateCompany(0)).rejects.toThrow('Company ID is required');
  });
});
