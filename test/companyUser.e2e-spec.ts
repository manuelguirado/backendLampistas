import { companyUsers } from '../src/modules/companies/companyUsers';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { userRegister } from '../src/modules/users/userRegister';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

describe('companyUsers', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });

  it('should return users associated with a company', async () => {
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
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const user1 = await userRegister(
      `user1-${Date.now()}@test.com`,
      'userPassword1',
      'Test User 1',
      company.companyID,
    );
    const user2 = await userRegister(
      'Test User 2',
      `user2-${Date.now()}@test.com`,
      'userPassword2',
      company.companyID,
    );

    expect(user1).toBeDefined();
    expect(user2).toBeDefined();
    const users = await companyUsers(company.companyID);
    expect(users).toHaveLength(2);
    const userEmails = users.map((u) => u.email);
    expect(userEmails).toContain(user1.email);
    expect(userEmails).toContain(user2.email);
  });

  it('should return an empty array if no users are associated with the company', async () => {
    const directions = await registerDirections(
      '456 Another St, Another City, AC 67890',
      'Another City',
      'AC',
      '67890',
    );
    const admin = await registerAdmin(
      `admin2-${Date.now()}@test.com`,
      'adminPassword2',
    );
    const company = await registerCompany(
      'Another Test Company',
      '0987654321',
      `another-company-${Date.now()}@test.com`,
      'anotherSecurePassword',
      admin.adminID,
      directions,
    );

    const users = await companyUsers(company.companyID);
    expect(users).toEqual([]);
  });
});
