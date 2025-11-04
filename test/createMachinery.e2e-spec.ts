import { createMachinery } from '../src/modules/machinery/createMachinery';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('createMachinery', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should create machinery successfully with valid data', async () => {
    // First, register a company

    const directions = await registerDirections(
      '123 Main St',
      'Metropolis',
      'NY',
      '10001',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );

    const companyEmail = `machinery-test-company-${Date.now()}@example.com`;
    const companyPassword = 'companyPassword';
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      companyEmail,
      companyPassword,
      admin.adminID,
      directions,
    );
    // Then, register a user for that company
    const userEmail = `machinery-test-user-${Date.now()}@example.com`;
    const userPassword = 'userPassword';
    const user = await userRegister('testUser', userEmail, userPassword);
    // Now, create machinery
    const machinery = await createMachinery(
      'Excavator',
      'Heavy duty excavator',
      new Date('2024-12-01'),
      new Date('2024-11-01'),
      new Date('2024-01-15'),
      user.userID,
      company.name,
      'Construction',
      company.companyID,
    );
    expect(machinery).toBeDefined();
    expect(machinery.name).toBe('Excavator');
    expect(machinery.companyID).toBe(company.companyID);
  });
  it('should throw an error when required fields are missing', async () => {
    await expect(
      createMachinery(
        '',
        'Heavy duty excavator',
        new Date('2024-12-01'),
        new Date('2024-11-01'),
        new Date('2024-01-15'),
        1,
        'Test Company',
        'Construction',
        1,
      ),
    ).rejects.toThrow('All fields are required');
  });
});
