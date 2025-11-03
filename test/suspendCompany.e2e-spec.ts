import { suspendCompany } from '../src/modules/admin/suspendCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from '../generated/prisma';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('suspendCompany', () => {
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
  it('should suspend a company successfully', async () => {
    const directions = await registerDirections(
      'Test Direction',
      '123 Test St',
      '555-1234',
      'test-uuid',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany',
      '59289289042',
      'testcompany@example.com',
      'password123',
      directions,
    );
    const suspendUntil = new Date();
    suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspender por 7 días
    // Then, suspend the company
    await suspendCompany(company.companyID, suspendUntil);
    // Finally, verify that the company is suspended
    const suspendedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(suspendedCompany).not.toBeNull();
    expect(suspendedCompany?.suspended).toBe(true);
  });
  it('should suspend a company indefinitely when no date is provided', async () => {
    const directions = await registerDirections(
      'Test Direction 2',
      '456 Test Ave',
      '555-5678',
      'test-uuid-2',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany2',
      '12345678901',
      'testcompany2@example.com',
      'password456',
      directions,
    );
    // Then, suspend the company without a date
    await suspendCompany(company.companyID);
    // Finally, verify that the company is suspended indefinitely
    const suspendedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(suspendedCompany).not.toBeNull();
    expect(suspendedCompany?.suspended).toBe(true);
    expect(suspendedCompany?.suspendedUntil).toBeNull();
  });
  it('should throw an error when trying to suspend a company with invalid ID', async () => {
    await expect(suspendCompany(0)).rejects.toThrow('Company ID is required');
  });
});
