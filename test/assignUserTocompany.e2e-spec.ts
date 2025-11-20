import { assingCompanyToUser } from '../src/modules/companies/assignUserCompany';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
describe('Assign User to company', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.worker.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
  });
  afterAll(async () => {
    await prisma.worker.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.company.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });
  it('should assign a company to a user', async () => {
    const admin = await registerAdmin(
      `admin-test-${Date.now()}@lampistas.com`,
      'securepassword',
    );
    const directions = {
      address: '123 Main St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
    };
    const company = await registerCompany(
      `Test Company ${Date.now()}`,
      '555-1234',
      `company-test-${Date.now()}@lampistas.com`,
      'securepassword',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'Test User',
      `user-test-${Date.now()}@lampistas.com`,
      'userpassword',
    );
    const updatedUser = await assingCompanyToUser(
      company.companyID,
      user.userID,
    );
    expect(updatedUser.companyID).toBe(company.companyID);
  });
});
