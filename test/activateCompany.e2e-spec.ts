import { activateCompany } from '../src/modules/admin/activateCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from '../generated/prisma';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('activateCompany', () => {
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should activate a suspended company successfully', async () => {
    const directions = await registerDirections(
      'Test Direction',
      '123 Test St',
      '555-1234',
      'test-uuid',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany',
      ' 1234567890',
      'testcompany@example.com',
      'password123',
      directions,
    );
    const suspendUntil = new Date();
    suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspend for 7 days
    // Suspend the company
    await prisma.company.update({
      where: { companyID: company.companyID },
      data: {
        suspended: true,
        suspendedUntil: suspendUntil,
      },
    });
    // Then, activate the company
    await activateCompany(company.companyID);
    // Finally, verify that the company is activated
    const activatedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(activatedCompany).not.toBeNull();
    expect(activatedCompany?.suspended).toBe(false);
  });
  it('should throw an error when trying to activate a company with invalid ID', async () => {
    await expect(activateCompany(0)).rejects.toThrow('Company ID is required');
  });
});
