import { myContracts } from '../src/modules/users/Mycontracts';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { createContract } from '../src/modules/companies/updateTypeContractType';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

describe('My Contracts', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany({});
    await prisma.contracts.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.contracts.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });

  it('should retrieve user contracts', async () => {
    const admin = await registerAdmin(
      'admin-test-${Date.now()}@test.com',
      'password123',
    );
    const directions = await registerDirections(
      '456 another st',
      'los angeles',
      'california',
      '456456',
    );
    const company = await registerCompany(
      'Test Company ' + Date.now(),
      '555-6789',
      `company-test-${Date.now()}@test.com`,
      'password123',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'USER',
      `user-test-${Date.now()}@test.com`,
      'password123',
    );
    const contract = await createContract(
      company.companyID,
      'contract',
      user.userID,
    );
    expect(contract).toBeDefined();
    expect(contract.contractType).toBe('contract');
    const contracts = await myContracts(user.userID);
    expect(contracts).toHaveProperty('token');
    expect(contracts).toHaveProperty('contracts');
  });
});
