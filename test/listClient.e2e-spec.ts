import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { createMachinery } from '../src/modules/machinery/createMachinery';
import { PrismaClient } from '../generated/prisma';
import { listClients } from '../src/modules/companies/listClients';
const prisma = new PrismaClient();

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('listClients', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.$connect();
    await prisma.machinery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.machinery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list clients with their machinery', async () => {
    const directions = await registerDirections(
      '123 Main St',
      'City',
      'State',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-example.com-${Date.now()}`,
      'password123',
    );
    const company = await registerCompany(
      'Test Company',
      '555-1234',
      `company-${Date.now()}@example.com`,
      'password123',
      admin.adminID,
      directions,
    );
    expect(company).toBeDefined();

    const user = await userRegister(
      'Test User',
      `user-${Date.now()}@example.com`,
      'password123',
      company.companyID,
    );
    expect(user).toBeDefined();
    const machinery1 = await createMachinery(
      'Excavator',
      'CAT320',
      new Date('2020-01-01'),
      new Date('2025-01-01'),
      new Date('2023-01-01'),
      user.userID,
      company.name,
      'Construction',
      company.companyID,
      `AN-${Date.now()}`,
    );
    expect(machinery1).toBeDefined();
    const machinery2 = await createMachinery(
      'Bulldozer',
      'CATD6',
      new Date('2023-01-01'),
      new Date('2025-01-01'),
      new Date('2023-01-01'),
      user.userID,
      company.name,
      'Construction',
      company.companyID,
      `AN-${Date.now()}`,
    );
    expect(machinery2).toBeDefined();
    const result = await listClients(company.companyID, 5, 0);
    expect(result).toBeDefined();
  });
  it('should return empty list if no clients', async () => {
    const directions = await registerDirections(
      '456 Elm St',
      'City',
      'State',
      '67890',
    );
    const admin = await registerAdmin(
      `admin2-example.com-${Date.now()}`,
      'password123',
    );
    const company = await registerCompany(
      'Empty Company',
      '555-5678',
      `empty-company-${Date.now()}@example.com`,
      'password123',
      admin.adminID,
      directions,
    );
    expect(company).toBeDefined();

    const result = await listClients(company.companyID, 5, 0);
    expect(result).toBeDefined();
    if (Array.isArray(result)) {
      expect(result).toEqual([]);
    } else {
      expect(result).toHaveProperty('clients');
      expect(result.clients).toEqual([]);
    }
  });
});
