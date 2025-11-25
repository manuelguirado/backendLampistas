import { getClientContracts } from '../src/modules/companies/getClientContracts';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { createContract } from '../src/modules/companies/updateTypeContractType';
import { PrismaClient } from '../generated/prisma';
import { registerDirections } from '../src/modules/directions/registerDirections';
const prisma = new PrismaClient();
describe('getClientContracts', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.incidents.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.contracts.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
  });
  afterAll(async () => {
    await prisma.incidents.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.contracts.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });
  it('should retrieve all client contracts successfully', async () => {
    const admin = await registerAdmin(
      `admin-${Date.now()}@example.com`,
      'securepassword',
    );
    const directions = await registerDirections(
      '123 Main St',
      'Test City',
      'Test State',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-${Date.now()}@example.com`,
      'securepassword',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      `test-user-${Date.now()}`,
      `user-${Date.now()}@example.com`,
      'securepassword',
    );
    const user1 = await userRegister(
      `user1-${Date.now()}`,
      `user1-${Date.now()}@example.com`,
      'securepassword',
    );
    const contract = await createContract(
      company.companyID,
      'contract',
      user.userID,
    );

    const contract3 = await createContract(
      company.companyID,
      'contract',
      user1.userID,
    );
    console.log('Created contracts:', contract, contract3);
    const response = await getClientContracts(company.companyID, user.userID);
    expect(response).toBeDefined();
    expect(contract).toBeDefined();
    expect(contract).toBeDefined();

    expect(contract3).toBeDefined();
  });
});
